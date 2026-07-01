import { buildPublicMenu } from './menu.presenter';

describe('buildPublicMenu', () => {
  it('returns only visible categories and products sorted by sortOrder', () => {
    const menu = {
      slug: 'auren',
      publishedAt: new Date('2026-07-01T00:00:00.000Z'),
      published: {
        brandName: 'Áuren',
        subtitle: 'Gastronomy',
        categories: [
          {
            _id: { toString: () => 'hidden-category' },
            title: 'Oculta',
            visible: false,
            sortOrder: 1,
            products: []
          },
          {
            _id: { toString: () => 'cat-2' },
            title: 'Burgers',
            visible: true,
            sortOrder: 20,
            products: [
              {
                _id: { toString: () => 'hidden-product' },
                name: 'Oculto',
                priceCop: 1,
                variants: [],
                visible: false,
                available: true,
                sortOrder: 1
              },
              {
                _id: { toString: () => 'product-2' },
                name: 'Auren',
                description: 'Casa',
                priceCop: 20000,
                variants: [],
                visible: true,
                available: true,
                sortOrder: 20
              }
            ]
          },
          {
            _id: { toString: () => 'cat-1' },
            title: 'Sugerencias',
            visible: true,
            sortOrder: 10,
            products: [
              {
                _id: { toString: () => 'product-1' },
                name: 'Tabla',
                priceCop: 30000,
                variants: [],
                visible: true,
                available: false,
                sortOrder: 10
              }
            ]
          }
        ]
      }
    } as never;

    const publicMenu = buildPublicMenu(menu);

    expect(publicMenu.categories.map((category) => category.title)).toEqual(['Sugerencias', 'Burgers']);
    expect(publicMenu.categories[1].products).toHaveLength(1);
    expect(publicMenu.categories[1].products[0].name).toBe('Auren');
  });
});

