export function shouldShowPrice(priceCop: number): boolean {
  return Number.isFinite(priceCop) && priceCop > 0;
}
