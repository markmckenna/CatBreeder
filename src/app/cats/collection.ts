/**
 * Trait Collection System
 * 
 * Tracks which phenotype combinations have been successfully bred.
 * There are 2^4 = 16 possible combinations of the 4 binary traits.
 */

import type { CatPhenotype, Cat } from './genetics.ts';

/**
 * Unique key for a phenotype combination.
 * Format: "size-tailLength-earShape-tailColor"
 */
export type TraitKey = string;

/**
 * A collected trait entry - records which cat first achieved this combination
 */
export interface CollectedTrait {
  key: TraitKey;
  phenotype: CatPhenotype;
  catId: string;
  catName: string;
  day: number;
}

/**
 * Collection state tracking discovered traits
 */
export interface TraitCollection {
  collected: Map<TraitKey, CollectedTrait>;
}

/** Generate a unique key for a phenotype combination */
export const phenotypeKeyFor = (phenotype: CatPhenotype): TraitKey =>
  `${phenotype.size}-${phenotype.tailLength}-${phenotype.earShape}-${phenotype.tailColor}`;

/**
 * Get all possible phenotype combinations
 */
export function getAllPhenotypeCombinations(): CatPhenotype[] {
  const sizes: Array<'small' | 'large'> = ['small', 'large'];
  const tailLengths: Array<'short' | 'long'> = ['short', 'long'];
  const earShapes: Array<'folded' | 'pointed'> = ['folded', 'pointed'];
  const tailColors: Array<'white' | 'orange'> = ['white', 'orange'];

  const combinations: CatPhenotype[] = [];
  
  for (const size of sizes) {
    for (const tailLength of tailLengths) {
      for (const earShape of earShapes) {
        for (const tailColor of tailColors) {
          combinations.push({ size, tailLength, earShape, tailColor });
        }
      }
    }
  }

  return combinations;
}

/** Create an empty trait collection */
export const createTraitCollection = (): TraitCollection => ({ collected: new Map() });

/** Check if a trait combination has been collected */
export const isTraitCollected = (collection: TraitCollection, phenotype: CatPhenotype): boolean =>
  collection.collected.has(phenotypeKeyFor(phenotype));

/** Get the cat that first collected a trait, if any */
export const getCollectedTraitInfo = (
  collection: TraitCollection, 
  phenotype: CatPhenotype
): CollectedTrait | undefined => collection.collected.get(phenotypeKeyFor(phenotype));

/**
 * Register a newly bred cat's traits in the collection.
 * Only records if this is the first cat with this combination.
 * 
 * @returns true if this was a new discovery, false if already collected
 */
export function registerBredCat(
  collection: TraitCollection,
  cat: Cat,
  day: number
): { updated: boolean; collection: TraitCollection } {
  const key = phenotypeKeyFor(cat.phenotype);
  
  if (collection.collected.has(key)) return { updated: false, collection };

  const newCollected = new Map(collection.collected);
  newCollected.set(key, {
    key,
    phenotype: cat.phenotype,
    catId: cat.id,
    catName: cat.name,
    day,
  });

  return {
    updated: true,
    collection: { collected: newCollected },
  };
}

/**
 * Get collection progress as a fraction
 */
export function getCollectionProgress(collection: TraitCollection): {
  collected: number;
  total: number;
  percentage: number;
} {
  const total = 16; // 2^4 combinations
  const collected = collection.collected.size;
  return {
    collected,
    total,
    percentage: Math.round((collected / total) * 100),
  };
}

/**
 * Serialize collection for storage
 */
export function serializeCollection(collection: TraitCollection): object {
  return {
    collected: Array.from(collection.collected.entries()),
  };
}

/**
 * Deserialize collection from storage
 */
export function deserializeCollection(data: { collected: Array<[TraitKey, CollectedTrait]> }): TraitCollection {
  return {
    collected: new Map(data.collected),
  };
}
