/** Test utilities for mock game objects */

import type { Cat, CatPhenotype, CatGenotype } from '../app/cats/genetics.ts';

/** Default phenotype for mock cats */
const DEFAULT_PHENOTYPE: CatPhenotype = {
  size: 'large',
  tailLength: 'long',
  earShape: 'pointed',
  tailColor: 'orange',
};

/** Default genotype for mock cats */
const DEFAULT_GENOTYPE: CatGenotype = {
  size: ['S', 'S'],
  tailLength: ['T', 'T'],
  earShape: ['E', 'E'],
  tailColor: ['O', 'O'],
};

/** @returns a mock cat with optional overrides */
export function createMockCat(overrides: Partial<Cat> = {}): Cat {
  return {
    id: 'test-cat-1',
    name: 'Whiskers',
    age: 10,
    happiness: 80,
    genotype: DEFAULT_GENOTYPE,
    phenotype: DEFAULT_PHENOTYPE,
    ...overrides,
  };
}

/** @returns a mock cat with matching genotype for the given phenotype */
export function createMockCatFromPhenotype(
  phenotype: CatPhenotype,
  name = 'TestCat',
  id = 'test-cat-1'
): Cat {
  return {
    id,
    name,
    age: 10,
    happiness: 100,
    genotype: {
      size: phenotype.size === 'small' ? ['s', 's'] : ['S', 'S'],
      tailLength: phenotype.tailLength === 'short' ? ['t', 't'] : ['T', 'T'],
      earShape: phenotype.earShape === 'folded' ? ['f', 'f'] : ['E', 'E'],
      tailColor: phenotype.tailColor === 'white' ? ['w', 'w'] : ['O', 'O'],
    },
    phenotype,
  };
}

/** Small cat with all recessive traits */
export const SMALL_FOLDED_CAT: Cat = {
  id: 'test-cat-2',
  name: 'Mittens',
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
  age: 1,
  happiness: 90,
};
