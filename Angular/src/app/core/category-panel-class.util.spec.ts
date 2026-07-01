import { getCategoryPanelClass } from './category-panel-class.util';

describe('getCategoryPanelClass', () => {
  it('marks burger sections as wide panels', () => {
    expect(getCategoryPanelClass('Burgers')).toBe('category-panel--wide');
  });

  it('marks adicionales as ribbon panels', () => {
    expect(getCategoryPanelClass('Adicionales')).toBe('category-panel--ribbon');
  });

  it('keeps guarniciones title on a single line', () => {
    expect(getCategoryPanelClass('Guarniciones')).toBe('category-panel--single-line-title');
    expect(getCategoryPanelClass('Guarnición')).toBe('category-panel--single-line-title');
  });
});
