/**
 * Genetics and breeding logic.
 * 
 * Currently implements simple Mendelian inheritance.
 * Future: Add mutation rates, polygenic traits, evolutionary algorithms.
 * 
 * Traits use a simple allele system for Mendelian inheritance.
 * Each trait has two alleles (one from each parent).
 */

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
}

/**
 * Generate a unique cat ID
 */
export function generateCatId(): string {
  return `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Randomly select one allele from a genotype pair
 */
function pickAllele<T>(genotype: [T, T]): T {
  return genotype[Math.random() < 0.5 ? 0 : 1];
}

/**
 * Breed two genotypes to produce offspring genotype
 */
function breedGenotype<T>(parent1: [T, T], parent2: [T, T]): [T, T] {
  return [pickAllele(parent1), pickAllele(parent2)];
}

/**
 * Determine size phenotype from genotype
 * Large (S) is dominant over Small (s)
 */
export function getSizePhenotype(genotype: SizeGenotype): SizePhenotype {
  return genotype.includes('S') ? 'large' : 'small';
}

/**
 * Determine tail length phenotype from genotype
 * Long (T) is dominant over Short (t)
 */
export function getTailLengthPhenotype(genotype: TailLengthGenotype): TailLengthPhenotype {
  return genotype.includes('T') ? 'long' : 'short';
}

/**
 * Determine ear shape phenotype from genotype
 * Pointed (E) is dominant over Folded (f)
 */
export function getEarShapePhenotype(genotype: EarShapeGenotype): EarShapePhenotype {
  return genotype.includes('E') ? 'pointed' : 'folded';
}

/**
 * Determine tail color phenotype from genotype
 * Orange (O) is dominant over White (w)
 */
export function getTailColorPhenotype(genotype: TailColorGenotype): TailColorPhenotype {
  return genotype.includes('O') ? 'orange' : 'white';
}

/**
 * Calculate full phenotype from genotype
 */
export function getPhenotype(genotype: CatGenotype): CatPhenotype {
  return {
    size: getSizePhenotype(genotype.size),
    tailLength: getTailLengthPhenotype(genotype.tailLength),
    earShape: getEarShapePhenotype(genotype.earShape),
    tailColor: getTailColorPhenotype(genotype.tailColor),
  };
}

/**
 * Breed two cats to produce offspring
 */
export function breedCats(parent1: Cat, parent2: Cat, name: string): Cat {
  const genotype: CatGenotype = {
    size: breedGenotype(parent1.genotype.size, parent2.genotype.size) as SizeGenotype,
    tailLength: breedGenotype(parent1.genotype.tailLength, parent2.genotype.tailLength) as TailLengthGenotype,
    earShape: breedGenotype(parent1.genotype.earShape, parent2.genotype.earShape) as EarShapeGenotype,
    tailColor: breedGenotype(parent1.genotype.tailColor, parent2.genotype.tailColor) as TailColorGenotype,
  };

  return {
    id: generateCatId(),
    name,
    genotype,
    phenotype: getPhenotype(genotype),
    age: 0,
    happiness: 100,
  };
}

/**
 * Create a random genotype for initial cats
 */
export function createRandomGenotype(): CatGenotype {
  const randomAllele = <T>(dominant: T, recessive: T): [T, T] => {
    const pick = (): T => Math.random() < 0.5 ? dominant : recessive;
    return [pick(), pick()];
  };

  return {
    size: randomAllele<SizeAllele>('S', 's'),
    tailLength: randomAllele<TailLengthAllele>('T', 't'),
    earShape: randomAllele<EarShapeAllele>('E', 'f'),
    tailColor: randomAllele<TailColorAllele>('O', 'w'),
  };
}

/**
 * Create a cat with random genetics
 */
export function createRandomCat(name: string): Cat {
  const genotype = createRandomGenotype();
  return {
    id: generateCatId(),
    name,
    genotype,
    phenotype: getPhenotype(genotype),
    age: Math.floor(Math.random() * 365) + 30, // 1 month to 1 year old
    happiness: 70 + Math.floor(Math.random() * 30), // 70-100
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

export function getRandomCatName(): string {
  return CAT_NAMES[Math.floor(Math.random() * CAT_NAMES.length)];
}
