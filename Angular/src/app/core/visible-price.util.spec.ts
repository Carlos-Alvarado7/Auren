import { shouldShowPrice } from './visible-price.util';

describe('shouldShowPrice', () => {
  it('shows only positive COP prices', () => {
    expect(shouldShowPrice(1)).toBe(true);
    expect(shouldShowPrice(20000)).toBe(true);
  });

  it('hides zero, negative and invalid prices', () => {
    expect(shouldShowPrice(0)).toBe(false);
    expect(shouldShowPrice(-1000)).toBe(false);
    expect(shouldShowPrice(Number.NaN)).toBe(false);
  });
});
