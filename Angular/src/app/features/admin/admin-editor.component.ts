import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AdminProductStateFilter,
  getAdminProductStateClass,
  getAdminProductStateLabel,
  matchesAdminProductState,
  normalizeAdminSearch
} from '../../core/admin-product-state.util';
import { formatAdminPriceInput, parseAdminPriceInput } from '../../core/admin-price-input.util';
import { AuthService } from '../../core/auth.service';
import { CATEGORY_ICON_OPTIONS, CategoryIconOption, getCategoryIconOption } from '../../core/category-icons';
import { CopCurrencyPipe } from '../../core/cop-currency.pipe';
import { MenuApiService } from '../../core/menu-api.service';
import { AdminMenu, MenuCategory, MenuProduct, MenuVariant } from '../../core/menu.models';
import { CategoryIconSvgComponent } from '../../shared/category-icon-svg.component';

interface CategoryForm {
  id: string | null;
  title: string;
  icon: string;
  visible: boolean;
}

interface ProductForm {
  id: string | null;
  name: string;
  description: string;
  priceCop: number;
  visible: boolean;
  available: boolean;
  variants: MenuVariant[];
}

interface ProductTableRow {
  category: MenuCategory;
  product: MenuProduct;
}

@Component({
  selector: 'auren-admin-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CopCurrencyPipe, CategoryIconSvgComponent],
  templateUrl: './admin-editor.component.html',
  styleUrls: ['./admin-editor.component.css']
})
export class AdminEditorComponent implements OnInit {
  readonly categoryIconOptions: readonly CategoryIconOption[] = CATEGORY_ICON_OPTIONS;
  menu: AdminMenu | null = null;
  selectedCategoryId = '';
  loading = true;
  saving = false;
  message = '';
  error = '';
  iconPickerOpen = false;
  productCategoryFilterId = 'all';
  productStateFilter: AdminProductStateFilter = 'all';
  productSearch = '';
  productPriceText = formatAdminPriceInput(0);

  categoryForm: CategoryForm = this.emptyCategoryForm();
  productForm: ProductForm = this.emptyProductForm();

  constructor(
    private readonly menuApiService: MenuApiService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  get categories(): MenuCategory[] {
    return this.menu?.draft.categories ?? [];
  }

  get selectedCategory(): MenuCategory | null {
    return this.categories.find((category) => category.id === this.selectedCategoryId) ?? this.categories[0] ?? null;
  }

  get productRows(): ProductTableRow[] {
    return [...this.categories]
      .sort((first, second) => first.sortOrder - second.sortOrder)
      .flatMap((category) =>
        [...category.products]
          .sort((first, second) => first.sortOrder - second.sortOrder)
          .map((product) => ({ category, product }))
      );
  }

  get filteredProductRows(): ProductTableRow[] {
    const query = normalizeAdminSearch(this.productSearch);

    return this.productRows.filter(({ category, product }) => {
      const matchesCategory = this.productCategoryFilterId === 'all' || category.id === this.productCategoryFilterId;
      const searchableText = normalizeAdminSearch(`${product.name} ${product.description ?? ''} ${category.title}`);
      const matchesSearch = !query || searchableText.includes(query);
      const matchesState = matchesAdminProductState(product, this.productStateFilter);

      return matchesCategory && matchesSearch && matchesState;
    });
  }

  get selectedCategoryIconOption(): CategoryIconOption {
    return getCategoryIconOption(this.categoryForm.icon);
  }

  @HostListener('document:keydown.escape')
  closeIconPickerOnEscape(): void {
    this.closeIconPicker();
  }

  loadMenu(): void {
    this.loading = true;
    this.menuApiService.getAdminMenu().subscribe({
      next: (menu) => {
        this.applyMenu(menu);
        this.loading = false;
      },
      error: () => {
        this.error = 'No fue posible cargar la carta administrativa.';
        this.loading = false;
      }
    });
  }

  saveMeta(): void {
    if (!this.menu) {
      return;
    }

    this.persist(
      this.menuApiService.updateMeta({
        brandName: this.menu.draft.brandName,
        subtitle: this.menu.draft.subtitle
      }),
      'Identidad de carta actualizada.'
    );
  }

  selectCategory(category: MenuCategory): void {
    this.productCategoryFilterId = category.id;
    this.setSelectedCategory(category);
  }

  editProductFromRow(row: ProductTableRow): void {
    this.setSelectedCategory(row.category);
    this.editProduct(row.product);
  }

  moveProductFromRow(row: ProductTableRow, direction: -1 | 1): void {
    this.setSelectedCategory(row.category);
    this.moveProduct(row.product, direction);
  }

  hideProductFromRow(row: ProductTableRow): void {
    if (!row.product.visible) {
      return;
    }

    this.setSelectedCategory(row.category);
    this.productForm.visible = false;
    this.persist(
      this.menuApiService.updateProduct(row.category.id, row.product.id, { visible: false }),
      'Producto oculto en borrador. Al publicar cambios no aparecerá en la carta del cliente.'
    );
  }

  clearProductFilters(): void {
    this.productCategoryFilterId = 'all';
    this.productStateFilter = 'all';
    this.productSearch = '';
  }

  productStateLabel(product: MenuProduct): string {
    return getAdminProductStateLabel(product);
  }

  productStateClass(product: MenuProduct): string {
    return getAdminProductStateClass(product);
  }

  publishedLabel(): string {
    if (!this.menu?.publishedAt) {
      return 'Sin publicación registrada';
    }

    try {
      return new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(this.menu.publishedAt));
    } catch {
      return this.menu.publishedAt;
    }
  }

  private setSelectedCategory(category: MenuCategory): void {
    this.selectedCategoryId = category.id;
    this.categoryForm = {
      id: category.id,
      title: category.title,
      icon: category.icon ?? '',
      visible: category.visible ?? true
    };
    this.productForm = this.emptyProductForm();
    this.productPriceText = formatAdminPriceInput(this.productForm.priceCop);
  }

  newCategory(): void {
    this.categoryForm = this.emptyCategoryForm();
  }

  openIconPicker(): void {
    this.iconPickerOpen = true;
  }

  closeIconPicker(): void {
    this.iconPickerOpen = false;
  }

  selectCategoryIcon(icon: string): void {
    this.categoryForm.icon = icon;
    this.closeIconPicker();
  }

  saveCategory(): void {
    const payload = {
      title: this.categoryForm.title.trim(),
      icon: this.categoryForm.icon.trim() || undefined,
      visible: this.categoryForm.visible
    };

    if (!payload.title) {
      this.error = 'La categoría necesita un nombre.';
      return;
    }

    const request$ = this.categoryForm.id
      ? this.menuApiService.updateCategory(this.categoryForm.id, payload)
      : this.menuApiService.createCategory(payload);

    this.persist(request$, this.categoryForm.id ? 'Categoría actualizada.' : 'Categoría creada.');
  }

  deleteCategory(category: MenuCategory): void {
    if (!confirm(`Eliminar la categoría "${category.title}" y sus productos?`)) {
      return;
    }

    this.persist(this.menuApiService.deleteCategory(category.id), 'Categoría eliminada.');
  }

  editProduct(product: MenuProduct): void {
    this.productForm = {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      priceCop: product.priceCop,
      visible: product.visible ?? true,
      available: product.available,
      variants: clone(product.variants)
    };
    this.productPriceText = formatAdminPriceInput(this.productForm.priceCop);
  }

  newProduct(): void {
    if (this.productCategoryFilterId !== 'all') {
      const filteredCategory = this.categories.find((category) => category.id === this.productCategoryFilterId);
      if (filteredCategory) {
        this.setSelectedCategory(filteredCategory);
      }
    }

    this.productForm = this.emptyProductForm();
    this.productPriceText = formatAdminPriceInput(this.productForm.priceCop);
  }

  updateProductPrice(value: string): void {
    this.productForm.priceCop = parseAdminPriceInput(value);
    this.productPriceText = formatAdminPriceInput(this.productForm.priceCop);
  }

  saveProduct(): void {
    const category = this.selectedCategory;
    if (!category) {
      this.error = 'Primero cree una categoría.';
      return;
    }

    const payload = {
      name: this.productForm.name.trim(),
      description: this.productForm.description.trim(),
      priceCop: parseAdminPriceInput(this.productPriceText),
      visible: this.productForm.visible,
      available: this.productForm.available,
      variants: this.productForm.variants
        .filter((variant) => variant.name.trim().length > 0)
        .map((variant, index) => ({
          name: variant.name.trim(),
          priceCop: Number(variant.priceCop),
          visible: variant.visible ?? true,
          sortOrder: (index + 1) * 10
        }))
    };

    if (!payload.name || payload.priceCop < 0) {
      this.error = 'El producto necesita nombre y precio válido.';
      return;
    }

    const request$ = this.productForm.id
      ? this.menuApiService.updateProduct(category.id, this.productForm.id, payload)
      : this.menuApiService.createProduct(category.id, payload);

    this.persist(request$, this.productForm.id ? 'Producto actualizado.' : 'Producto creado.');
  }

  deleteProduct(product: MenuProduct): void {
    const category = this.selectedCategory;
    if (!category || !confirm(`Eliminar "${product.name}"?`)) {
      return;
    }

    this.persist(this.menuApiService.deleteProduct(category.id, product.id), 'Producto eliminado.');
  }

  addVariant(): void {
    this.productForm.variants.push({
      name: '',
      priceCop: this.productForm.priceCop || 0,
      visible: true,
      sortOrder: (this.productForm.variants.length + 1) * 10
    });
  }

  removeVariant(index: number): void {
    this.productForm.variants.splice(index, 1);
  }

  moveCategory(category: MenuCategory, direction: -1 | 1): void {
    if (!this.menu) {
      return;
    }

    const previousMenu = clone(this.menu);
    const reordered = withUpdatedSortOrder(moveItem(this.categories, category.id, direction));
    if (hasSameOrder(this.categories, reordered)) {
      return;
    }

    this.applyDraftCategories(reordered);
    this.persist(
      this.menuApiService.reorder({
        categories: reordered.map((item) => ({ categoryId: item.id, sortOrder: item.sortOrder }))
      }),
      'Orden de categorías actualizado.',
      previousMenu
    );
  }

  moveProduct(product: MenuProduct, direction: -1 | 1): void {
    const category = this.selectedCategory;
    if (!this.menu || !category) {
      return;
    }

    const previousMenu = clone(this.menu);
    const reordered = withUpdatedSortOrder(moveItem(category.products, product.id, direction));
    if (hasSameOrder(category.products, reordered)) {
      return;
    }

    this.applyDraftProducts(category.id, reordered);
    this.persist(
      this.menuApiService.reorder({
        categoryId: category.id,
        products: reordered.map((item) => ({ productId: item.id, sortOrder: item.sortOrder }))
      }),
      'Orden de productos actualizado.',
      previousMenu
    );
  }

  publish(): void {
    this.persist(this.menuApiService.publish(), 'Carta publicada. Los clientes verán los cambios automáticamente.');
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => void this.router.navigateByUrl('/admin/login'),
      error: () => void this.router.navigateByUrl('/admin/login')
    });
  }

  trackById(_index: number, item: { id: string }): string {
    return item.id;
  }

  private persist(
    request$: ReturnType<MenuApiService['getAdminMenu']>,
    successMessage: string,
    rollbackMenu?: AdminMenu
  ): void {
    this.saving = true;
    this.error = '';
    this.message = '';

    request$.subscribe({
      next: (menu) => {
        this.applyMenu(menu);
        this.message = successMessage;
        this.saving = false;
      },
      error: () => {
        if (rollbackMenu) {
          this.applyMenu(rollbackMenu);
        }

        this.error = 'La operación no pudo completarse. Revise los datos e intente de nuevo.';
        this.saving = false;
      }
    });
  }

  private applyMenu(menu: AdminMenu): void {
    this.menu = menu;
    const currentCategoryStillExists = this.categories.some((category) => category.id === this.selectedCategoryId);
    this.selectedCategoryId = currentCategoryStillExists ? this.selectedCategoryId : this.categories[0]?.id ?? '';
    const currentFilterStillExists =
      this.productCategoryFilterId === 'all' ||
      this.categories.some((category) => category.id === this.productCategoryFilterId);
    this.productCategoryFilterId = currentFilterStillExists ? this.productCategoryFilterId : 'all';

    const selected = this.selectedCategory;
    if (selected && !this.categoryForm.id) {
      this.categoryForm = {
        id: selected.id,
        title: selected.title,
        icon: selected.icon ?? '',
        visible: selected.visible ?? true
      };
    }
  }

  private applyDraftCategories(categories: MenuCategory[]): void {
    if (!this.menu) {
      return;
    }

    this.menu = {
      ...this.menu,
      draft: {
        ...this.menu.draft,
        categories
      }
    };
  }

  private applyDraftProducts(categoryId: string, products: MenuProduct[]): void {
    this.applyDraftCategories(
      this.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products
            }
          : category
      )
    );
  }

  private emptyCategoryForm(): CategoryForm {
    return { id: null, title: '', icon: '', visible: true };
  }

  private emptyProductForm(): ProductForm {
    return {
      id: null,
      name: '',
      description: '',
      priceCop: 0,
      visible: true,
      available: true,
      variants: []
    };
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function moveItem<T extends { id: string }>(items: T[], itemId: string, direction: -1 | 1): T[] {
  const next = [...items];
  const index = next.findIndex((item) => item.id === itemId);
  const targetIndex = index + direction;

  if (index < 0 || targetIndex < 0 || targetIndex >= next.length) {
    return next;
  }

  const [item] = next.splice(index, 1);
  next.splice(targetIndex, 0, item);
  return next;
}

function withUpdatedSortOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    sortOrder: (index + 1) * 10
  }));
}

function hasSameOrder<T extends { id: string }>(current: T[], next: T[]): boolean {
  return current.length === next.length && current.every((item, index) => item.id === next[index]?.id);
}
