import { formatCop } from './format-cop.util';

describe('formatCop', () => {
  it('formats COP values with Colombian thousands separators', () => {
    expect(formatCop(20000)).toBe('$20.000');
    expect(formatCop(1234567)).toBe('$1.234.567');
  });

  it('guards invalid values', () => {
    expect(formatCop(Number.NaN)).toBe('$0');
    expect(formatCop(-2000)).toBe('$0');
  });
});

