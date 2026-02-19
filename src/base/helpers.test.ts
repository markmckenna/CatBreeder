import { describe, it, expect } from 'vitest';
import { capitalize, formatCurrency } from './helpers.ts';

describe('helpers', () => {
  describe('capitalize', () => {
    it('capitalizes a lowercase word', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles already capitalized words', () => {
      expect(capitalize('WORLD')).toBe('World');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD by default', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('formats EUR', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
    });
  });
});
