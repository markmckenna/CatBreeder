import { describe, it, expect } from 'vitest';
import { add, multiply, capitalize, formatCurrency } from './helpers.ts';

describe('helpers', () => {
  describe('add', () => {
    it('adds two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('adds negative numbers', () => {
      expect(add(-1, -2)).toBe(-3);
    });

    it('adds zero', () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('multiplies two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('multiplies by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it('multiplies negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6);
    });
  });

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
