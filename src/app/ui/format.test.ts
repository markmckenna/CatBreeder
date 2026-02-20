import { describe, it, expect } from 'vitest';
import { formatMoney } from './format.ts';

describe('formatMoney', () => {
  it('formats with dollar sign', () => {
    expect(formatMoney(100)).toBe('$100');
  });

  it('adds thousand separators', () => {
    expect(formatMoney(1000)).toBe('$1,000');
    expect(formatMoney(1000000)).toBe('$1,000,000');
  });
});
