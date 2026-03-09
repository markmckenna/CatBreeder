/**
 * Public API for environment, furniture, and positioning.
 * 
 * This module exports furniture types, shop items, and positioning functions.
 * Internal positioning mechanics are kept private.
 */

export type { FurnitureItemType, FurnitureItem, OwnedFurniture } from './furniture.ts';
export { SHOP_ITEMS, calculateCapacity, HAPPINESS_RULES, getHappinessStatus } from './furniture.ts';

export type { SpotType, FurniturePosition, CatPosition, RoomSpot } from './positions.ts';
export { assignCatPositions, getFurniturePositions, getToyColor, getBedColor } from './positions.ts';
