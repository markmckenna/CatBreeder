/** Hierarchical room object model - defines spatial relationships and containers */

import type { Cat as CatEntity } from '../cats/Cat.ts';
import type { OwnedFurniture } from './furniture.ts';
import type { RandomFn } from '@/core/random.ts';
import type { SpotType } from './positions.ts';

/**
 * Base interface for all scene objects.
 *
 * Position (x, y) is in world coordinates (percentage of room, 0-100).
 * basePoint: Where this object attaches to its parent (parent-local %, 0-100).
 * mountPoint: Where children attach to this object (local %, 0-100).
 */
export interface SceneObject {
  id: string;
  type: string;
  /** World position (percentage of room) */
  x: number;
  y: number;
  /** Where this object mounts to parent (parent-local coordinates, 0-100) */
  basePoint: { x: number; y: number };
  /** Where children mount to this object (local coordinates, 0-100) */
  mountPoint: { x: number; y: number };
}

/**
 * A container that can hold child objects.
 * Capacity: maximum number of entities that can be contained.
 */
export interface Container<T extends SceneObject = SceneObject>
  extends SceneObject {
  children: T[];
  capacity: number;
}

/**
 * Cat in a scene - can hold toys.
 */
export interface SceneCat extends Container<SceneToy> {
  type: 'cat';
  catId: string;
  catEntity: CatEntity; // Reference to the actual Cat data
  capacity: 1;
}

/**
 * Toy in a scene - leaf node.
 */
export interface SceneToy extends SceneObject {
  type: 'toy';
  toyId: string;
}

/**
 * Room - root container for all objects in the scene.
 * Capacity: unlimited. Mount point: floor center.
 */
export interface Room extends Container<RoomChild> {
  type: 'room';
  capacity: number; // Effectively unlimited
}

export type RoomChild = CatTree | Bed | Rug | SceneCat | SceneToy;

/**
 * Cat Tree - furniture container for cats.
 * Capacity: 3 cats. Mount points: 3 platforms (top, mid, bottom).
 */
export interface CatTree extends Container<SceneCat> {
  type: 'catTree';
  index: number; // Which cat tree this is (0-based)
  capacity: 3;
  /** Platform mount points as fractions of tree height */
  platforms: Array<{ x: number; y: number }>; // Should be 3 points
}

/**
 * Bed - furniture container for cats and toys.
 * Capacity: 1 cat + 1 toy (if cat is present).
 */
export interface Bed extends Container<SceneCat | SceneToy> {
  type: 'bed';
  index: number; // Which bed this is (0-based)
  capacity: 2; // 1 cat + 1 toy
}

/**
 * Rug - built-in container for cats and toys.
 * Capacity: 1 cat + 1 toy.
 */
export interface Rug extends Container<SceneCat | SceneToy> {
  type: 'rug';
  index: number;
  capacity: 2; // 1 cat + 1 toy
}


/**
 * Mount point definitions for each furniture type.
 * These define where child objects attach within the parent.
 * @internal Used by buildSceneTree - export moved to Room component for UI layer
 */
const DEFAULT_MOUNT_POINTS = {
  /** Where cats attach on cat tree platforms (local %, relative to tree) */
  catTreePlatforms: [
    { x: 50, y: 10 }, // Top platform
    { x: 50, y: 50 }, // Mid platform
    { x: 50, y: 90 }, // Bottom platform
  ],
  /** Where a cat mounts to a bed */
  bed: { x: 50, y: 20 },
  /** Where a cat mounts to a rug */
  rug: { x: 50, y: 20 },
  /** Where a toy mounts to a cat (near front paw) */
  catPaw: { x: 70, y: 60 },
  /** Where furniture mounts to room floor */
  roomFloor: { x: 50, y: 100 },
};

/**
 * Base positions for furniture and room objects (in world coordinates).
 * These are the anchor points from which children positions are calculated.
 * @internal Used by buildSceneTree - export moved to Room component for UI layer
 */
const DEFAULT_BASE_POSITIONS = {
  catTree: [
    { x: 12, y: 65 },  // Left cat tree
    { x: 88, y: 65 },  // Right cat tree
  ],
  bed: [
    { x: 30, y: 83 },
    { x: 70, y: 83 },
    { x: 18, y: 90 },
    { x: 82, y: 90 },
    { x: 50, y: 94 },
  ],
  rug: [
    { x: 50, y: 80 },
    { x: 40, y: 82 },
    { x: 60, y: 82 },
    { x: 44, y: 86 },
    { x: 56, y: 86 },
  ],
  toy: [
    { x: 22, y: 78, itemOffset: { x: 6, y: 2 } },
    { x: 78, y: 78, itemOffset: { x: 6, y: 2 } },
    { x: 35, y: 88, itemOffset: { x: -6, y: 2 } },
    { x: 65, y: 88, itemOffset: { x: 6, y: 2 } },
    { x: 50, y: 92, itemOffset: { x: 6, y: 0 } },
  ],
};

// Positioning functions removed - moved to Room component (UI layer)
// See src/app/ui/Room/index.tsx for getWorldPosition and getLocalPosition

/**
 * Build a hierarchical scene tree from flat game state.
 *
 * Assignment strategy (priority):
 *   1. Assign cats to cat trees (max 3 per tree)
 *   2. Remaining cats to beds (max 1 per bed)
 *   3. Remaining cats to rugs (max 1 per rug)
 *   4. Remaining cats to room floor
 *
 * Toys are assigned to:
 *   - Cat holding them (mounted to cat.mountPoint)
 *   - Or placed on floor if not held
 *
 * @param cats Array of cat entities from game state
 * @param furniture Owned furniture counts
 * @param random Optional random function for position variance
 * @param positioning Optional positioning constants (MOUNT_POINTS and BASE_POSITIONS).
 *        If not provided, uses defaults. Passed from UI layer (Room component).
 * @returns Scene tree with Room as root
 */
export function buildSceneTree(
  cats: CatEntity[],
  furniture: OwnedFurniture,
  random?: RandomFn,
  positioning?: {
    MOUNT_POINTS: typeof DEFAULT_MOUNT_POINTS;
    BASE_POSITIONS: typeof DEFAULT_BASE_POSITIONS;
  }
): Room {
  // Use provided positioning or defaults
  const MOUNT_POINTS = positioning?.MOUNT_POINTS ?? DEFAULT_MOUNT_POINTS;
  const BASE_POSITIONS = positioning?.BASE_POSITIONS ?? DEFAULT_BASE_POSITIONS;

  const room: Room = {
    type: 'room',
    id: 'room',
    x: 50,
    y: 50,
    basePoint: { x: 0, y: 0 },
    mountPoint: { x: 50, y: 100 },
    children: [],
    capacity: Infinity,
  };

  // Build furniture containers
  const catTrees: CatTree[] = [];
  for (let i = 0; i < Math.min(furniture.catTrees, BASE_POSITIONS.catTree.length); i++) {
    const base = BASE_POSITIONS.catTree[i];
    catTrees.push({
      type: 'catTree',
      id: `catTree-${i}`,
      index: i,
      x: base.x,
      y: base.y,
      basePoint: MOUNT_POINTS.roomFloor,
      mountPoint: { x: 50, y: 0 }, // Platform 0 (top) is at y:0 of tree local space
      children: [],
      capacity: 3,
      platforms: MOUNT_POINTS.catTreePlatforms,
    });
  }

  const beds: Bed[] = [];
  for (let i = 0; i < Math.min(furniture.beds, BASE_POSITIONS.bed.length); i++) {
    const base = BASE_POSITIONS.bed[i];
    beds.push({
      type: 'bed',
      id: `bed-${i}`,
      index: i,
      x: base.x,
      y: base.y,
      basePoint: MOUNT_POINTS.roomFloor,
      mountPoint: MOUNT_POINTS.bed,
      children: [],
      capacity: 2,
    });
  }

  const rugs: Rug[] = [];
  // Rugs are always available (built-in furniture), no furniture count needed
  for (let i = 0; i < BASE_POSITIONS.rug.length; i++) {
    const base = BASE_POSITIONS.rug[i];
    rugs.push({
      type: 'rug',
      id: `rug-${i}`,
      index: i,
      x: base.x,
      y: base.y,
      basePoint: MOUNT_POINTS.roomFloor,
      mountPoint: MOUNT_POINTS.rug,
      children: [],
      capacity: 2,
    });
  }

  // Track which cats have been assigned
  let catIndex = 0;

  // Assign cats to cat trees
  for (const tree of catTrees) {
    while (tree.children.length < tree.capacity && catIndex < cats.length) {
      const catEntity = cats[catIndex];
      const sceneCat: SceneCat = {
        type: 'cat',
        id: catEntity.id,
        catId: catEntity.id,
        catEntity,
        x: tree.x,
        y: tree.y - (tree.children.length * 15), // Stack vertically
        basePoint: tree.platforms[tree.children.length],
        mountPoint: MOUNT_POINTS.catPaw,
        children: [],
        capacity: 1,
      };
      tree.children.push(sceneCat);
      catIndex++;
    }
  }

  // Assign remaining cats to beds
  for (const bed of beds) {
    if (catIndex < cats.length && bed.children.filter(c => c.type === 'cat').length === 0) {
      const catEntity = cats[catIndex];
      const sceneCat: SceneCat = {
        type: 'cat',
        id: catEntity.id,
        catId: catEntity.id,
        catEntity,
        x: bed.x,
        y: bed.y,
        basePoint: bed.mountPoint,
        mountPoint: MOUNT_POINTS.catPaw,
        children: [],
        capacity: 1,
      };
      bed.children.push(sceneCat);
      catIndex++;
    }
  }

  // Assign remaining cats to rugs
  for (const rug of rugs) {
    if (catIndex < cats.length && rug.children.filter(c => c.type === 'cat').length === 0) {
      const catEntity = cats[catIndex];
      const sceneCat: SceneCat = {
        type: 'cat',
        id: catEntity.id,
        catId: catEntity.id,
        catEntity,
        x: rug.x,
        y: rug.y,
        basePoint: rug.mountPoint,
        mountPoint: MOUNT_POINTS.catPaw,
        children: [],
        capacity: 1,
      };
      rug.children.push(sceneCat);
      catIndex++;
    }
  }

  // Assign remaining cats to room floor
  const floorCats: SceneCat[] = [];
  while (catIndex < cats.length) {
    const catEntity = cats[catIndex];
    const spotIndex = floorCats.length;
    const floorSpotDefs = [
      { x: 15, y: 85 },
      { x: 85, y: 85 },
      { x: 25, y: 92 },
      { x: 75, y: 92 },
      { x: 45, y: 90 },
      { x: 55, y: 90 },
    ];
    const spot = floorSpotDefs[spotIndex % floorSpotDefs.length];
    const offset = random ? {
      x: (random() - 0.5) * 3,
      y: (random() - 0.5) * 2,
    } : { x: 0, y: 0 };

    const sceneCat: SceneCat = {
      type: 'cat',
      id: catEntity.id,
      catId: catEntity.id,
      catEntity,
      x: spot.x + offset.x,
      y: spot.y + offset.y,
      basePoint: { x: spot.x, y: spot.y },
      mountPoint: MOUNT_POINTS.catPaw,
      children: [],
      capacity: 1,
    };
    floorCats.push(sceneCat);
    catIndex++;
  }

  // Add all furniture containers and floor cats to room
  room.children.push(...catTrees, ...beds, ...rugs, ...floorCats);

  return room;
}

/**
 * Get the spot type for a cat based on its position in the scene tree.
 * Used for happiness calculations based on furniture type.
 *
 * @param sceneTree Root scene tree
 * @param catId Cat ID to find spot type for
 * @returns SpotType ('catTree' | 'bed' | 'rug' | 'floor'), or undefined if cat not found
 */
export function getCatSpotType(sceneTree: Room, catId: string): SpotType | undefined {
  // Recursively search for cat in tree
  const search = (container: Container): SpotType | undefined => {
    for (const child of container.children) {
      if (child.type === 'cat' && ('catId' in child) && child.catId === catId) {
        // Found the cat, return parent's type
        return container.type as SpotType;
      }
      if ('children' in child) {
        const result = search(child as Container);
        if (result) return result;
      }
    }
    return undefined;
  };

  return search(sceneTree);
}
