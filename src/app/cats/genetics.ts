/**
 * Genetics and breeding logic.
 * 
 * Currently implements simple Mendelian inheritance.
 * Future: Add mutation rates, polygenic traits, evolutionary algorithms.
 * 
 * Traits use a simple allele system for Mendelian inheritance.
 * Each trait has two alleles (one from each parent).
 * 
 * All random operations can use an injectable random function for
 * deterministic testing and savegame stability.
 */

import { type RandomFn, defaultRandom, coinFlip, randomInt, pickRandom } from '@/base/random.ts';

// Size: Small (s) is recessive, Large (L) is dominant
export type SizeAllele = 'S' | 's';
export type SizeGenotype = [SizeAllele, SizeAllele];
export type SizePhenotype = 'small' | 'large';

// Tail Length: Short (t) is recessive, Long (T) is dominant  
export type TailLengthAllele = 'T' | 't';
export type TailLengthGenotype = [TailLengthAllele, TailLengthAllele];
export type TailLengthPhenotype = 'short' | 'long';

// Ear Shape: Folded (f) is recessive, Pointed (E) is dominant
export type EarShapeAllele = 'E' | 'f';
export type EarShapeGenotype = [EarShapeAllele, EarShapeAllele];
export type EarShapePhenotype = 'folded' | 'pointed';

// Tail Color: White (w) is recessive, Orange (O) is dominant
export type TailColorAllele = 'O' | 'w';
export type TailColorGenotype = [TailColorAllele, TailColorAllele];
export type TailColorPhenotype = 'white' | 'orange';

/**
 * Complete genotype for a cat - all genetic information
 */
export interface CatGenotype {
  size: SizeGenotype;
  tailLength: TailLengthGenotype;
  earShape: EarShapeGenotype;
  tailColor: TailColorGenotype;
}

/**
 * Observable traits (what you see)
 */
export interface CatPhenotype {
  size: SizePhenotype;
  tailLength: TailLengthPhenotype;
  earShape: EarShapePhenotype;
  tailColor: TailColorPhenotype;
}

/**
 * A cat in the game
 */
export interface Cat {
  id: string;
  name: string;
  genotype: CatGenotype;
  phenotype: CatPhenotype;
  age: number; // in days
  happiness: number; // 0-100
  favourite?: boolean; // starred cats cannot be sold
}

/**
 * Options for breeding operations
 */
export interface BreedingOptions {
  /** Random function for deterministic breeding (defaults to Math.random) */
  random?: RandomFn;
  /** Override the generated cat ID (for testing) */
  id?: string;
}

/**
 * Generate a unique cat ID
 * @param random - Optional random function for deterministic ID generation
 */
export function generateCatId(random: RandomFn = defaultRandom): string {
  // Use random for the suffix, but still use timestamp for uniqueness
  const suffix = Math.floor(random() * 2176782336).toString(36); // 36^6 possibilities
  return `cat_${Date.now()}_${suffix.padStart(6, '0')}`;
}

/**
 * Randomly select one allele from a genotype pair
 */
function pickAllele<T>(genotype: [T, T], random: RandomFn = defaultRandom): T {
  return coinFlip(genotype[0], genotype[1], random);
}

/**
 * Breed two genotypes to produce offspring genotype
 */
function breedGenotype<T>(parent1: [T, T], parent2: [T, T], random: RandomFn = defaultRandom): [T, T] {
  return [pickAllele(parent1, random), pickAllele(parent2, random)];
}

/** Determine size phenotype from genotype. Large (S) is dominant over Small (s) */
export const sizePhenotypeFor = (it: SizeGenotype): SizePhenotype =>
  it.includes('S') ? 'large' : 'small';

/** Determine tail length phenotype from genotype. Long (T) is dominant over Short (t) */
export const tailLengthPhenotypeFor = (it: TailLengthGenotype): TailLengthPhenotype =>
  it.includes('T') ? 'long' : 'short';

/** Determine ear shape phenotype from genotype. Pointed (E) is dominant over Folded (f) */
export const earShapePhenotypeFor = (it: EarShapeGenotype): EarShapePhenotype =>
  it.includes('E') ? 'pointed' : 'folded';

/** Determine tail color phenotype from genotype. Orange (O) is dominant over White (w) */
export const tailColorPhenotypeFor = (it: TailColorGenotype): TailColorPhenotype =>
  it.includes('O') ? 'orange' : 'white';

/** Calculate full phenotype from genotype */
export const phenotypeFor = (it: CatGenotype): CatPhenotype => ({
  size: sizePhenotypeFor(it.size),
  tailLength: tailLengthPhenotypeFor(it.tailLength),
  earShape: earShapePhenotypeFor(it.earShape),
  tailColor: tailColorPhenotypeFor(it.tailColor),
});

/**
 * Breed two cats to produce offspring
 * 
 * @param parent1 - First parent cat
 * @param parent2 - Second parent cat
 * @param name - Name for the offspring
 * @param options - Optional breeding options for deterministic testing
 */
export function breedCats(parent1: Cat, parent2: Cat, name: string, options: BreedingOptions = {}): Cat {
  const random = options.random ?? defaultRandom;
  
  const genotype: CatGenotype = {
    size: breedGenotype(parent1.genotype.size, parent2.genotype.size, random) as SizeGenotype,
    tailLength: breedGenotype(parent1.genotype.tailLength, parent2.genotype.tailLength, random) as TailLengthGenotype,
    earShape: breedGenotype(parent1.genotype.earShape, parent2.genotype.earShape, random) as EarShapeGenotype,
    tailColor: breedGenotype(parent1.genotype.tailColor, parent2.genotype.tailColor, random) as TailColorGenotype,
  };

  return {
    id: options.id ?? generateCatId(random),
    name,
    genotype,
    phenotype: phenotypeFor(genotype),
    age: 0,
    happiness: 100,
    favourite: false,
  };
}

/**
 * Create a random genotype for initial cats
 * 
 * @param random - Optional random function for deterministic generation
 */
export function createRandomGenotype(random: RandomFn = defaultRandom): CatGenotype {
  const randomAllele = <T>(dominant: T, recessive: T): [T, T] => {
    return [coinFlip(dominant, recessive, random), coinFlip(dominant, recessive, random)];
  };

  return {
    size: randomAllele<SizeAllele>('S', 's'),
    tailLength: randomAllele<TailLengthAllele>('T', 't'),
    earShape: randomAllele<EarShapeAllele>('E', 'f'),
    tailColor: randomAllele<TailColorAllele>('O', 'w'),
  };
}

/**
 * Options for creating random cats
 */
export interface CreateCatOptions {
  /** Random function for deterministic generation */
  random?: RandomFn;
  /** Override the generated cat ID */
  id?: string;
  /** Override the age (otherwise random 30-394 days) */
  age?: number;
  /** Override happiness (otherwise random 70-100) */
  happiness?: number;
}

/**
 * Create a cat with random genetics
 * 
 * @param name - Cat's name
 * @param options - Optional settings for deterministic generation
 */
export function createRandomCat(name: string, options: CreateCatOptions = {}): Cat {
  const random = options.random ?? defaultRandom;
  const genotype = createRandomGenotype(random);
  
  return {
    id: options.id ?? generateCatId(random),
    name,
    genotype,
    phenotype: phenotypeFor(genotype),
    age: options.age ?? randomInt(30, 394, random), // 1 month to ~1 year
    happiness: options.happiness ?? randomInt(70, 100, random),
    favourite: false,
  };
}

/**
 * Cat name generator for offspring
 */
const CAT_NAMES = [
  'Whiskers', 'Mittens', 'Shadow', 'Luna', 'Mochi',
  'Ginger', 'Oreo', 'Cleo', 'Felix', 'Simba',
  'Nala', 'Oliver', 'Bella', 'Max', 'Chloe',
  'Tiger', 'Smokey', 'Patches', 'Pumpkin', 'Snowball',
];

/** Get a random cat name from the predefined list */
export const randomCatName = (random: RandomFn = defaultRandom): string =>
  pickRandom(CAT_NAMES, random);

// Re-export RandomFn type for consumers
export type { RandomFn };
