/**
 * Public API for cat genetics and breeding.
 * 
 * This module exports the core cat types and breeding functions.
 * Internal breeding mechanics are kept private.
 */

export type { Cat, CatPhenotype } from './Cat.ts';
export type { RandomFn } from './Cat.ts';
export { TRAITS, phenotypeFor } from './Cat.ts';

export type { TraitCollection, CollectedTrait, TraitKey } from './collection.ts';
export {
  getCollectionProgress,
  createTraitCollection,
  registerBredCat,
  getAllPhenotypeCombinations,
  phenotypeKeyFor,
  getCollectedTraitInfo,
  isTraitCollected,
} from './collection.ts';
