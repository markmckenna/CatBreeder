import { describe, it, expect } from 'vitest';
import {
  createMarketState,
  calculateCatValue,
  getTraitMultiplier,
  getValueBreakdown,
  formatMoney,
  DEFAULT_TRAIT_VALUES,
} from './market.ts';
import type { Cat, CatPhenotype } from '../cats/genetics.ts';

describe('market', () => {
  const createTestCat = (phenotype: Partial<CatPhenotype>, happiness = 100): Cat => ({
    id: 'test-cat',
    name: 'Test',
    genotype: {
      size: ['S', 'S'],
      tailLength: ['T', 'T'],
      earShape: ['E', 'E'],
      tailColor: ['O', 'O'],
    },
    phenotype: {
      size: 'large',
      tailLength: 'long',
      earShape: 'pointed',
      tailColor: 'orange',
      ...phenotype,
    },
    age: 100,
    happiness,
  });

  describe('createMarketState', () => {
    it('creates market with base price of 100', () => {
      const market = createMarketState();
      expect(market.basePrice).toBe(100);
    });

    it('uses default trait values', () => {
      const market = createMarketState();
      expect(market.traitValues).toEqual(DEFAULT_TRAIT_VALUES);
    });
  });

  describe('getTraitMultiplier', () => {
    it('returns 1.0 for all dominant traits', () => {
      const phenotype: CatPhenotype = {
        size: 'large',
        tailLength: 'long',
        earShape: 'pointed',
        tailColor: 'orange',
      };
      expect(getTraitMultiplier(phenotype, DEFAULT_TRAIT_VALUES)).toBe(1.0);
    });

    it('returns higher multiplier for rare recessive traits', () => {
      const commonCat: CatPhenotype = {
        size: 'large',
        tailLength: 'long',
        earShape: 'pointed',
        tailColor: 'orange',
      };
      const rareCat: CatPhenotype = {
        size: 'small',
        tailLength: 'short',
        earShape: 'folded',
        tailColor: 'white',
      };

      const commonMultiplier = getTraitMultiplier(commonCat, DEFAULT_TRAIT_VALUES);
      const rareMultiplier = getTraitMultiplier(rareCat, DEFAULT_TRAIT_VALUES);

      expect(rareMultiplier).toBeGreaterThan(commonMultiplier);
    });

    it('folded ears have 2x multiplier', () => {
      const pointed: CatPhenotype = {
        size: 'large',
        tailLength: 'long',
        earShape: 'pointed',
        tailColor: 'orange',
      };
      const folded: CatPhenotype = {
        size: 'large',
        tailLength: 'long',
        earShape: 'folded',
        tailColor: 'orange',
      };

      const pointedMult = getTraitMultiplier(pointed, DEFAULT_TRAIT_VALUES);
      const foldedMult = getTraitMultiplier(folded, DEFAULT_TRAIT_VALUES);

      expect(foldedMult / pointedMult).toBe(2.0);
    });
  });

  describe('calculateCatValue', () => {
    const market = createMarketState();

    it('common cat at 100% happiness equals base price', () => {
      const cat = createTestCat({}, 100);
      const value = calculateCatValue(cat, market);
      // Base 100 * 1.0 traits * 1.2 happiness = 120
      expect(value).toBe(120);
    });

    it('rare traits increase value', () => {
      const commonCat = createTestCat({ earShape: 'pointed' });
      const rareCat = createTestCat({ earShape: 'folded' });

      expect(calculateCatValue(rareCat, market)).toBeGreaterThan(
        calculateCatValue(commonCat, market)
      );
    });

    it('low happiness decreases value', () => {
      const happyCat = createTestCat({}, 100);
      const sadCat = createTestCat({}, 0);

      expect(calculateCatValue(sadCat, market)).toBeLessThan(
        calculateCatValue(happyCat, market)
      );
    });

    it('unhappy cat is worth 80% of base', () => {
      const sadCat = createTestCat({}, 0);
      // Base 100 * 1.0 traits * 0.8 happiness = 80
      expect(calculateCatValue(sadCat, market)).toBe(80);
    });
  });

  describe('getValueBreakdown', () => {
    const market = createMarketState();

    it('returns empty for common traits', () => {
      const cat = createTestCat({});
      const breakdown = getValueBreakdown(cat, market);
      expect(breakdown).toHaveLength(0);
    });

    it('lists valuable traits', () => {
      const cat = createTestCat({
        size: 'small',
        earShape: 'folded',
      });
      const breakdown = getValueBreakdown(cat, market);

      expect(breakdown).toContainEqual({ trait: 'small size', multiplier: 1.5 });
      expect(breakdown).toContainEqual({ trait: 'folded ears', multiplier: 2.0 });
    });
  });

  describe('formatMoney', () => {
    it('formats with dollar sign', () => {
      expect(formatMoney(100)).toBe('$100');
    });

    it('adds thousand separators', () => {
      expect(formatMoney(1000)).toBe('$1,000');
      expect(formatMoney(1000000)).toBe('$1,000,000');
    });
  });
});
