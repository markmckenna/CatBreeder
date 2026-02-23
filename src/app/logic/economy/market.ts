/** Market pricing and economy. Fixed demand for now; future: trends, supply/demand. */

import type { Cat } from '../cats/Cat';
import { createRandomCat, randomCatName, phenotypeFor } from '../cats/Cat';
import { defaultRandom, normalRandom, type RandomFn } from '@/base/random.ts';

/** Value multipliers by trait variant (higher = more valuable) */
export interface TraitValues {
  size: Record<string, number>;
  tailLength: Record<string, number>;
  earShape: Record<string, number>;
  color: Record<string, number>;
}

/** Current market state */
export interface MarketState {
  basePrice: number;
  traitValues: TraitValues;
  // Future: trends, buyer demand, etc.
}

/** A cat listed for sale */
export interface SaleListing {
  catId: string;
  askingPrice: number;
  listedOnDay: number;
}

/** Transaction record */
export interface Transaction {
  type: 'buy' | 'sell';
  catId: string;
  amount: number;
  day: number;
}

/** Default trait values - rarer recessive traits are more valuable */
const DEFAULT_TRAIT_VALUES: TraitValues = {
  size: {
    small: 1.5,  // Recessive, rarer
    large: 1.0,  // Dominant, common
  },
  tailLength: {
    short: 1.3,  // Recessive, rarer
    long: 1.0,   // Dominant, common
  },
  earShape: {
    folded: 2.0, // Recessive, rare and desirable
    pointed: 1.0, // Dominant, common
  },
  color: {
    white: 1.4,  // Recessive, rarer
    orange: 1.0, // Dominant, common
  },
};

/** Daily food cost per cat */
export const FOOD_COST_PER_CAT = 1;

/** @returns initial market state */
export function createMarketState(): MarketState {
  return {
    basePrice: 100,
    traitValues: DEFAULT_TRAIT_VALUES,
  };
}

/** @returns value multiplier from phenotype; ±10% variance when fluctuate=true */
function getTraitMultiplier(
  phenotype: Record<string, string>,
  traitValues: TraitValues,
  fluctuate = false,
  random: RandomFn = defaultRandom
): number {
  // Apply fluctuation: ±10% means we use stdDev of ~3.33% so 3σ ≈ 10%
  const fluctuationStdDev = 0.0333;
  
  const applyFluctuation = (baseValue: number): number => {
    if (!fluctuate) return baseValue;
    const fluctuation = normalRandom(1, fluctuationStdDev, random);
    return baseValue * fluctuation;
  };
  
  return (
    applyFluctuation(traitValues.size[phenotype.size]) *
    applyFluctuation(traitValues.tailLength[phenotype.tailLength]) *
    applyFluctuation(traitValues.earShape[phenotype.earShape]) *
    applyFluctuation(traitValues.color[phenotype.tailColor])
  );
}

/** @returns cat's market value based on traits, happiness, and age */
export function calculateCatValue(
  cat: Cat,
  market: MarketState,
  options: { fluctuate?: boolean; random?: RandomFn } = {}
): number {
  const { fluctuate = false, random = defaultRandom } = options;
  const traitMultiplier = getTraitMultiplier(phenotypeFor(cat.genotype), market.traitValues, fluctuate, random);
  
  // Happiness directly affects value: 0% happiness = $0, 100% happiness = full price
  const happinessMultiplier = cat.happiness / 100;
  
  // Kittens (under 4 weeks) have a 20% premium
  const kittenPremium = cat.age < 4 ? 1.2 : 1;
  
  const value = market.basePrice * traitMultiplier * happinessMultiplier * kittenPremium;
  
  return Math.round(value);
}

/** @returns list of valuable traits for a cat */
export function getValueBreakdown(cat: Cat, market: MarketState): { trait: string; multiplier: number }[] {
  const breakdown: { trait: string; multiplier: number }[] = [];
  const tv = market.traitValues;
  const phenotype = phenotypeFor(cat.genotype);
  if (tv.size[phenotype.size] > 1) breakdown.push({ trait: `${phenotype.size} size`, multiplier: tv.size[phenotype.size] });
  if (tv.tailLength[phenotype.tailLength] > 1) breakdown.push({ trait: `${phenotype.tailLength} tail`, multiplier: tv.tailLength[phenotype.tailLength] });
  if (tv.earShape[phenotype.earShape] > 1) breakdown.push({ trait: `${phenotype.earShape} ears`, multiplier: tv.earShape[phenotype.earShape] });
  if (tv.color[phenotype.color] > 1) breakdown.push({ trait: `${phenotype.color} fur`, multiplier: tv.color[phenotype.color] });
  if (cat.age < 4) breakdown.push({ trait: 'kitten', multiplier: 1.2 });
  return breakdown;
}

/** Market premium when buying cats */
const MARKET_BUY_PREMIUM = 0.2;

/** Cats available in market each day */
const MARKET_INVENTORY_SIZE = 3;

/** A cat available for purchase */
export interface MarketCat {
  cat: Cat;
  price: number;
}

/** @returns purchase price for a cat (includes market premium) */
const calculatePurchasePrice = (cat: Cat, market: MarketState) =>
  Math.round(calculateCatValue(cat, market) * (1 + MARKET_BUY_PREMIUM));

/** @returns cats available for purchase in the market */
export function generateMarketInventory(
  market: MarketState,
  rng?: RandomFn
): MarketCat[] {
  const inventory: MarketCat[] = [];
  
  for (let i = 0; i < MARKET_INVENTORY_SIZE; i++) {
    const name = randomCatName(rng);
    const cat = createRandomCat(name, { random: rng });
    const price = calculatePurchasePrice(cat, market);
    inventory.push({ cat, price });
  }
  
  return inventory;
}
