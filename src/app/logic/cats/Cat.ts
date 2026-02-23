// Re-export RandomFn type for consumers
export type { RandomFn } from '@/base/random.ts';
/**
 * Genetics and breeding using simple Mendelian inheritance.
 * Each trait has two alleles (one from each parent).
 * Future: mutation rates, polygenic traits.
 */

import { type RandomFn, defaultRandom, randomInt, pickRandom } from '@/base/random.ts';


// --- Simplified Genetics Model ---

// Each trait is a pair of alleles, each allele has a phenotype string
export interface TraitDef {
  name: string;
  alleles: [string, string]; // e.g. ['S', 's']
  phenotypes: [string, string]; // e.g. ['large', 'small']
  dominant: string; // e.g. 'S'
}

// Order: size, tailLength, earShape, tailColor
export const TRAITS: TraitDef[] = [
  { name: 'size', alleles: ['S', 's'], phenotypes: ['large', 'small'], dominant: 'S' },
  { name: 'tailLength', alleles: ['T', 't'], phenotypes: ['long', 'short'], dominant: 'T' },
  { name: 'earShape', alleles: ['E', 'f'], phenotypes: ['pointed', 'folded'], dominant: 'E' },
  { name: 'color', alleles: ['O', 'w'], phenotypes: ['orange', 'white'], dominant: 'O' },
];

export type GenotypeString = string; // e.g. 'SSTtffOw'

export type CatPhenotype = Record<string, string>; // e.g. { size: 'large', ... }


export interface Cat {
  id: string;
  name: string;
  genotype: GenotypeString;
  age: number; // in days
  happiness: number; // 0-100
  favourite?: boolean; // starred cats cannot be sold
}

/** Options for breeding operations */
export interface BreedingOptions {
  /** Random source for deterministic breeding */
  random?: RandomFn;
  /** Override the generated cat ID */
  id?: string;
}

/** @returns a unique cat ID */
export function generateCatId(random: RandomFn = defaultRandom): string {
  // Use random for the suffix, but still use timestamp for uniqueness
  const suffix = Math.floor(random() * 2176782336).toString(36); // 36^6 possibilities
  return `cat_${Date.now()}_${suffix.padStart(6, '0')}`;
}

/** Randomly select one allele from a genotype pair */


/** Breed two genotypes to produce offspring genotype */



/** Derive phenotype from genotype string */
export function phenotypeFor(genotype: GenotypeString): CatPhenotype {
  const result: CatPhenotype = {};
  let i = 0;
  for (const trait of TRAITS) {
    const a1 = genotype[i];
    const a2 = genotype[i + 1];
    // If either allele is dominant, use dominant phenotype, else recessive
    if (a1 === trait.dominant || a2 === trait.dominant) {
      result[trait.name] = trait.phenotypes[0];
    } else {
      result[trait.name] = trait.phenotypes[1];
    }
    i += 2;
  }
  return result;
}


/** @returns offspring cat from breeding two parents */
export function breedCats(parent1: Cat, parent2: Cat, name: string, options: BreedingOptions = {}): Cat {
  const random = options.random ?? defaultRandom;
  let newGenotype = '';
  for (let t = 0; t < TRAITS.length; ++t) {
    const i = t * 2;
    // Each parent contributes one allele per trait
    const alleles = [parent1.genotype[i], parent1.genotype[i+1], parent2.genotype[i], parent2.genotype[i+1]];
    // Randomly pick one from each parent
    const a1 = pickRandom([alleles[0], alleles[1]], random);
    const a2 = pickRandom([alleles[2], alleles[3]], random);
    newGenotype += a1 + a2;
  }
  return {
    id: options.id ?? generateCatId(random),
    name,
    genotype: newGenotype,
    age: 0,
    happiness: 100,
    favourite: false,
  };
}


/** @returns a random genotype string for initial cats */
export function createRandomGenotype(random: RandomFn = defaultRandom): GenotypeString {
  let g = '';
  for (const trait of TRAITS) {
    g += pickRandom(trait.alleles, random);
    g += pickRandom(trait.alleles, random);
  }
  return g;
}

/** Options for creating random cats */
export interface CreateCatOptions {
  /** Random source for deterministic generation */
  random?: RandomFn;
  /** Override the generated cat ID */
  id?: string;
  /** Override age (otherwise random 30-394 days) */
  age?: number;
  /** Override happiness (otherwise random 70-100) */
  happiness?: number;
}


/** @returns a cat with random genetics */
export function createRandomCat(name: string, options: CreateCatOptions = {}): Cat {
  const random = options.random ?? defaultRandom;
  const genotype = createRandomGenotype(random);
  return {
    id: options.id ?? generateCatId(random),
    name,
    genotype,
    age: options.age ?? randomInt(30, 394, random), // 1 month to ~1 year

    happiness: options.happiness ?? randomInt(70, 100, random),
    favourite: false,
  };
}

// Cat names are now externalized to a JSON file for easier editing and localization
import catNames from './catNames.json'; // Ensure this file exists and is valid

/** Get a random cat name from the externalized list */


export const randomCatName = (random: RandomFn = defaultRandom) =>
  pickRandom(catNames, random);
