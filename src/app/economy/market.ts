/**
 * Market pricing and economy logic.
 * 
 * Currently uses fixed demand. Trait values are static.
 * Future: Implement shifting trends, buyer cohorts, supply/demand.
 */

import type { Cat, CatPhenotype, SizePhenotype, TailLengthPhenotype, EarShapePhenotype, TailColorPhenotype, RandomFn } from '../cats/genetics.ts';
import { createRandomCat, getRandomCatName } from '../cats/genetics.ts';

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
 * Calculate value multiplier from phenotype
 */
export function getTraitMultiplier(phenotype: CatPhenotype, traitValues: TraitValues): number {
  return (
    traitValues.size[phenotype.size] *
    traitValues.tailLength[phenotype.tailLength] *
    traitValues.earShape[phenotype.earShape] *
    traitValues.tailColor[phenotype.tailColor]
  );
}

/**
 * Calculate a cat's market value
 */
export function calculateCatValue(cat: Cat, market: MarketState): number {
  const traitMultiplier = getTraitMultiplier(cat.phenotype, market.traitValues);
  
  // Happiness affects value slightly
  const happinessMultiplier = 0.8 + (cat.happiness / 100) * 0.4; // 0.8 to 1.2
  
  const value = market.basePrice * traitMultiplier * happinessMultiplier;
  
  return Math.round(value);
}

/**
 * Get a description of why a cat is valuable
 */
export function getValueBreakdown(cat: Cat, market: MarketState): { trait: string; multiplier: number }[] {
  const breakdown: { trait: string; multiplier: number }[] = [];
  const tv = market.traitValues;

  if (tv.size[cat.phenotype.size] > 1) {
    breakdown.push({ trait: `${cat.phenotype.size} size`, multiplier: tv.size[cat.phenotype.size] });
  }
  if (tv.tailLength[cat.phenotype.tailLength] > 1) {
    breakdown.push({ trait: `${cat.phenotype.tailLength} tail`, multiplier: tv.tailLength[cat.phenotype.tailLength] });
  }
  if (tv.earShape[cat.phenotype.earShape] > 1) {
    breakdown.push({ trait: `${cat.phenotype.earShape} ears`, multiplier: tv.earShape[cat.phenotype.earShape] });
  }
  if (tv.tailColor[cat.phenotype.tailColor] > 1) {
    breakdown.push({ trait: `${cat.phenotype.tailColor} fur`, multiplier: tv.tailColor[cat.phenotype.tailColor] });
  }

  return breakdown;
}

/**
 * Format currency for display
 */
export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString()}`;
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
    const name = getRandomCatName(rng);
    const cat = createRandomCat(name, { random: rng });
    const price = calculatePurchasePrice(cat, market);
    inventory.push({ cat, price });
  }
  
  return inventory;
}
