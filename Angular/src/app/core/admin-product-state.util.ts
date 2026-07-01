import { MenuProduct } from './menu.models';

export type AdminProductStateFilter = 'all' | 'published' | 'draft' | 'unavailable';

export function getAdminProductStateLabel(product: MenuProduct): string {
  if (!product.available) {
    return 'No disponible';
  }

  return product.visible ? 'Publicado' : 'Borrador';
}

export function getAdminProductStateClass(product: MenuProduct): string {
  if (!product.available) {
    return 'state-unavailable';
  }

  return product.visible ? 'state-published' : 'state-draft';
}

export function matchesAdminProductState(product: MenuProduct, filter: AdminProductStateFilter): boolean {
  if (filter === 'published') {
    return Boolean(product.visible) && product.available;
  }

  if (filter === 'draft') {
    return !product.visible;
  }

  if (filter === 'unavailable') {
    return !product.available;
  }

  return true;
}

export function normalizeAdminSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}
