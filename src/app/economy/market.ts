/**
 * Market pricing and economy logic.
 * 
 * Currently uses fixed demand. Trait values are static.
 * Future: Implement shifting trends, buyer cohorts, supply/demand.
 */

import type { Cat, CatPhenotype, SizePhenotype, TailLengthPhenotype, EarShapePhenotype, TailColorPhenotype, RandomFn } from '../cats/genetics.ts';
import { createRandomCat, randomCatName } from '../cats/genetics.ts';
import { defaultRandom, normalRandom } from '@/base/random.ts';

/**
 * Value modifiers for each trait variant
 * Higher = more valuable
 */
export interface TraitValues {
  size: Record<SizePhenotype, number>;
  tailLength: Record<TailLengthPhenotype, number>;
  earShape: Record<EarShapePhenotype, number>;
  tailColor: Record<TailColorPhenotype, number>;
}

/**
 * Current market state
 */
export interface MarketState {
  basePrice: number;
  traitValues: TraitValues;
  // Future: trends, buyer demand, etc.
}

/**
 * A cat listed for sale
 */
export interface SaleListing {
  catId: string;
  askingPrice: number;
  listedOnDay: number;
}

/**
 * Transaction record
 */
export interface Transaction {
  type: 'buy' | 'sell';
  catId: string;
  amount: number;
  day: number;
}

/**
 * Default trait values - represents current market preferences.
 * Rarer recessive traits are generally more valuable.
 */
export const DEFAULT_TRAIT_VALUES: TraitValues = {
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
  tailColor: {
    white: 1.4,  // Recessive, rarer
    orange: 1.0, // Dominant, common
  },
};

/**
 * Daily food cost per cat
 */
export const FOOD_COST_PER_CAT = 1;

/**
 * Create initial market state
 */
export function createMarketState(): MarketState {
  return {
    basePrice: 100,
    traitValues: DEFAULT_TRAIT_VALUES,
  };
}

/**
 * Calculate value multiplier from phenotype with optional price fluctuation.
 * When fluctuate is true, each trait gets ±10% variance (normal distribution, stdDev ~3.33%).
 */
export function getTraitMultiplier(
  phenotype: CatPhenotype,
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
    applyFluctuation(traitValues.tailColor[phenotype.tailColor])
  );
}

/**
 * Calculate a cat's market value.
 * @param cat - The cat to value
 * @param market - Market state with base price and trait values
 * @param options - Optional settings for fluctuation and random source
 */
export function calculateCatValue(
  cat: Cat,
  market: MarketState,
  options: { fluctuate?: boolean; random?: RandomFn } = {}
): number {
  const { fluctuate = false, random = defaultRandom } = options;
  const traitMultiplier = getTraitMultiplier(cat.phenotype, market.traitValues, fluctuate, random);
  
  // Happiness directly affects value: 0% happiness = $0, 100% happiness = full price
  const happinessMultiplier = cat.happiness / 100;
  
  // Kittens (under 4 weeks) have a 20% premium
  const kittenPremium = cat.age < 4 ? 1.2 : 1;
  
  const value = market.basePrice * traitMultiplier * happinessMultiplier * kittenPremium;
  
  return Math.round(value);
}

/**
 * Get a description of why a cat is valuable
 */
export function getValueBreakdown(cat: Cat, market: MarketState): { trait: string; multiplier: number }[] {
  const breakdown: { trait: string; multiplier: number }[] = [];
  const tv = market.traitValues;

  if (tv.size[cat.phenotype.size] > 1) breakdown.push({ trait: `${cat.phenotype.size} size`, multiplier: tv.size[cat.phenotype.size] });
  if (tv.tailLength[cat.phenotype.tailLength] > 1) breakdown.push({ trait: `${cat.phenotype.tailLength} tail`, multiplier: tv.tailLength[cat.phenotype.tailLength] });
  if (tv.earShape[cat.phenotype.earShape] > 1) breakdown.push({ trait: `${cat.phenotype.earShape} ears`, multiplier: tv.earShape[cat.phenotype.earShape] });
  if (tv.tailColor[cat.phenotype.tailColor] > 1) breakdown.push({ trait: `${cat.phenotype.tailColor} fur`, multiplier: tv.tailColor[cat.phenotype.tailColor] });
  if (cat.age < 4) breakdown.push({ trait: 'kitten', multiplier: 1.2 });

  return breakdown;
}

/**
 * Market premium when buying cats (20%)
 */
export const MARKET_BUY_PREMIUM = 0.2;

/**
 * Number of cats available in market each day
 */
export const MARKET_INVENTORY_SIZE = 3;

/**
 * A cat available for purchase in the market
 */
export interface MarketCat {
  cat: Cat;
  price: number;
}

/**
 * Calculate purchase price for a cat (includes market premium)
 */
export function calculatePurchasePrice(cat: Cat, market: MarketState): number {
  const baseValue = calculateCatValue(cat, market);
  const withPremium = baseValue * (1 + MARKET_BUY_PREMIUM);
  return Math.round(withPremium);
}

/**
 * Generate cats available for purchase in the market
 * @param market - Current market state
 * @param rng - Optional random function for deterministic generation
 */
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
