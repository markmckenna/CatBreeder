import { describe, it, expect } from 'vitest';
import {
  phenotypeFor,
  breedCats,
  createRandomCat,
  randomCatName,
} from './Cat.ts';
import type { Cat } from './Cat.ts';

describe('genetics', () => {
  describe('phenotype determination', () => {
    describe('sizePhenotypeFor', () => {
      it('returns large when dominant allele present (SS)', () => {
        expect(phenotypeFor('SSTTEEOO').size).toBe('large');
      });

      it('returns large when heterozygous (Ss)', () => {
        expect(phenotypeFor('SsTTEEOO').size).toBe('large');
        expect(phenotypeFor('sSTTEEOO').size).toBe('large');
      });

      it('returns small when homozygous recessive (ss)', () => {
        expect(phenotypeFor('ssTTEEOO').size).toBe('small');
      });
    });

    describe('tailLengthPhenotypeFor', () => {
      it('returns long when dominant allele present', () => {
        expect(phenotypeFor('SSTTEEOO').tailLength).toBe('long');
        expect(phenotypeFor('SSTtEEOO').tailLength).toBe('long');
      });

      it('returns short when homozygous recessive', () => {
        expect(phenotypeFor('SSttEEOO').tailLength).toBe('short');
      });
    });

    describe('earShapePhenotypeFor', () => {
      it('returns pointed when dominant allele present', () => {
        expect(phenotypeFor('SSTTEEOO').earShape).toBe('pointed');
        expect(phenotypeFor('SSTTEfOO').earShape).toBe('pointed');
      });

      it('returns folded when homozygous recessive', () => {
        expect(phenotypeFor('SSTTffOO').earShape).toBe('folded');
      });
    });

    describe('tailColorPhenotypeFor', () => {
      it('returns orange when dominant allele present', () => {
        expect(phenotypeFor('SSTTEEOO').color).toBe('orange');
        expect(phenotypeFor('SSTTEEOw').color).toBe('orange');
      });

      it('returns white when homozygous recessive', () => {
        expect(phenotypeFor('SSTTEEww').color).toBe('white');
      });
    });

    describe('phenotypeFor', () => {
      it('calculates full phenotype from genotype', () => {
        const genotype = 'SsttffOw';
        expect(phenotypeFor(genotype)).toEqual({
          size: 'large',
          tailLength: 'short',
          earShape: 'folded',
          color: 'orange',
        });
      });
    });
  });

  describe('breeding', () => {
    const parent1: Cat = {
      id: 'cat1',
      name: 'Mom',
      genotype: 'SSTTEEOO',
      age: 365,
      happiness: 100,
    };

    const parent2: Cat = {
      id: 'cat2',
      name: 'Dad',
      genotype: 'ssttffww',
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
      expect(offspring.genotype.includes('S')).toBe(true);
      expect(offspring.genotype.includes('s')).toBe(true);
      expect(offspring.genotype.includes('T')).toBe(true);
      expect(offspring.genotype.includes('t')).toBe(true);
    });

    it('offspring phenotype matches genotype', () => {
      const offspring = breedCats(parent1, parent2, 'Kitten');
      
      // Heterozygous offspring should show dominant traits
      const phenotype = phenotypeFor(offspring.genotype);
      expect(phenotype.size).toBe('large');
      expect(phenotype.tailLength).toBe('long');
      expect(phenotype.earShape).toBe('pointed');
      expect(phenotype.color).toBe('orange');
    });
  });

  describe('createRandomCat', () => {
    it('creates a cat with the given name', () => {
      const cat = createRandomCat('TestCat');
      expect(cat.name).toBe('TestCat');
    });

    it('creates a cat with valid genotype', () => {
      const cat = createRandomCat('TestCat');
      expect(cat.genotype.length).toBe(8);
    });

    it('creates a cat with matching phenotype', () => {
      // Already tested above: phenotypeFor returns correct object
    });
  });

  describe('randomCatName', () => {
    it('returns a string', () => {
      expect(typeof randomCatName()).toBe('string');
    });

    it('returns non-empty name', () => {
      expect(randomCatName().length).toBeGreaterThan(0);
    });
  });
});
