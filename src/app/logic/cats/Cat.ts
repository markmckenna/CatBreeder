// Re-export RandomFn type for consumers
export type { RandomFn } from '@/core/random.ts';
/**
 * Genetics and breeding using simple Mendelian inheritance.
 * Each trait has two alleles (one from each parent).
 * Future: mutation rates, polygenic traits.
 */

import { type RandomFn, defaultRandom, randomInt, pickRandom } from '@/core/random.ts';


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

// ...existing code...

/** Derive phenotype from genotype string */
export function phenotypeFor(genotype: GenotypeString): CatPhenotype {
  const phenotype: CatPhenotype = {};
  let traitIndex = 0;
  for (const trait of TRAITS) {
    const allele1 = genotype[traitIndex];
    const allele2 = genotype[traitIndex + 1];
    if (allele1 === trait.dominant || allele2 === trait.dominant) {
      phenotype[trait.name] = trait.phenotypes[0];
    } else {
      phenotype[trait.name] = trait.phenotypes[1];
    }
    traitIndex += 2;
  }
  return phenotype;
}


/** @returns offspring cat from breeding two parents */
export function breedCats(parent1: Cat, parent2: Cat, name: string, options: BreedingOptions = {}): Cat {
  const random = options.random ?? defaultRandom;
  let offspringGenotype = '';
  for (let traitIdx = 0; traitIdx < TRAITS.length; ++traitIdx) {
    const traitIndex = traitIdx * 2;
    const parentAlleles = [
      parent1.genotype[traitIndex],
      parent1.genotype[traitIndex + 1],
      parent2.genotype[traitIndex],
      parent2.genotype[traitIndex + 1],
    ];
    const allele1 = pickRandom([parentAlleles[0], parentAlleles[1]], random);
    const allele2 = pickRandom([parentAlleles[2], parentAlleles[3]], random);
    offspringGenotype += allele1 + allele2;
  }
  return {
    id: options.id ?? generateCatId(random),
    name,
    genotype: offspringGenotype,
    age: 0,
    happiness: 100,
    favourite: false,
  };
}


/** @returns a random genotype string for initial cats */
export function createRandomGenotype(random: RandomFn = defaultRandom): GenotypeString {
  let genotypeString = '';
  for (const trait of TRAITS) {
    genotypeString += pickRandom(trait.alleles, random);
    genotypeString += pickRandom(trait.alleles, random);
  }
  return genotypeString;
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

// ...existing code...
export const randomCatName = (random: RandomFn = defaultRandom) =>
  pickRandom(catNames, random);
