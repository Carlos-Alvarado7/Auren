import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateCategoryDto,
  CreateProductDto,
  ReorderMenuDto,
  UpdateCategoryDto,
  UpdateMenuMetaDto,
  UpdateProductDto
} from './dto/menu.dto';
import { defaultAurenMenu, DEFAULT_MENU_SLUG } from './menu.defaults';
import { Menu, MenuCategory, MenuDocument, MenuProduct, MenuProductVariant, MenuVersion } from './menu.schema';
import { PublicMenuResponse, buildPublicMenu, cloneMenuVersion } from './menu.presenter';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private readonly menuModel: Model<Menu>) {}

  async ensureDefaultMenu(): Promise<void> {
    const exists = await this.menuModel.exists({ slug: DEFAULT_MENU_SLUG }).exec();
    if (exists) {
      return;
    }

    await this.menuModel.create({
      slug: DEFAULT_MENU_SLUG,
      draft: defaultAurenMenu,
      published: defaultAurenMenu,
      publishedAt: new Date()
    });
  }

  async syncMissingDefaultContent(): Promise<boolean> {
    const menu = await this.menuModel.findOne({ slug: DEFAULT_MENU_SLUG }).exec();
    if (!menu) {
      await this.ensureDefaultMenu();
      return true;
    }

    const draftChanged = mergeMissingVersionContent(menu.draft, defaultAurenMenu);
    const publishedChanged = mergeMissingVersionContent(menu.published, defaultAurenMenu);

    if (!draftChanged && !publishedChanged) {
      return false;
    }

    menu.markModified('draft');
    menu.markModified('published');
    await menu.save();
    return true;
  }

  async getPublicMenu(slug: string): Promise<PublicMenuResponse> {
    const menu = await this.menuModel.findOne({ slug }).lean<Menu>().exec();
    if (!menu) {
      throw new NotFoundException('Carta no encontrada.');
    }

    return buildPublicMenu(menu);
  }

  async getAdminMenu(slug = DEFAULT_MENU_SLUG): Promise<MenuDocument> {
    const menu = await this.menuModel.findOne({ slug }).exec();
    if (!menu) {
      throw new NotFoundException('Carta no encontrada.');
    }

    menu.draft.categories.sort((first, second) => first.sortOrder - second.sortOrder);
    for (const category of menu.draft.categories) {
      category.products.sort((first, second) => first.sortOrder - second.sortOrder);
    }

    return menu;
  }

  async updateMeta(dto: UpdateMenuMetaDto): Promise<MenuDocument> {
    const menu = await this.getAdminMenu();
    if (dto.brandName !== undefined) {
      menu.draft.brandName = dto.brandName;
    }
    if (dto.subtitle !== undefined) {
      menu.draft.subtitle = dto.subtitle;
    }

    return menu.save();
  }

  async createCategory(dto: CreateCategoryDto): Promise<MenuDocument> {
    const menu = await this.getAdminMenu();
    menu.draft.categories.push({
      _id: new Types.ObjectId(),
      title: dto.title,
      icon: dto.icon,
      visible: dto.visible ?? true,
      sortOrder: dto.sortOrder ?? nextSortOrder(menu.draft.categories),
      products: []
    } as MenuCategory);

    return menu.save();
  }

  async updateCategory(categoryId: string, dto: UpdateCategoryDto): Promise<MenuDocument> {
    const menu = await this.getAdminMenu();
    const category = findCategory(menu.draft, categoryId);

    if (dto.title !== undefined) category.title = dto.title;
    if (dto.icon !== undefined) category.icon = dto.icon;
    if (dto.visible !== undefined) category.visible = dto.visible;
    if (dto.sortOrder !== undefined) category.sortOrder = dto.sortOrder;

    return menu.save();
  }

  async deleteCategory(categoryId: string): Promise<MenuDocument> {
    const menu = await this.getAdminMenu();
    const originalLength = menu.draft.categories.length;
    menu.draft.categories = menu.draft.categories.filter((category) => category._id.toString() !== categoryId);

    if (menu.draft.categories.length === originalLength) {
      throw new NotFoundException('Categoría no encontrada.');
    }

    return menu.save();
  }

  async createProduct(categoryId: string, dto: CreateProductDto): Promise<MenuDocument> {
    const menu = await this.getAdminMenu();
    const category = findCategory(menu.draft, categoryId);
    category.products.push({
      _id: new Types.ObjectId(),
      name: dto.name,
      description: dto.description ?? '',
      priceCop: dto.priceCop,
      variants: normalizeVariants(dto.variants ?? []),
      visible: dto.visible ?? true,
      available: dto.available ?? true,
      sortOrder: dto.sortOrder ?? nextSortOrder(category.products)
    } as MenuProduct);

    return menu.save();
  }

  async updateProduct(categoryId: string, productId: string, dto: UpdateProductDto): Promise<MenuDocument> {
    const menu = await this.getAdminMenu();
    const product = findProduct(findCategory(menu.draft, categoryId), productId);

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.priceCop !== undefined) product.priceCop = dto.priceCop;
    if (dto.variants !== undefined) product.variants = normalizeVariants(dto.variants);
    if (dto.visible !== undefined) product.visible = dto.visible;
    if (dto.available !== undefined) product.available = dto.available;
    if (dto.sortOrder !== undefined) product.sortOrder = dto.sortOrder;

    return menu.save();
  }

  async deleteProduct(categoryId: string, productId: string): Promise<MenuDocument> {
    const menu = await this.getAdminMenu();
    const category = findCategory(menu.draft, categoryId);
    const originalLength = category.products.length;
    category.products = category.products.filter((product) => product._id.toString() !== productId);

    if (category.products.length === originalLength) {
      throw new NotFoundException('Producto no encontrado.');
    }

    return menu.save();
  }

  async reorder(dto: ReorderMenuDto): Promise<MenuDocument> {
    const menu = await this.getAdminMenu();

    for (const categoryOrder of dto.categories ?? []) {
      const category = findCategory(menu.draft, categoryOrder.categoryId);
      category.sortOrder = categoryOrder.sortOrder;
    }

    if (dto.categoryId && dto.products) {
      const category = findCategory(menu.draft, dto.categoryId);
      for (const productOrder of dto.products) {
        const product = findProduct(category, productOrder.productId);
        product.sortOrder = productOrder.sortOrder;
      }
    }

    return menu.save();
  }

  async publish(): Promise<MenuDocument> {
    const menu = await this.getAdminMenu();
    menu.published = cloneMenuVersion(menu.draft);
    menu.publishedAt = new Date();
    return menu.save();
  }
}

function findCategory(version: MenuVersion, categoryId: string): MenuCategory {
  const category = version.categories.find((item) => item._id.toString() === categoryId);
  if (!category) {
    throw new NotFoundException('Categoría no encontrada.');
  }
  return category;
}

function findProduct(category: MenuCategory, productId: string): MenuProduct {
  const product = category.products.find((item) => item._id.toString() === productId);
  if (!product) {
    throw new NotFoundException('Producto no encontrado.');
  }
  return product;
}

function nextSortOrder(items: Array<{ sortOrder: number }>): number {
  const max = items.reduce((currentMax, item) => Math.max(currentMax, item.sortOrder), 0);
  return max + 10;
}

function normalizeVariants(
  variants: Array<{ name: string; priceCop: number; visible?: boolean; sortOrder?: number }>
): MenuProductVariant[] {
  return variants.map((variant, index) => ({
    name: variant.name,
    priceCop: variant.priceCop,
    visible: variant.visible ?? true,
    sortOrder: variant.sortOrder ?? (index + 1) * 10
  }));
}

const DEFAULT_VISIBLE_SECTION_NAMES = new Set(['pollo reale', 'guarniciones']);

function mergeMissingVersionContent(target: MenuVersion, source: MenuVersion): boolean {
  let changed = false;

  for (const sourceCategory of source.categories) {
    const targetCategory = target.categories.find(
      (category) => normalizeName(category.title) === normalizeName(sourceCategory.title)
    );

    if (!targetCategory) {
      target.categories.push(cloneMenuVersion({ ...source, categories: [sourceCategory] }).categories[0]);
      changed = true;
      continue;
    }

    const shouldPromoteDefaultSectionVisibility = shouldPromoteMissingDefaultSectionVisibility(
      sourceCategory,
      targetCategory
    );

    if (shouldPromoteDefaultSectionVisibility) {
      targetCategory.visible = true;
      changed = true;
    }

    for (const sourceProduct of sourceCategory.products) {
      const targetProduct = targetCategory.products.find(
        (product) => normalizeName(product.name) === normalizeName(sourceProduct.name)
      );

      if (!targetProduct) {
        targetCategory.products.push(JSON.parse(JSON.stringify(sourceProduct)) as MenuProduct);
        changed = true;
        continue;
      }

      if (shouldPromoteDefaultSectionVisibility && sourceProduct.visible && !targetProduct.visible) {
        targetProduct.visible = true;
        changed = true;
      }

      for (const sourceVariant of sourceProduct.variants ?? []) {
        const targetVariantExists = (targetProduct.variants ?? []).some(
          (variant) => normalizeName(variant.name) === normalizeName(sourceVariant.name)
        );

        if (!targetVariantExists) {
          targetProduct.variants.push(JSON.parse(JSON.stringify(sourceVariant)) as MenuProductVariant);
          changed = true;
        }
      }
    }
  }

  return changed;
}

function shouldPromoteMissingDefaultSectionVisibility(
  sourceCategory: MenuCategory,
  targetCategory: MenuCategory
): boolean {
  return (
    DEFAULT_VISIBLE_SECTION_NAMES.has(normalizeName(sourceCategory.title)) &&
    sourceCategory.visible &&
    !targetCategory.visible &&
    targetCategory.products.every((product) => !product.visible)
  );
}

function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}
