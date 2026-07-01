import { Menu, MenuCategory, MenuProduct, MenuVersion } from './menu.schema';

export interface PublicMenuProduct {
  id: string;
  name: string;
  description?: string;
  priceCop: number;
  variants: Array<{ name: string; priceCop: number }>;
  available: boolean;
  sortOrder: number;
}

export interface PublicMenuCategory {
  id: string;
  title: string;
  icon?: string;
  sortOrder: number;
  products: PublicMenuProduct[];
}

export interface PublicMenuResponse {
  slug: string;
  brandName: string;
  subtitle: string;
  publishedAt?: string;
  categories: PublicMenuCategory[];
}

export function sortBySortOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((first, second) => first.sortOrder - second.sortOrder);
}

export function buildPublicMenu(menu: Menu): PublicMenuResponse {
  return {
    slug: menu.slug,
    brandName: menu.published.brandName,
    subtitle: menu.published.subtitle,
    publishedAt: menu.publishedAt?.toISOString(),
    categories: sortBySortOrder(menu.published.categories)
      .filter((category) => category.visible)
      .map(toPublicCategory)
      .filter((category) => category.products.length > 0)
  };
}

export function cloneMenuVersion(version: MenuVersion): MenuVersion {
  return JSON.parse(JSON.stringify(version)) as MenuVersion;
}

function toPublicCategory(category: MenuCategory): PublicMenuCategory {
  return {
    id: category._id.toString(),
    title: category.title,
    icon: category.icon,
    sortOrder: category.sortOrder,
    products: sortBySortOrder(category.products)
      .filter((product) => product.visible)
      .map(toPublicProduct)
  };
}

function toPublicProduct(product: MenuProduct): PublicMenuProduct {
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    priceCop: product.priceCop,
    variants: sortBySortOrder(product.variants)
      .filter((variant) => variant.visible)
      .map((variant) => ({ name: variant.name, priceCop: variant.priceCop })),
    available: product.available,
    sortOrder: product.sortOrder
  };
}

