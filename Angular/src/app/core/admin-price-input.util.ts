export function formatAdminPriceInput(value: number): string {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
  return safeValue.toLocaleString('es-CO');
}

export function parseAdminPriceInput(value: string): number {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}
