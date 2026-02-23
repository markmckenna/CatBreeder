/** Test utilities for mock game objects */

import type { Cat, CatPhenotype } from '../cats/Cat';


/** Default genotype for mock cats (string) */
const DEFAULT_GENOTYPE = 'SSTTEEOO'; // large, long, pointed, orange

/** @returns a mock cat with optional overrides */
export function createMockCat(overrides: Partial<Cat> = {}): Cat {
  return {
    id: 'test-cat-1',
    name: 'Whiskers',
    age: 10,
    happiness: 80,
    genotype: DEFAULT_GENOTYPE,
    ...overrides,
  };
}

/** @returns a mock cat with matching genotype for the given phenotype */
export function createMockCatFromPhenotype(
  phenotype: CatPhenotype,
  name = 'TestCat',
  id = 'test-cat-1'
): Cat {
  // Helper to convert phenotype to genotype string (assumes homozygous for trait)
  function phenotypeToGenotype(p: CatPhenotype): string {
    let g = '';
    g += p.size === 'small' ? 'ss' : 'SS';
    g += p.tailLength === 'short' ? 'tt' : 'TT';
    g += p.earShape === 'folded' ? 'ff' : 'EE';
    g += p.color === 'white' ? 'ww' : 'OO';
    return g;
  }
  return {
    id,
    name,
    age: 10,
    happiness: 100,
    genotype: phenotypeToGenotype(phenotype),
  };
}

/** Small cat with all recessive traits */
export const SMALL_FOLDED_CAT: Cat = {
  id: 'test-cat-2',
  name: 'Mittens',
  genotype: 'ssttffww',
  age: 1,
  happiness: 90,
};