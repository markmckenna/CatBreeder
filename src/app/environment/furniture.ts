/**
 * Furniture system for cat rooms.
 * Furniture increases carrying capacity and affects cat happiness.
 */

// Purchasable furniture item types
export type FurnitureItemType = 'toy' | 'bed' | 'catTree';

/**
 * Definition of a furniture item available in the shop
 */
export interface FurnitureItem {
  type: FurnitureItemType;
  name: string;
  price: number;
  capacityBonus: number;
}

/**
 * Furniture shop inventory - available items for purchase
 */
export const SHOP_ITEMS: Record<FurnitureItemType, FurnitureItem> = {
  toy: {
    type: 'toy',
    name: 'Cat Toy',
    price: 50,
    capacityBonus: 1,
  },
  bed: {
    type: 'bed',
    name: 'Cat Bed',
    price: 100,
    capacityBonus: 1,
  },
  catTree: {
    type: 'catTree',
    name: 'Cat Tree',
    price: 200,
    capacityBonus: 3,
  },
};

/**
 * Player's owned furniture counts
 */
export interface OwnedFurniture {
  toys: number;
  beds: number;
  catTrees: number;
}

/**
 * Create initial furniture state (player owns nothing)
 */
export function createInitialFurniture(): OwnedFurniture {
  return {
    toys: 0,
    beds: 0,
    catTrees: 0,
  };
}

/**
 * Base carrying capacity (just for having a room)
 */
export const BASE_CAPACITY = 2;

/**
 * Calculate total cat carrying capacity based on furniture
 */
export function calculateCapacity(furniture: OwnedFurniture): number {
  return BASE_CAPACITY + furniture.toys + furniture.beds + ((furniture.catTrees ?? 0) * 3);
}

/**
 * Get total furniture count
 */
export function getTotalFurniture(furniture: OwnedFurniture): number {
  return furniture.toys + furniture.beds + (furniture.catTrees ?? 0);
}

/**
 * Happiness change constants (percentages)
 * Each cat's happiness changes daily based on their experience.
 */
export const HAPPINESS_RULES = {
  /** Base daily decay when no special conditions */
  BASE_DECAY: -5,
  /** Bonus for having access to a toy */
  TOY_BONUS: 5,
  /** Bonus for having access to a bed */
  BED_BONUS: 8,
  /** Penalty for being on floor (no comfort spot) */
  NO_COMFORT_PENALTY: -5,
  /** Penalty for being the only cat */
  ALONE_PENALTY: -5,
  /** Penalty per cat over capacity (applied to ALL cats) */
  OVERCROWD_PENALTY_PER_CAT: -1,
};

/**
 * Get happiness status description for UI display
 */
export function getHappinessStatus(catCount: number, furniture: OwnedFurniture): {
  status: 'happy' | 'neutral' | 'stressed';
  description: string;
} {
  const capacity = calculateCapacity(furniture);
  const overcrowded = catCount > capacity;
  const hasComfortItems = furniture.toys > 0 || furniture.beds > 0 || furniture.catTrees > 0;
  
  if (overcrowded) {
    return { 
      status: 'stressed', 
      description: 'Your cats are stressed from overcrowding!' 
    };
  } else if (hasComfortItems && catCount >= 2) {
    return { 
      status: 'happy', 
      description: 'Your cats are thriving!' 
    };
  } else {
    return { 
      status: 'neutral', 
      description: 'Your cats are content.' 
    };
  }
}
