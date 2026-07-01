import { AdminMenu, MenuCategory, MenuProduct, PublicMenu } from './menu.models';

export function normalizePublicMenu(menu: PublicMenu): PublicMenu {
  return {
    ...menu,
    categories: normalizeCategories(menu.categories)
  };
}

export function normalizeAdminMenu(menu: AdminMenu): AdminMenu {
  return {
    ...menu,
    draft: {
      ...menu.draft,
      categories: normalizeCategories(menu.draft.categories)
    },
    published: {
      ...menu.published,
      categories: normalizeCategories(menu.published.categories)
    }
  };
}

function normalizeCategories(categories: MenuCategory[]): MenuCategory[] {
  return categories.map((category) => ({
    ...category,
    id: category.id ?? category._id ?? '',
    products: category.products.map(normalizeProduct)
  }));
}

function normalizeProduct(product: MenuProduct): MenuProduct {
  return {
    ...product,
    id: product.id ?? product._id ?? '',
    variants: product.variants ?? []
  };
}

