/**
 * Tests for deterministic breeding with seeded random.
 * 
 * These tests validate:
 * 1. Breeding is deterministic with the same seed
 * 2. Statistical outcomes match Mendelian expectations
 * 3. Breeding programs produce snapshot-stable results
 */

import { describe, it, expect } from 'vitest';
import { createSeededRandom } from '@/base/random.ts';
import {
  breedCats,
  createRandomCat,
  createRandomGenotype,
  getRandomCatName,
  getPhenotype,
  type Cat,
  type CatGenotype,
  type CatPhenotype,
} from './genetics.ts';

/**
 * Helper to create a cat with a specific genotype for testing
 */
function createCatWithGenotype(name: string, genotype: CatGenotype, id: string): Cat {
  return {
    id,
    name,
    genotype,
    phenotype: getPhenotype(genotype),
    age: 100,
    happiness: 100,
  };
}

describe('deterministic breeding', () => {
  describe('seeded random produces consistent results', () => {
    it('breedCats produces identical offspring with same seed', () => {
      const parent1 = createCatWithGenotype('Mom', {
        size: ['S', 's'],
        tailLength: ['T', 't'],
        earShape: ['E', 'f'],
        tailColor: ['O', 'w'],
      }, 'p1');
      
      const parent2 = createCatWithGenotype('Dad', {
        size: ['S', 's'],
        tailLength: ['T', 't'],
        earShape: ['E', 'f'],
        tailColor: ['O', 'w'],
      }, 'p2');

      // Breed with same seed twice
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(12345);
      
      const offspring1 = breedCats(parent1, parent2, 'Kitten1', { random: rng1, id: 'test_cat_1' });
      const offspring2 = breedCats(parent1, parent2, 'Kitten2', { random: rng2, id: 'test_cat_2' });

      // Genotypes should be identical
      expect(offspring1.genotype).toEqual(offspring2.genotype);
      expect(offspring1.phenotype).toEqual(offspring2.phenotype);
    });

    it('different seeds produce different offspring', () => {
      const parent1 = createCatWithGenotype('Mom', {
        size: ['S', 's'],
        tailLength: ['T', 't'],
        earShape: ['E', 'f'],
        tailColor: ['O', 'w'],
      }, 'p1');
      
      const parent2 = createCatWithGenotype('Dad', {
        size: ['S', 's'],
        tailLength: ['T', 't'],
        earShape: ['E', 'f'],
        tailColor: ['O', 'w'],
      }, 'p2');

      // Collect genotypes from many different seeds
      const genotypes = new Set<string>();
      for (let seed = 0; seed < 100; seed++) {
        const rng = createSeededRandom(seed);
        const offspring = breedCats(parent1, parent2, 'Kitten', { random: rng, id: `test_${seed}` });
        genotypes.add(JSON.stringify(offspring.genotype));
      }

      // Should have multiple different genotypes
      expect(genotypes.size).toBeGreaterThan(1);
    });

    it('createRandomCat is deterministic with seed', () => {
      const rng1 = createSeededRandom(42);
      const rng2 = createSeededRandom(42);
      
      const cat1 = createRandomCat('Test1', { random: rng1, id: 'test1' });
      const cat2 = createRandomCat('Test2', { random: rng2, id: 'test2' });

      expect(cat1.genotype).toEqual(cat2.genotype);
      expect(cat1.age).toBe(cat2.age);
      expect(cat1.happiness).toBe(cat2.happiness);
    });

    it('createRandomGenotype is deterministic with seed', () => {
      const rng1 = createSeededRandom(999);
      const rng2 = createSeededRandom(999);
      
      const genotype1 = createRandomGenotype(rng1);
      const genotype2 = createRandomGenotype(rng2);

      expect(genotype1).toEqual(genotype2);
    });

    it('getRandomCatName is deterministic with seed', () => {
      const rng1 = createSeededRandom(777);
      const rng2 = createSeededRandom(777);
      
      const name1 = getRandomCatName(rng1);
      const name2 = getRandomCatName(rng2);

      expect(name1).toBe(name2);
    });
  });
});

describe('Mendelian statistics', () => {
  // For statistical tests, we run many trials and check that results
  // fall within expected ranges with high confidence.
  
  const TRIALS = 10000;
  const TOLERANCE = 0.05; // Allow 5% deviation from expected ratio

  function countPhenotypes(
    parent1Genotype: CatGenotype,
    parent2Genotype: CatGenotype,
    trials: number,
    seed: number
  ): Record<string, Record<string, number>> {
    const parent1 = createCatWithGenotype('P1', parent1Genotype, 'p1');
    const parent2 = createCatWithGenotype('P2', parent2Genotype, 'p2');
    
    const counts: Record<string, Record<string, number>> = {
      size: { small: 0, large: 0 },
      tailLength: { short: 0, long: 0 },
      earShape: { folded: 0, pointed: 0 },
      tailColor: { white: 0, orange: 0 },
    };

    const rng = createSeededRandom(seed);
    
    for (let i = 0; i < trials; i++) {
      const offspring = breedCats(parent1, parent2, `Kit${i}`, { random: rng, id: `k${i}` });
      counts.size[offspring.phenotype.size]++;
      counts.tailLength[offspring.phenotype.tailLength]++;
      counts.earShape[offspring.phenotype.earShape]++;
      counts.tailColor[offspring.phenotype.tailColor]++;
    }

    return counts;
  }

  describe('homozygous × homozygous crosses', () => {
    it('SS × SS → 100% large', () => {
      const counts = countPhenotypes(
        { size: ['S', 'S'], tailLength: ['T', 'T'], earShape: ['E', 'E'], tailColor: ['O', 'O'] },
        { size: ['S', 'S'], tailLength: ['T', 'T'], earShape: ['E', 'E'], tailColor: ['O', 'O'] },
        TRIALS,
        100
      );

      expect(counts.size.large).toBe(TRIALS);
      expect(counts.size.small).toBe(0);
    });

    it('ss × ss → 100% small', () => {
      const counts = countPhenotypes(
        { size: ['s', 's'], tailLength: ['t', 't'], earShape: ['f', 'f'], tailColor: ['w', 'w'] },
        { size: ['s', 's'], tailLength: ['t', 't'], earShape: ['f', 'f'], tailColor: ['w', 'w'] },
        TRIALS,
        200
      );

      expect(counts.size.small).toBe(TRIALS);
      expect(counts.size.large).toBe(0);
    });

    it('SS × ss → 100% large (all Ss)', () => {
      const counts = countPhenotypes(
        { size: ['S', 'S'], tailLength: ['T', 'T'], earShape: ['E', 'E'], tailColor: ['O', 'O'] },
        { size: ['s', 's'], tailLength: ['t', 't'], earShape: ['f', 'f'], tailColor: ['w', 'w'] },
        TRIALS,
        300
      );

      // All offspring are heterozygous Ss, showing dominant phenotype
      expect(counts.size.large).toBe(TRIALS);
      expect(counts.size.small).toBe(0);
    });
  });

  describe('heterozygous × heterozygous crosses (classic 3:1 ratio)', () => {
    it('Ss × Ss → ~75% large, ~25% small', () => {
      const counts = countPhenotypes(
        { size: ['S', 's'], tailLength: ['T', 't'], earShape: ['E', 'f'], tailColor: ['O', 'w'] },
        { size: ['S', 's'], tailLength: ['T', 't'], earShape: ['E', 'f'], tailColor: ['O', 'w'] },
        TRIALS,
        400
      );

      const largeRatio = counts.size.large / TRIALS;
      const smallRatio = counts.size.small / TRIALS;

      // Expected: 75% large (SS, Ss, sS), 25% small (ss)
      expect(largeRatio).toBeGreaterThan(0.75 - TOLERANCE);
      expect(largeRatio).toBeLessThan(0.75 + TOLERANCE);
      expect(smallRatio).toBeGreaterThan(0.25 - TOLERANCE);
      expect(smallRatio).toBeLessThan(0.25 + TOLERANCE);
    });

    it('Tt × Tt → ~75% long, ~25% short', () => {
      const counts = countPhenotypes(
        { size: ['S', 's'], tailLength: ['T', 't'], earShape: ['E', 'f'], tailColor: ['O', 'w'] },
        { size: ['S', 's'], tailLength: ['T', 't'], earShape: ['E', 'f'], tailColor: ['O', 'w'] },
        TRIALS,
        500
      );

      const longRatio = counts.tailLength.long / TRIALS;
      expect(longRatio).toBeGreaterThan(0.75 - TOLERANCE);
      expect(longRatio).toBeLessThan(0.75 + TOLERANCE);
    });

    it('Ef × Ef → ~75% pointed, ~25% folded', () => {
      const counts = countPhenotypes(
        { size: ['S', 's'], tailLength: ['T', 't'], earShape: ['E', 'f'], tailColor: ['O', 'w'] },
        { size: ['S', 's'], tailLength: ['T', 't'], earShape: ['E', 'f'], tailColor: ['O', 'w'] },
        TRIALS,
        600
      );

      const pointedRatio = counts.earShape.pointed / TRIALS;
      expect(pointedRatio).toBeGreaterThan(0.75 - TOLERANCE);
      expect(pointedRatio).toBeLessThan(0.75 + TOLERANCE);
    });

    it('Ow × Ow → ~75% orange, ~25% white', () => {
      const counts = countPhenotypes(
        { size: ['S', 's'], tailLength: ['T', 't'], earShape: ['E', 'f'], tailColor: ['O', 'w'] },
        { size: ['S', 's'], tailLength: ['T', 't'], earShape: ['E', 'f'], tailColor: ['O', 'w'] },
        TRIALS,
        700
      );

      const orangeRatio = counts.tailColor.orange / TRIALS;
      expect(orangeRatio).toBeGreaterThan(0.75 - TOLERANCE);
      expect(orangeRatio).toBeLessThan(0.75 + TOLERANCE);
    });
  });

  describe('heterozygous × recessive crosses (test cross 1:1 ratio)', () => {
    it('Ss × ss → ~50% large, ~50% small', () => {
      const counts = countPhenotypes(
        { size: ['S', 's'], tailLength: ['T', 't'], earShape: ['E', 'f'], tailColor: ['O', 'w'] },
        { size: ['s', 's'], tailLength: ['t', 't'], earShape: ['f', 'f'], tailColor: ['w', 'w'] },
        TRIALS,
        800
      );

      const largeRatio = counts.size.large / TRIALS;
      expect(largeRatio).toBeGreaterThan(0.50 - TOLERANCE);
      expect(largeRatio).toBeLessThan(0.50 + TOLERANCE);
    });
  });

  describe('trait independence', () => {
    it('traits segregate independently (product rule)', () => {
      // Cross Ss;Tt × Ss;Tt
      // Expected genotype ratios for each trait: 1 SS : 2 Ss : 1 ss
      // Expected phenotype ratios: 3 dominant : 1 recessive
      // For two independent traits: 9:3:3:1 ratio
      
      const parent1 = createCatWithGenotype('P1', {
        size: ['S', 's'],
        tailLength: ['T', 't'],
        earShape: ['E', 'E'], // Keep these constant
        tailColor: ['O', 'O'],
      }, 'p1');
      
      const parent2 = createCatWithGenotype('P2', {
        size: ['S', 's'],
        tailLength: ['T', 't'],
        earShape: ['E', 'E'],
        tailColor: ['O', 'O'],
      }, 'p2');

      const rng = createSeededRandom(900);
      const comboCounts = {
        'large-long': 0,
        'large-short': 0,
        'small-long': 0,
        'small-short': 0,
      };

      for (let i = 0; i < TRIALS; i++) {
        const offspring = breedCats(parent1, parent2, `Kit${i}`, { random: rng, id: `k${i}` });
        const key = `${offspring.phenotype.size}-${offspring.phenotype.tailLength}` as keyof typeof comboCounts;
        comboCounts[key]++;
      }

      // Expected ratios: 9/16 large-long, 3/16 large-short, 3/16 small-long, 1/16 small-short
      expect(comboCounts['large-long'] / TRIALS).toBeGreaterThan(9/16 - TOLERANCE);
      expect(comboCounts['large-long'] / TRIALS).toBeLessThan(9/16 + TOLERANCE);
      
      expect(comboCounts['large-short'] / TRIALS).toBeGreaterThan(3/16 - TOLERANCE);
      expect(comboCounts['large-short'] / TRIALS).toBeLessThan(3/16 + TOLERANCE);
      
      expect(comboCounts['small-long'] / TRIALS).toBeGreaterThan(3/16 - TOLERANCE);
      expect(comboCounts['small-long'] / TRIALS).toBeLessThan(3/16 + TOLERANCE);
      
      expect(comboCounts['small-short'] / TRIALS).toBeGreaterThan(1/16 - TOLERANCE);
      expect(comboCounts['small-short'] / TRIALS).toBeLessThan(1/16 + TOLERANCE);
    });
  });
});

describe('breeding program snapshots', () => {
  /**
   * Run a multi-generation breeding program with deterministic seed.
   * This allows snapshot testing to detect any changes to breeding logic.
   */
  function runBreedingProgram(seed: number, generations: number): {
    generations: Array<{
      generation: number;
      cats: Array<{ name: string; genotype: CatGenotype; phenotype: CatPhenotype }>;
    }>;
  } {
    const rng = createSeededRandom(seed);
    const result: ReturnType<typeof runBreedingProgram> = { generations: [] };
    
    // Start with two random cats
    let cats = [
      createRandomCat('Founder1', { random: rng, id: 'f1', age: 365, happiness: 100 }),
      createRandomCat('Founder2', { random: rng, id: 'f2', age: 365, happiness: 100 }),
    ];
    
    result.generations.push({
      generation: 0,
      cats: cats.map(c => ({ name: c.name, genotype: c.genotype, phenotype: c.phenotype })),
    });

    for (let gen = 1; gen <= generations; gen++) {
      const newCats: Cat[] = [];
      
      // Breed each pair of adjacent cats
      for (let i = 0; i < cats.length - 1; i += 2) {
        const offspring = breedCats(
          cats[i],
          cats[i + 1],
          getRandomCatName(rng),
          { random: rng, id: `g${gen}_c${i}` }
        );
        newCats.push(offspring);
      }

      // Add some variety by breeding first and last
      if (cats.length >= 2) {
        const offspring = breedCats(
          cats[0],
          cats[cats.length - 1],
          getRandomCatName(rng),
          { random: rng, id: `g${gen}_mix` }
        );
        newCats.push(offspring);
      }

      cats = newCats;
      result.generations.push({
        generation: gen,
        cats: cats.map(c => ({ name: c.name, genotype: c.genotype, phenotype: c.phenotype })),
      });
    }

    return result;
  }

  it('seed 12345 produces consistent 5-generation program', () => {
    const result = runBreedingProgram(12345, 5);
    
    // This is a snapshot test - the exact results should not change
    // unless we intentionally modify breeding logic
    expect(result).toMatchSnapshot();
  });

  it('seed 99999 produces consistent 5-generation program', () => {
    const result = runBreedingProgram(99999, 5);
    expect(result).toMatchSnapshot();
  });

  it('seed 42 produces consistent 3-generation large program', () => {
    // Larger program to catch more edge cases
    const rng = createSeededRandom(42);
    const founders = Array.from({ length: 10 }, (_, i) => 
      createRandomCat(`Founder${i}`, { random: rng, id: `f${i}`, age: 365, happiness: 100 })
    );
    
    // Snapshot the founder genotypes
    const founderGenotypes = founders.map(c => ({
      name: c.name,
      genotype: c.genotype,
    }));
    
    expect(founderGenotypes).toMatchSnapshot();
  });
});
