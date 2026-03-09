/**
 * Tests for genetics utility functions.
 */

import { describe, it, expect } from 'vitest';
import { getBreedingStatus, getBreedingStatusColor } from './genetics.ts';

describe('genetics utilities', () => {
  describe('getBreedingStatus', () => {
    describe('Pure breeding (homozygous recessive)', () => {
      it('returns "pure" for lowercase + lowercase', () => {
        expect(getBreedingStatus(['s', 's'])).toBe('pure');
        expect(getBreedingStatus(['b', 'b'])).toBe('pure');
        expect(getBreedingStatus(['l', 'l'])).toBe('pure');
      });
    });

    describe('Carrier (heterozygous)', () => {
      it('returns "carrier" for lowercase + uppercase', () => {
        expect(getBreedingStatus(['s', 'S'])).toBe('carrier');
        expect(getBreedingStatus(['S', 's'])).toBe('carrier');
      });

      it('returns "carrier" for uppercase + lowercase (order independent)', () => {
        expect(getBreedingStatus(['B', 'b'])).toBe('carrier');
        expect(getBreedingStatus(['b', 'B'])).toBe('carrier');
      });
    });

    describe('Dominant (homozygous dominant)', () => {
      it('returns "dominant" for uppercase + uppercase', () => {
        expect(getBreedingStatus(['S', 'S'])).toBe('dominant');
        expect(getBreedingStatus(['B', 'B'])).toBe('dominant');
        expect(getBreedingStatus(['L', 'L'])).toBe('dominant');
      });
    });

    describe('Edge cases', () => {
      it('handles all lowercase trait combinations', () => {
        const traits = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        traits.forEach(t => {
          expect(getBreedingStatus([t, t])).toBe('pure');
        });
      });

      it('handles all uppercase trait combinations', () => {
        const traits = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        traits.forEach(t => {
          expect(getBreedingStatus([t, t])).toBe('dominant');
        });
      });

      it('correctly identifies carriers with mixed case', () => {
        expect(getBreedingStatus(['A', 'a'])).toBe('carrier');
        expect(getBreedingStatus(['a', 'A'])).toBe('carrier');
        expect(getBreedingStatus(['Z', 'z'])).toBe('carrier');
        expect(getBreedingStatus(['z', 'Z'])).toBe('carrier');
      });
    });
  });

  describe('getBreedingStatusColor', () => {
    it('returns green for pure breeding', () => {
      expect(getBreedingStatusColor('pure')).toBe('#66BB6A');
    });

    it('returns orange for carrier status', () => {
      expect(getBreedingStatusColor('carrier')).toBe('#FFA726');
    });

    it('returns red for dominant', () => {
      expect(getBreedingStatusColor('dominant')).toBe('#EF5350');
    });

    it('returns consistent colors across multiple calls', () => {
      expect(getBreedingStatusColor('pure')).toBe(getBreedingStatusColor('pure'));
      expect(getBreedingStatusColor('carrier')).toBe(getBreedingStatusColor('carrier'));
      expect(getBreedingStatusColor('dominant')).toBe(getBreedingStatusColor('dominant'));
    });
  });
});
