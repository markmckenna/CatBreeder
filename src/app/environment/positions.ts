/**
 * Cat position management for the room.
 * 
 * Each position is tied to a specific room object that provides comfort.
 * Positions are percentage coordinates (x, y) within the room.
 */

import type { OwnedFurniture } from './furniture.ts';
import type { RandomFn } from '@/base/random.ts';

/** Types of spots cats can occupy */
export type SpotType = 'rug' | 'bookshelf' | 'toy' | 'bed' | 'floor';

/** A named position in the room */
export interface RoomSpot {
  id: string;
  type: SpotType;
  x: number;
  y: number;
  /** For toys: position offset for the toy item itself */
  itemOffset?: { x: number; y: number };
}

export interface CatPosition {
  catId: string;
  x: number;
  y: number;
  spotType: SpotType;
  spotId: string;
}

/**
 * Built-in room spots (always available)
 * - Rug: multiple spots on the cozy rug
 * - Bookshelf: cat can sit near the bookshelf
 */
const BUILTIN_SPOTS: RoomSpot[] = [
  // Rug spots (in front of fireplace)
  { id: 'rug-center', type: 'rug', x: 50, y: 80 },
  { id: 'rug-left', type: 'rug', x: 40, y: 82 },
  { id: 'rug-right', type: 'rug', x: 60, y: 82 },
  { id: 'rug-front-left', type: 'rug', x: 44, y: 86 },
  { id: 'rug-front-right', type: 'rug', x: 56, y: 86 },
  
  // Bookshelf spot
  { id: 'bookshelf', type: 'bookshelf', x: 75, y: 72 },
];

/**
 * Toy spot definitions (when player owns toys)
 * Toys render to the right of the cat
 */
const TOY_SPOT_DEFS: Omit<RoomSpot, 'type'>[] = [
  { id: 'toy-1', x: 22, y: 78, itemOffset: { x: 6, y: 2 } },
  { id: 'toy-2', x: 78, y: 78, itemOffset: { x: 6, y: 2 } },
  { id: 'toy-3', x: 35, y: 88, itemOffset: { x: -6, y: 2 } },
  { id: 'toy-4', x: 65, y: 88, itemOffset: { x: 6, y: 2 } },
  { id: 'toy-5', x: 50, y: 92, itemOffset: { x: 6, y: 0 } },
];

/**
 * Bed spot definitions (when player owns beds)
 * Beds render under the cat
 */
const BED_SPOT_DEFS: Omit<RoomSpot, 'type'>[] = [
  { id: 'bed-1', x: 30, y: 83 },
  { id: 'bed-2', x: 70, y: 83 },
  { id: 'bed-3', x: 18, y: 90 },
  { id: 'bed-4', x: 82, y: 90 },
  { id: 'bed-5', x: 50, y: 94 },
];

/**
 * Floor positions (no comfort bonus)
 */
const FLOOR_SPOTS: RoomSpot[] = [
  { id: 'floor-1', type: 'floor', x: 15, y: 85 },
  { id: 'floor-2', type: 'floor', x: 85, y: 85 },
  { id: 'floor-3', type: 'floor', x: 25, y: 92 },
  { id: 'floor-4', type: 'floor', x: 75, y: 92 },
  { id: 'floor-5', type: 'floor', x: 45, y: 90 },
  { id: 'floor-6', type: 'floor', x: 55, y: 90 },
];

/**
 * Get all available spots based on furniture owned.
 * Order determines priority: beds > toys > rug/bookshelf > floor
 */
export function getAvailableSpots(furniture: OwnedFurniture): RoomSpot[] {
  const spots: RoomSpot[] = [];
  
  // Beds first (highest comfort)
  const bedCount = Math.min(furniture.beds, BED_SPOT_DEFS.length);
  for (let i = 0; i < bedCount; i++) {
    spots.push({ ...BED_SPOT_DEFS[i], type: 'bed' });
  }
  
  // Then toys
  const toyCount = Math.min(furniture.toys, TOY_SPOT_DEFS.length);
  for (let i = 0; i < toyCount; i++) {
    spots.push({ ...TOY_SPOT_DEFS[i], type: 'toy' });
  }
  
  // Built-in spots
  spots.push(...BUILTIN_SPOTS);
  
  // Floor as fallback
  spots.push(...FLOOR_SPOTS);
  
  return spots;
}

/**
 * Assign cats to spots based on available furniture.
 * Returns positions with spot type info for happiness calculation.
 */
export function assignCatPositions(
  catIds: string[],
  furniture: OwnedFurniture,
  random?: RandomFn
): CatPosition[] {
  const spots = getAvailableSpots(furniture);
  
  return catIds.map((catId, index) => {
    // Cycle through spots if we have more cats than spots
    const spot = spots[index % spots.length];
    
    // Add small random offset for visual variety
    const offset = random ? {
      x: (random() - 0.5) * 3,
      y: (random() - 0.5) * 2,
    } : { x: 0, y: 0 };
    
    return {
      catId,
      x: spot.x + offset.x,
      y: spot.y + offset.y,
      spotType: spot.type,
      spotId: spot.id,
    };
  });
}

/**
 * Get furniture item positions for rendering.
 * Returns positions where toys/beds should be drawn.
 */
export interface FurniturePosition {
  type: 'toy' | 'bed';
  index: number;
  x: number;
  y: number;
}

export function getFurniturePositions(
  catPositions: CatPosition[],
  furniture: OwnedFurniture
): FurniturePosition[] {
  const positions: FurniturePosition[] = [];
  
  // Get spots for toys and beds that have cats on them
  for (const catPos of catPositions) {
    if (catPos.spotType === 'toy') {
      // Find the toy definition to get item offset
      const spotDef = TOY_SPOT_DEFS.find(s => s.id === catPos.spotId);
      const offset = spotDef?.itemOffset ?? { x: 6, y: 2 };
      const index = TOY_SPOT_DEFS.findIndex(s => s.id === catPos.spotId);
      if (index < furniture.toys) {
        positions.push({
          type: 'toy',
          index,
          x: catPos.x + offset.x,
          y: catPos.y + offset.y,
        });
      }
    } else if (catPos.spotType === 'bed') {
      const index = BED_SPOT_DEFS.findIndex(s => s.id === catPos.spotId);
      if (index < furniture.beds) {
        positions.push({
          type: 'bed',
          index,
          // Bed is centered under the cat
          x: catPos.x,
          y: catPos.y + 2,
        });
      }
    }
  }
  
  // Also show empty furniture that isn't occupied
  const usedToyIds = new Set(catPositions.filter(p => p.spotType === 'toy').map(p => p.spotId));
  const usedBedIds = new Set(catPositions.filter(p => p.spotType === 'bed').map(p => p.spotId));
  
  for (let i = 0; i < Math.min(furniture.toys, TOY_SPOT_DEFS.length); i++) {
    const def = TOY_SPOT_DEFS[i];
    if (!usedToyIds.has(def.id)) {
      positions.push({
        type: 'toy',
        index: i,
        x: def.x,
        y: def.y,
      });
    }
  }
  
  for (let i = 0; i < Math.min(furniture.beds, BED_SPOT_DEFS.length); i++) {
    const def = BED_SPOT_DEFS[i];
    if (!usedBedIds.has(def.id)) {
      positions.push({
        type: 'bed',
        index: i,
        x: def.x,
        y: def.y,
      });
    }
  }
  
  return positions;
}

/**
 * Persistent colors for furniture items based on index.
 * These are deterministic so colors don't change.
 */
const TOY_COLORS = [
  { main: '#FF6B6B', accent: '#C62828' },  // Red
  { main: '#64B5F6', accent: '#1565C0' },  // Blue
  { main: '#81C784', accent: '#2E7D32' },  // Green
  { main: '#FFD54F', accent: '#F9A825' },  // Yellow
  { main: '#BA68C8', accent: '#7B1FA2' },  // Purple
];

const BED_COLORS = [
  { main: '#9C27B0', accent: '#6A1B9A', cushion: '#CE93D8' },  // Purple
  { main: '#FF7043', accent: '#D84315', cushion: '#FFAB91' },  // Orange
  { main: '#26A69A', accent: '#00796B', cushion: '#80CBC4' },  // Teal
  { main: '#5C6BC0', accent: '#3949AB', cushion: '#9FA8DA' },  // Indigo
  { main: '#EC407A', accent: '#C2185B', cushion: '#F48FB1' },  // Pink
];

export function getToyColor(index: number) {
  return TOY_COLORS[index % TOY_COLORS.length];
}

export function getBedColor(index: number) {
  return BED_COLORS[index % BED_COLORS.length];
}
