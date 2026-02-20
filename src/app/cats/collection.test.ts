import { describe, it, expect } from 'vitest';
import {
  getPhenotypeKey,
  getAllPhenotypeCombinations,
  createTraitCollection,
  isTraitCollected,
  getCollectedTraitInfo,
  registerBredCat,
  getCollectionProgress,
  serializeCollection,
  deserializeCollection,
} from './collection.ts';
import type { CatPhenotype } from './genetics.ts';
import { createMockCatFromPhenotype } from '@/test/helpers.ts';

describe('trait collection', () => {
  describe('getPhenotypeKey', () => {
    it('creates unique key for phenotype', () => {
      const phenotype: CatPhenotype = {
        size: 'small',
        tailLength: 'short',
        earShape: 'folded',
        tailColor: 'white',
      };
      expect(getPhenotypeKey(phenotype)).toBe('small-short-folded-white');
    });

    it('creates different keys for different phenotypes', () => {
      const p1: CatPhenotype = { size: 'small', tailLength: 'short', earShape: 'folded', tailColor: 'white' };
      const p2: CatPhenotype = { size: 'large', tailLength: 'long', earShape: 'pointed', tailColor: 'orange' };
      
      expect(getPhenotypeKey(p1)).not.toBe(getPhenotypeKey(p2));
    });
  });

  describe('getAllPhenotypeCombinations', () => {
    it('returns exactly 16 combinations', () => {
      const combinations = getAllPhenotypeCombinations();
      expect(combinations).toHaveLength(16);
    });

    it('returns all unique combinations', () => {
      const combinations = getAllPhenotypeCombinations();
      const keys = combinations.map(getPhenotypeKey);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(16);
    });

    it('includes both extremes', () => {
      const combinations = getAllPhenotypeCombinations();
      const keys = combinations.map(getPhenotypeKey);
      
      expect(keys).toContain('small-short-folded-white');  // All recessive
      expect(keys).toContain('large-long-pointed-orange'); // All dominant
    });
  });

  describe('createTraitCollection', () => {
    it('creates empty collection', () => {
      const collection = createTraitCollection();
      expect(collection.collected.size).toBe(0);
    });
  });

  describe('isTraitCollected', () => {
    it('returns false for uncollected trait', () => {
      const collection = createTraitCollection();
      const phenotype: CatPhenotype = { size: 'small', tailLength: 'short', earShape: 'folded', tailColor: 'white' };
      
      expect(isTraitCollected(collection, phenotype)).toBe(false);
    });

    it('returns true after trait is registered', () => {
      let collection = createTraitCollection();
      const phenotype: CatPhenotype = { size: 'small', tailLength: 'short', earShape: 'folded', tailColor: 'white' };
      const cat = createMockCatFromPhenotype(phenotype);
      
      const result = registerBredCat(collection, cat, 1);
      collection = result.collection;
      
      expect(isTraitCollected(collection, phenotype)).toBe(true);
    });
  });

  describe('registerBredCat', () => {
    it('registers new trait and returns updated=true', () => {
      const collection = createTraitCollection();
      const phenotype: CatPhenotype = { size: 'small', tailLength: 'short', earShape: 'folded', tailColor: 'white' };
      const cat = createMockCatFromPhenotype(phenotype, 'FirstCat', 'cat_1');
      
      const result = registerBredCat(collection, cat, 5);
      
      expect(result.updated).toBe(true);
      expect(result.collection.collected.size).toBe(1);
    });

    it('does not overwrite existing trait', () => {
      let collection = createTraitCollection();
      const phenotype: CatPhenotype = { size: 'small', tailLength: 'short', earShape: 'folded', tailColor: 'white' };
      
      const firstCat = createMockCatFromPhenotype(phenotype, 'FirstCat', 'cat_1');
      const secondCat = createMockCatFromPhenotype(phenotype, 'SecondCat', 'cat_2');
      
      const result1 = registerBredCat(collection, firstCat, 5);
      collection = result1.collection;
      
      const result2 = registerBredCat(collection, secondCat, 10);
      
      expect(result2.updated).toBe(false);
      
      const info = getCollectedTraitInfo(result2.collection, phenotype);
      expect(info?.catName).toBe('FirstCat');
      expect(info?.day).toBe(5);
    });

    it('records cat info correctly', () => {
      const collection = createTraitCollection();
      const phenotype: CatPhenotype = { size: 'large', tailLength: 'long', earShape: 'pointed', tailColor: 'orange' };
      const cat = createMockCatFromPhenotype(phenotype, 'BigOrangeCat', 'cat_42');
      
      const result = registerBredCat(collection, cat, 7);
      const info = getCollectedTraitInfo(result.collection, phenotype);
      
      expect(info).toBeDefined();
      expect(info?.catId).toBe('cat_42');
      expect(info?.catName).toBe('BigOrangeCat');
      expect(info?.day).toBe(7);
      expect(info?.phenotype).toEqual(phenotype);
    });
  });

  describe('getCollectionProgress', () => {
    it('returns 0/16 for empty collection', () => {
      const collection = createTraitCollection();
      const progress = getCollectionProgress(collection);
      
      expect(progress.collected).toBe(0);
      expect(progress.total).toBe(16);
      expect(progress.percentage).toBe(0);
    });

    it('updates correctly as traits are added', () => {
      let collection = createTraitCollection();
      const combinations = getAllPhenotypeCombinations();
      
      // Add 4 traits
      for (let i = 0; i < 4; i++) {
        const cat = createMockCatFromPhenotype(combinations[i], `Cat${i}`, `cat_${i}`);
        const result = registerBredCat(collection, cat, i);
        collection = result.collection;
      }
      
      const progress = getCollectionProgress(collection);
      expect(progress.collected).toBe(4);
      expect(progress.percentage).toBe(25);
    });
  });

  describe('serialization', () => {
    it('round-trips correctly', () => {
      let collection = createTraitCollection();
      const phenotype: CatPhenotype = { size: 'small', tailLength: 'short', earShape: 'folded', tailColor: 'white' };
      const cat = createMockCatFromPhenotype(phenotype, 'TestCat', 'cat_1');
      
      const result = registerBredCat(collection, cat, 5);
      collection = result.collection;
      
      const serialized = serializeCollection(collection);
      const deserialized = deserializeCollection(serialized as { collected: Array<[string, { key: string; phenotype: CatPhenotype; catId: string; catName: string; day: number }]> });
      
      expect(deserialized.collected.size).toBe(1);
      expect(isTraitCollected(deserialized, phenotype)).toBe(true);
      
      const info = getCollectedTraitInfo(deserialized, phenotype);
      expect(info?.catName).toBe('TestCat');
    });
  });
});
