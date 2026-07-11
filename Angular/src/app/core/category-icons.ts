export interface CategoryIconOption {
  value: string;
  label: string;
  description: string;
}

export const CATEGORY_ICON_OPTIONS: readonly CategoryIconOption[] = [
  { value: 'cloche', label: 'Sugerencias', description: 'Plato especial' },
  { value: 'fries', label: 'Papas', description: 'Papas y acompanantes' },
  { value: 'burger', label: 'Burgers', description: 'Hamburguesas' },
  { value: 'plus', label: 'Adicionales', description: 'Extras y adiciones' },
  { value: 'chicken', label: 'Pollo', description: 'Pollo y alitas' },
  { value: 'meat', label: 'Carnes', description: 'Cortes y parrilla' },
  { value: 'grill', label: 'Parrilla', description: 'Asados y brasas' },
  { value: 'ribs', label: 'Costillas', description: 'Costillas y BBQ' },
  { value: 'fish', label: 'Pescados', description: 'Mar y pescados' },
  { value: 'shrimp', label: 'Mariscos', description: 'Camarones y mar' },
  { value: 'salad', label: 'Ensaladas', description: 'Frescos y vegetales' },
  { value: 'drink', label: 'Bebidas', description: 'Cocteles y bebidas' },
  { value: 'cocktail', label: 'Cocteles', description: 'Mixologia y tragos' },
  { value: 'wine', label: 'Vinos', description: 'Vinos y celebracion' },
  { value: 'coffee', label: 'Cafe', description: 'Cafe y calientes' },
  { value: 'dessert', label: 'Postres', description: 'Dulces y finales' },
  { value: 'icecream', label: 'Helados', description: 'Helados y dulces' },
  { value: 'utensils', label: 'Mesa', description: 'Cubiertos y servicio' },
  { value: 'pizza', label: 'Horno', description: 'Horno y masas' },
  { value: 'pasta', label: 'Pastas', description: 'Pastas y salsas' },
  { value: 'taco', label: 'Tacos', description: 'Tacos y wraps' },
  { value: 'hotdog', label: 'Perros', description: 'Perros calientes' },
  { value: 'sandwich', label: 'Sandwiches', description: 'Sandwich y paninis' },
  { value: 'soup', label: 'Sopas', description: 'Cremas y sopas' },
  { value: 'rice', label: 'Guarniciones', description: 'Arroz y acompanantes' },
  { value: 'pepper', label: 'Picantes', description: 'Salsas y picante' },
  { value: 'breakfast', label: 'Desayunos', description: 'Huevos y manana' },
  { value: 'diamond', label: 'Generico', description: 'Icono neutral' }
];

export function normalizeCategoryIcon(icon: string | null | undefined): string {
  const value = icon?.trim();

  if (!value) {
    return 'diamond';
  }

  return CATEGORY_ICON_OPTIONS.some((option) => option.value === value) ? value : 'diamond';
}

export function getCategoryIconOption(icon: string | null | undefined): CategoryIconOption {
  const normalizedIcon = normalizeCategoryIcon(icon);

  return CATEGORY_ICON_OPTIONS.find((option) => option.value === normalizedIcon) ?? CATEGORY_ICON_OPTIONS[0];
}
