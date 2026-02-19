/**
 * Furniture system for cat rooms.
 * Furniture increases carrying capacity and affects cat happiness.
 */

// Purchasable furniture item types
export type FurnitureItemType = 'toy' | 'bed';

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
};

/**
 * Player's owned furniture counts
 */
export interface OwnedFurniture {
  toys: number;
  beds: number;
}

/**
 * Create initial furniture state (player owns nothing)
 */
export function createInitialFurniture(): OwnedFurniture {
  return {
    toys: 0,
    beds: 0,
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
  return BASE_CAPACITY + furniture.toys + furniture.beds;
}

/**
 * Get total furniture count
 */
export function getTotalFurniture(furniture: OwnedFurniture): number {
  return furniture.toys + furniture.beds;
}

/**
 * Calculate the daily happiness change based on current cat count and capacity.
 * Formula: DailyChange = -5 × Z + 5
 * where Z = (CatCount - OptimalCapacity) / (OptimalCapacity × 0.25)
 */
export function calculateHappinessChange(catCount: number, furniture: OwnedFurniture): number {
  const optimalCapacity = calculateCapacity(furniture);
  const zScore = (catCount - optimalCapacity) / (optimalCapacity * 0.25);
  return -5 * zScore + 5;
}

/**
 * Get happiness status description based on change rate
 */
export function getHappinessStatus(catCount: number, furniture: OwnedFurniture): {
  status: 'happy' | 'neutral' | 'stressed';
  change: number;
  description: string;
} {
  const change = calculateHappinessChange(catCount, furniture);
  
  if (change > 2) {
    return { status: 'happy', change, description: 'Your cats are thriving!' };
  } else if (change >= -2) {
    return { status: 'neutral', change, description: 'Your cats are content.' };
  } else {
    return { status: 'stressed', change, description: 'Your cats are stressed from overcrowding!' };
  }
}
