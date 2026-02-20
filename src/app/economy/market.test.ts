import { describe, it, expect } from 'vitest';
import {
  createMarketState,
  calculateCatValue,
  calculatePurchasePrice,
  getTraitMultiplier,
  getValueBreakdown,
  generateMarketInventory,
  DEFAULT_TRAIT_VALUES,
  MARKET_BUY_PREMIUM,
  MARKET_INVENTORY_SIZE,
} from './market.ts';
import type { Cat, CatPhenotype } from '../cats/genetics.ts';
import { createSeededRandom } from '@/base/random.ts';

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
      // Base 100 * 1.0 traits * 1.0 happiness = 100
      expect(value).toBe(100);
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

    it('unhappy cat is worth $0', () => {
      const sadCat = createTestCat({}, 0);
      // Base 100 * 1.0 traits * 0.0 happiness = 0
      expect(calculateCatValue(sadCat, market)).toBe(0);
    });

    it('half-happy cat is worth half price', () => {
      const halfHappyCat = createTestCat({}, 50);
      // Base 100 * 1.0 traits * 0.5 happiness = 50
      expect(calculateCatValue(halfHappyCat, market)).toBe(50);
    });

    it('returns same value without fluctuation on repeated calls', () => {
      const cat = createTestCat({}, 100);
      const value1 = calculateCatValue(cat, market);
      const value2 = calculateCatValue(cat, market);
      expect(value1).toBe(value2);
    });

    it('returns varying values with fluctuation enabled', () => {
      const cat = createTestCat({}, 100);
      // Call multiple times and check we get some variance
      const values = Array.from({ length: 10 }, () => 
        calculateCatValue(cat, market, { fluctuate: true })
      );
      
      // With fluctuation, not all values should be identical
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBeGreaterThan(1);
    });

    it('fluctuation stays within reasonable bounds', () => {
      const cat = createTestCat({}, 100);
      const baseValue = calculateCatValue(cat, market);
      
      // Run many trials to check bounds
      for (let i = 0; i < 100; i++) {
        const value = calculateCatValue(cat, market, { fluctuate: true });
        // Should generally stay within ±20% of base (4 traits * ~10% each, worst case)
        expect(value).toBeGreaterThan(baseValue * 0.7);
        expect(value).toBeLessThan(baseValue * 1.3);
      }
    });

    it('produces deterministic results with seeded RNG', () => {
      const cat = createTestCat({}, 100);
      const rng1 = createSeededRandom(42);
      const rng2 = createSeededRandom(42);
      
      const value1 = calculateCatValue(cat, market, { fluctuate: true, random: rng1 });
      const value2 = calculateCatValue(cat, market, { fluctuate: true, random: rng2 });
      
      expect(value1).toBe(value2);
    });

    it('applies 20% premium for kittens under 4 weeks', () => {
      const adultCat = createTestCat({}, 100);
      adultCat.age = 10;
      const kittenCat = createTestCat({}, 100);
      kittenCat.age = 2;
      
      const adultValue = calculateCatValue(adultCat, market);
      const kittenValue = calculateCatValue(kittenCat, market);
      
      expect(kittenValue).toBe(Math.round(adultValue * 1.2));
    });

    it('does not apply kitten premium at exactly 4 weeks', () => {
      const cat4Weeks = createTestCat({}, 100);
      cat4Weeks.age = 4;
      const catAdult = createTestCat({}, 100);
      catAdult.age = 10;
      
      const value4Weeks = calculateCatValue(cat4Weeks, market);
      const valueAdult = calculateCatValue(catAdult, market);
      
      expect(value4Weeks).toBe(valueAdult);
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

    it('includes kitten premium in breakdown', () => {
      const kitten = createTestCat({});
      kitten.age = 2;
      const breakdown = getValueBreakdown(kitten, market);
      
      expect(breakdown).toContainEqual({ trait: 'kitten', multiplier: 1.2 });
    });

    it('does not include kitten for cats 4+ weeks', () => {
      const adult = createTestCat({});
      adult.age = 5;
      const breakdown = getValueBreakdown(adult, market);
      
      expect(breakdown.find(b => b.trait === 'kitten')).toBeUndefined();
    });
  });

  describe('calculatePurchasePrice', () => {
    const market = createMarketState();

    it('includes 20% premium over sale value', () => {
      const cat = createTestCat({}, 100);
      const sellValue = calculateCatValue(cat, market);
      const buyPrice = calculatePurchasePrice(cat, market);
      
      expect(buyPrice).toBe(Math.round(sellValue * (1 + MARKET_BUY_PREMIUM)));
    });

    it('premium is 20%', () => {
      expect(MARKET_BUY_PREMIUM).toBe(0.2);
    });
  });

  describe('generateMarketInventory', () => {
    const market = createMarketState();

    it('generates 3 cats by default', () => {
      const inventory = generateMarketInventory(market);
      expect(inventory).toHaveLength(MARKET_INVENTORY_SIZE);
      expect(MARKET_INVENTORY_SIZE).toBe(3);
    });

    it('each entry has cat and price', () => {
      const inventory = generateMarketInventory(market);
      for (const entry of inventory) {
        expect(entry).toHaveProperty('cat');
        expect(entry).toHaveProperty('price');
        expect(entry.cat).toHaveProperty('id');
        expect(entry.cat).toHaveProperty('name');
        expect(entry.cat).toHaveProperty('genotype');
        expect(entry.price).toBeGreaterThan(0);
      }
    });

    it('prices include market premium', () => {
      const inventory = generateMarketInventory(market);
      for (const { cat, price } of inventory) {
        const expectedPrice = calculatePurchasePrice(cat, market);
        expect(price).toBe(expectedPrice);
      }
    });

    it('produces deterministic results with seeded RNG', () => {
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(12345);
      
      const inventory1 = generateMarketInventory(market, rng1);
      const inventory2 = generateMarketInventory(market, rng2);
      
      expect(inventory1[0].cat.id).toBe(inventory2[0].cat.id);
      expect(inventory1[0].cat.name).toBe(inventory2[0].cat.name);
      expect(inventory1[1].price).toBe(inventory2[1].price);
    });
  });
});
