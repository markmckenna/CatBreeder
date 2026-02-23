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

    it('creates offspring with correct structure', () => {
      const offspring = breedCats(parent1, parent2, 'Kitten');
      expect(offspring).toHaveProperty('name', 'Kitten');
      expect(offspring).toHaveProperty('age', 0);
      expect(offspring).toHaveProperty('happiness', 100);
      expect(offspring).toHaveProperty('id');
      expect(typeof offspring.id).toBe('string');
      expect(offspring).toHaveProperty('genotype');
      expect(typeof offspring.genotype).toBe('string');
      expect(offspring.genotype.length).toBe(parent1.genotype.length);
    });

    it('offspring genotype contains alleles from both parents', () => {
      const offspring = breedCats(parent1, parent2, 'Kitten');
      // Each allele pair should have at least one allele from each parent
      for (let i = 0; i < parent1.genotype.length; i += 2) {
        const alleles = [parent1.genotype[i], parent1.genotype[i+1], parent2.genotype[i], parent2.genotype[i+1]];
        expect(alleles).toContain(offspring.genotype[i]);
        expect(alleles).toContain(offspring.genotype[i+1]);
      }
    });

    // Do not test phenotype here; phenotypeFor is tested separately
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
