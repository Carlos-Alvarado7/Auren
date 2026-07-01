import { formatAdminPriceInput, parseAdminPriceInput } from './admin-price-input.util';

describe('admin price input utilities', () => {
  it('formats COP values with Colombian thousands separators without currency symbol', () => {
    expect(formatAdminPriceInput(25000)).toBe('25.000');
    expect(formatAdminPriceInput(1234567)).toBe('1.234.567');
  });

  it('parses formatted COP input back to integer values', () => {
    expect(parseAdminPriceInput('25.000')).toBe(25000);
    expect(parseAdminPriceInput('$ 1.234.567')).toBe(1234567);
    expect(parseAdminPriceInput('')).toBe(0);
  });
});
