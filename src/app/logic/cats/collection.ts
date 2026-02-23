/** Trait Collection - tracks which phenotype combinations have been bred (2^4 = 16 total) */

import type { CatPhenotype, Cat } from './Cat.ts';
import { phenotypeFor } from './Cat.ts';

/** Key for a phenotype combination: "size-tailLength-earShape-color" */
export type TraitKey = string;

/** A collected trait - records which cat first achieved this combination */
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
export const phenotypeKeyFor = (it: CatPhenotype): TraitKey =>
  `${it.size}-${it.tailLength}-${it.earShape}-${it.color}`;

/** @returns all 16 possible phenotype combinations */
export function getAllPhenotypeCombinations(): CatPhenotype[] {
  const sizes: Array<'small' | 'large'> = ['small', 'large'];
  const tailLengths: Array<'short' | 'long'> = ['short', 'long'];
  const earShapes: Array<'folded' | 'pointed'> = ['folded', 'pointed'];
  const colors: Array<'white' | 'orange'> = ['white', 'orange'];

  const combinations: CatPhenotype[] = [];
  for (const size of sizes) {
    for (const tailLength of tailLengths) {
      for (const earShape of earShapes) {
        for (const color of colors) {
          combinations.push({ size, tailLength, earShape, color });
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

/** @returns {updated: true} if this cat's phenotype is a new discovery */
export function registerBredCat(
  collection: TraitCollection,
  cat: Cat,
  day: number
): { updated: boolean; collection: TraitCollection } {
  const key = phenotypeKeyFor(phenotypeFor(cat.genotype));
  
  if (collection.collected.has(key)) return { updated: false, collection };

  const newCollected = new Map(collection.collected);
  newCollected.set(key, {
    key,
    phenotype: phenotypeFor(cat.genotype),
    catId: cat.id,
    catName: cat.name,
    day,
  });

  return {
    updated: true,
    collection: { collected: newCollected },
  };
}

/** @returns collection progress as {collected, total} */
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
