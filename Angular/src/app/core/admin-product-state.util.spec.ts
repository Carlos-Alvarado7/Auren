import {
  getAdminProductStateClass,
  getAdminProductStateLabel,
  matchesAdminProductState,
  normalizeAdminSearch
} from './admin-product-state.util';
import { MenuProduct } from './menu.models';

describe('admin product state utilities', () => {
  const baseProduct: MenuProduct = {
    id: 'product-1',
    name: 'Roll de Tortilla Gourmet',
    description: 'Tortilla de trigo',
    priceCop: 20000,
    variants: [],
    visible: true,
    available: true,
    sortOrder: 10
  };

  it('labels and styles published products', () => {
    expect(getAdminProductStateLabel(baseProduct)).toBe('Publicado');
    expect(getAdminProductStateClass(baseProduct)).toBe('state-published');
    expect(matchesAdminProductState(baseProduct, 'published')).toBe(true);
  });

  it('labels and filters draft products', () => {
    const draftProduct = { ...baseProduct, visible: false };

    expect(getAdminProductStateLabel(draftProduct)).toBe('Borrador');
    expect(getAdminProductStateClass(draftProduct)).toBe('state-draft');
    expect(matchesAdminProductState(draftProduct, 'draft')).toBe(true);
  });

  it('labels and filters unavailable products', () => {
    const unavailableProduct = { ...baseProduct, available: false };

    expect(getAdminProductStateLabel(unavailableProduct)).toBe('No disponible');
    expect(getAdminProductStateClass(unavailableProduct)).toBe('state-unavailable');
    expect(matchesAdminProductState(unavailableProduct, 'unavailable')).toBe(true);
  });

  it('normalizes search text', () => {
    expect(normalizeAdminSearch('  Pápate Croccanti  ')).toBe('papate croccanti');
  });
});
