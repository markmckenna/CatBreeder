import { describe, it, expect } from 'vitest';
import {
  getSizePhenotype,
  getTailLengthPhenotype,
  getEarShapePhenotype,
  getTailColorPhenotype,
  getPhenotype,
  breedCats,
  createRandomCat,
  getRandomCatName,
} from './genetics.ts';
import type { Cat, CatGenotype } from './genetics.ts';

describe('genetics', () => {
  describe('phenotype determination', () => {
    describe('getSizePhenotype', () => {
      it('returns large when dominant allele present (SS)', () => {
        expect(getSizePhenotype(['S', 'S'])).toBe('large');
      });

      it('returns large when heterozygous (Ss)', () => {
        expect(getSizePhenotype(['S', 's'])).toBe('large');
        expect(getSizePhenotype(['s', 'S'])).toBe('large');
      });

      it('returns small when homozygous recessive (ss)', () => {
        expect(getSizePhenotype(['s', 's'])).toBe('small');
      });
    });

    describe('getTailLengthPhenotype', () => {
      it('returns long when dominant allele present', () => {
        expect(getTailLengthPhenotype(['T', 'T'])).toBe('long');
        expect(getTailLengthPhenotype(['T', 't'])).toBe('long');
      });

      it('returns short when homozygous recessive', () => {
        expect(getTailLengthPhenotype(['t', 't'])).toBe('short');
      });
    });

    describe('getEarShapePhenotype', () => {
      it('returns pointed when dominant allele present', () => {
        expect(getEarShapePhenotype(['E', 'E'])).toBe('pointed');
        expect(getEarShapePhenotype(['E', 'f'])).toBe('pointed');
      });

      it('returns folded when homozygous recessive', () => {
        expect(getEarShapePhenotype(['f', 'f'])).toBe('folded');
      });
    });

    describe('getTailColorPhenotype', () => {
      it('returns orange when dominant allele present', () => {
        expect(getTailColorPhenotype(['O', 'O'])).toBe('orange');
        expect(getTailColorPhenotype(['O', 'w'])).toBe('orange');
      });

      it('returns white when homozygous recessive', () => {
        expect(getTailColorPhenotype(['w', 'w'])).toBe('white');
      });
    });

    describe('getPhenotype', () => {
      it('calculates full phenotype from genotype', () => {
        const genotype: CatGenotype = {
          size: ['S', 's'],
          tailLength: ['t', 't'],
          earShape: ['f', 'f'],
          tailColor: ['O', 'w'],
        };

        expect(getPhenotype(genotype)).toEqual({
          size: 'large',
          tailLength: 'short',
          earShape: 'folded',
          tailColor: 'orange',
        });
      });
    });
  });

  describe('breeding', () => {
    const parent1: Cat = {
      id: 'cat1',
      name: 'Mom',
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
      },
      age: 365,
      happiness: 100,
    };

    const parent2: Cat = {
      id: 'cat2',
      name: 'Dad',
      genotype: {
        size: ['s', 's'],
        tailLength: ['t', 't'],
        earShape: ['f', 'f'],
        tailColor: ['w', 'w'],
      },
      phenotype: {
        size: 'small',
        tailLength: 'short',
        earShape: 'folded',
        tailColor: 'white',
      },
      age: 400,
      happiness: 90,
    };

    it('creates offspring with inherited traits', () => {
      const offspring = breedCats(parent1, parent2, 'Kitten');

      expect(offspring.name).toBe('Kitten');
      expect(offspring.age).toBe(0);
      expect(offspring.happiness).toBe(100);
      expect(offspring.id).toMatch(/^cat_/);
    });

    it('offspring inherits one allele from each parent', () => {
      // When breeding SS x ss, offspring must be Ss
      const offspring = breedCats(parent1, parent2, 'Kitten');
      
      // Each allele pair should have one from each parent
      expect(offspring.genotype.size).toContain('S');
      expect(offspring.genotype.size).toContain('s');
      expect(offspring.genotype.tailLength).toContain('T');
      expect(offspring.genotype.tailLength).toContain('t');
    });

    it('offspring phenotype matches genotype', () => {
      const offspring = breedCats(parent1, parent2, 'Kitten');
      
      // Heterozygous offspring should show dominant traits
      expect(offspring.phenotype.size).toBe('large');
      expect(offspring.phenotype.tailLength).toBe('long');
      expect(offspring.phenotype.earShape).toBe('pointed');
      expect(offspring.phenotype.tailColor).toBe('orange');
    });
  });

  describe('createRandomCat', () => {
    it('creates a cat with the given name', () => {
      const cat = createRandomCat('TestCat');
      expect(cat.name).toBe('TestCat');
    });

    it('creates a cat with valid genotype', () => {
      const cat = createRandomCat('TestCat');
      expect(cat.genotype.size).toHaveLength(2);
      expect(cat.genotype.tailLength).toHaveLength(2);
      expect(cat.genotype.earShape).toHaveLength(2);
      expect(cat.genotype.tailColor).toHaveLength(2);
    });

    it('creates a cat with matching phenotype', () => {
      const cat = createRandomCat('TestCat');
      expect(getPhenotype(cat.genotype)).toEqual(cat.phenotype);
    });
  });

  describe('getRandomCatName', () => {
    it('returns a string', () => {
      expect(typeof getRandomCatName()).toBe('string');
    });

    it('returns non-empty name', () => {
      expect(getRandomCatName().length).toBeGreaterThan(0);
    });
  });
});
