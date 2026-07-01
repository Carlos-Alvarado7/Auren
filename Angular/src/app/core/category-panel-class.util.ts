export function getCategoryPanelClass(title: string): string {
  const normalizedTitle = normalizeTitle(title);
  const classes: string[] = [];

  if (normalizedTitle.includes('burger')) {
    classes.push('category-panel--wide');
  }

  if (normalizedTitle.includes('adicional')) {
    classes.push('category-panel--ribbon');
  }

  if (normalizedTitle.includes('guarnicion')) {
    classes.push('category-panel--single-line-title');
  }

  return classes.join(' ');
}

function normalizeTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}
