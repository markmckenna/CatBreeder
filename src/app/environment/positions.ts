/**
 * Cat position management for the room.
 * 
 * Cats prefer to be near furniture and cozy spots.
 * Positions are percentage coordinates (x, y) within the room.
 */

import type { OwnedFurniture } from './furniture.ts';
import type { RandomFn } from '@/base/random.ts';

export interface Position {
  x: number;
  y: number;
}

export interface CatPosition {
  catId: string;
  x: number;
  y: number;
}

/**
 * Positions tied to fixed room elements (always available)
 */
const ROOM_ELEMENT_POSITIONS: Position[] = [
  // Fireplace rug area (always present)
  { x: 50, y: 75 },   // Center on fireplace rug
  { x: 40, y: 78 },   // Left side of fireplace rug
  { x: 60, y: 78 },   // Right side of fireplace rug
  { x: 45, y: 72 },   // Upper left rug
  { x: 55, y: 72 },   // Upper right rug
  
  // Near built-in cat beds (always present)
  { x: 18, y: 82 },   // Near left cat bed
  { x: 82, y: 82 },   // Near right cat bed
  
  // Near other room elements
  { x: 70, y: 65 },   // Near bookshelf
  { x: 25, y: 70 },   // Near plant
];

/**
 * Positions tied to player-owned furniture
 */
const TOY_POSITIONS: Position[] = [
  { x: 25, y: 80 },
  { x: 75, y: 80 },
  { x: 50, y: 70 },
  { x: 15, y: 75 },
  { x: 85, y: 75 },
];

const BED_POSITIONS: Position[] = [
  { x: 35, y: 82 },
  { x: 65, y: 82 },
  { x: 20, y: 90 },
  { x: 80, y: 90 },
  { x: 50, y: 88 },
];

/**
 * Fallback positions when furniture is full
 */
const FLOOR_POSITIONS: Position[] = [
  { x: 35, y: 85 },   // Lower left floor
  { x: 65, y: 85 },   // Lower right floor
  { x: 30, y: 90 },   // Far left back
  { x: 70, y: 90 },   // Far right back
  { x: 50, y: 92 },   // Center back
  { x: 15, y: 75 },   // Far left middle
];

/**
 * Get available positions based on furniture owned.
 * Cats prefer furniture spots, then room elements, then floor.
 */
export function getAvailablePositions(furniture: OwnedFurniture): Position[] {
  const positions: Position[] = [];
  
  // Add furniture-based positions first (they're preferred)
  const toyCount = Math.min(furniture.toys, TOY_POSITIONS.length);
  const bedCount = Math.min(furniture.beds, BED_POSITIONS.length);
  
  for (let i = 0; i < toyCount; i++) {
    positions.push(TOY_POSITIONS[i]);
  }
  
  for (let i = 0; i < bedCount; i++) {
    positions.push(BED_POSITIONS[i]);
  }
  
  // Then add built-in room element positions
  positions.push(...ROOM_ELEMENT_POSITIONS);
  
  // Finally add floor positions as fallback
  positions.push(...FLOOR_POSITIONS);
  
  return positions;
}

/**
 * Assign positions to cats based on available furniture.
 * 
 * @param catIds - IDs of cats to place
 * @param furniture - Player's owned furniture
 * @param random - Optional random function for position variance
 */
export function assignCatPositions(
  catIds: string[],
  furniture: OwnedFurniture,
  random?: RandomFn
): CatPosition[] {
  const positions = getAvailablePositions(furniture);
  
  return catIds.map((catId, index) => {
    // Cycle through positions if we have more cats than spots
    const pos = positions[index % positions.length];
    
    // Add small random offset for visual variety (if random provided)
    const offset = random ? {
      x: (random() - 0.5) * 3,  // ±1.5% variance
      y: (random() - 0.5) * 2,  // ±1% variance
    } : { x: 0, y: 0 };
    
    return {
      catId,
      x: pos.x + offset.x,
      y: pos.y + offset.y,
    };
  });
}
