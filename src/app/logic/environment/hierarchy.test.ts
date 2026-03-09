import { describe, it, expect } from 'vitest';
import { buildSceneTree, getCatSpotType } from './hierarchy';
import type { Cat as CatEntity } from '../cats/Cat';
import type { RandomFn } from '@/core/random';

// Mock helper to create test cats
function createTestCat(id: string, name = 'Test'): CatEntity {
  return {
    id,
    name,
    genotype: 'SSTtEeOo',
    age: 0,
    happiness: 100,
  };
}

// Positioning constants (copied from Room component for testing)
// These must match the values in src/app/ui/Room/index.tsx
const MOUNT_POINTS = {
  catTreePlatforms: [
    { x: 50, y: 10 },
    { x: 50, y: 50 },
    { x: 50, y: 90 },
  ],
  bed: { x: 50, y: 20 },
  rug: { x: 50, y: 20 },
  catPaw: { x: 70, y: 60 },
  roomFloor: { x: 50, y: 100 },
};

const BASE_POSITIONS = {
  catTree: [
    { x: 12, y: 65 },
    { x: 88, y: 65 },
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

// Helper to build scene tree with positioning constants
const buildScene = (cats: CatEntity[], furniture: Parameters<typeof buildSceneTree>[1], random?: RandomFn) =>
  buildSceneTree(cats, furniture, random, { MOUNT_POINTS, BASE_POSITIONS });

describe('Hierarchy - Scene Tree Building', () => {
  it('should create a room with rugs as built-in furniture', () => {
    const tree = buildScene([], { toys: 0, beds: 0, catTrees: 0 });
    expect(tree.type).toBe('room');
    // Rugs are always created as built-in furniture
    const rugs = tree.children.filter(c => c.type === 'rug');
    expect(rugs).toHaveLength(5); // 5 rug spots
  });

  it('should assign a single cat to a cat tree', () => {
    const cats = [createTestCat('cat1')];
    const tree = buildScene(cats, { toys: 0, beds: 0, catTrees: 1 });

    expect(tree.type).toBe('room');
    // 1 cat tree + 5 rugs
    expect(tree.children).toHaveLength(6);

    const catTree = tree.children.find(c => c.type === 'catTree')!;
    expect(catTree.type).toBe('catTree');
    expect(catTree.children).toHaveLength(1); // One cat in the tree
    expect(catTree.children[0].type).toBe('cat');
  });

  it('should fill cat tree with max 3 cats', () => {
    const cats = [
      createTestCat('cat1'),
      createTestCat('cat2'),
      createTestCat('cat3'),
    ];
    const tree = buildScene(cats, { toys: 0, beds: 0, catTrees: 1 });

    const catTree = tree.children.find(c => c.type === 'catTree')!;
    expect(catTree.children).toHaveLength(3);
  });

  it('should overflow cats to beds after cat tree is full', () => {
    const cats = [
      createTestCat('cat1'),
      createTestCat('cat2'),
      createTestCat('cat3'),
      createTestCat('cat4'),
    ];
    const tree = buildScene(cats, { toys: 0, beds: 1, catTrees: 1 });

    const catTree = tree.children.find(c => c.type === 'catTree')!;
    expect(catTree.children).toHaveLength(3);

    const bed = tree.children.find(c => c.type === 'bed')!;
    expect(bed.children).toHaveLength(1);
  });

  it('should overflow cats to rugs after beds are full', () => {
    const cats = Array.from({ length: 5 }, (_, i) => createTestCat(`cat${i + 1}`));
    const tree = buildScene(cats, { toys: 0, beds: 1, catTrees: 1 });

    const catTree = tree.children.find(c => c.type === 'catTree')!;
    expect(catTree.children).toHaveLength(3);

    const bed = tree.children.find(c => c.type === 'bed')!;
    expect(bed.children).toHaveLength(1);

    const rug = tree.children.find(c => c.type === 'rug')!;
    expect(rug.children).toHaveLength(1);
  });

  it('should place remaining cats on room floor', () => {
    const cats = Array.from({ length: 10 }, (_, i) => createTestCat(`cat${i + 1}`));
    const tree = buildScene(cats, { toys: 0, beds: 1, catTrees: 1 });

    const floorCats = tree.children.filter(c => c.type === 'cat');
    expect(floorCats.length).toBeGreaterThan(0);
    expect(floorCats[0].type).toBe('cat');
  });

  it('should respect cat tree capacity of 3', () => {
    const cats = Array.from({ length: 7 }, (_, i) => createTestCat(`cat${i + 1}`));
    const tree = buildScene(cats, { toys: 0, beds: 0, catTrees: 2 });

    const catTrees = tree.children.filter(c => c.type === 'catTree');
    expect(catTrees).toHaveLength(2);
    expect(catTrees[0].children).toHaveLength(3);
    expect(catTrees[1].children).toHaveLength(3);

    // Remaining cat should be on floor or in a rug
    const floorCats = tree.children.filter(c => c.type === 'cat');
    const rugsWithCats = tree.children.filter(c => c.type === 'rug' && c.children.length > 0);
    
    // Either the cat is on the floor directly, or in a rug
    expect(floorCats.length + rugsWithCats.length).toBeGreaterThan(0);
  });

  it('should respect bed capacity of 1', () => {
    const cats = Array.from({ length: 5 }, (_, i) => createTestCat(`cat${i + 1}`));
    const tree = buildScene(cats, { toys: 0, beds: 5, catTrees: 0 });

    const beds = tree.children.filter(c => c.type === 'bed');
    for (const bed of beds) {
      const catsInBed = bed.children.filter(c => c.type === 'cat');
      expect(catsInBed.length).toBeLessThanOrEqual(1);
    }
  });

  it('should set correct base points for cat tree cats', () => {
    const cats = [
      createTestCat('cat1'),
      createTestCat('cat2'),
      createTestCat('cat3'),
    ];
    const tree = buildScene(cats, { toys: 0, beds: 0, catTrees: 1 });

    const catTree = tree.children.find(c => c.type === 'catTree')!;
    expect(catTree.children[0].basePoint).toEqual(MOUNT_POINTS.catTreePlatforms[0]);
    expect(catTree.children[1].basePoint).toEqual(MOUNT_POINTS.catTreePlatforms[1]);
    expect(catTree.children[2].basePoint).toEqual(MOUNT_POINTS.catTreePlatforms[2]);
  });

  it('should set correct base points for bed cats', () => {
    const cats = [createTestCat('cat1')];
    const tree = buildScene(cats, { toys: 0, beds: 1, catTrees: 0 });

    const bed = tree.children.find(c => c.type === 'bed')!;
    expect(bed.children[0].basePoint).toEqual(MOUNT_POINTS.bed);
  });

  it('should set correct mount point for cat toy mounting', () => {
    const cats = [createTestCat('cat1')];
    const tree = buildScene(cats, { toys: 0, beds: 0, catTrees: 1 });

    const catTree = tree.children.find(c => c.type === 'catTree')!;
    const cat = catTree.children[0];
    expect(cat.mountPoint).toEqual(MOUNT_POINTS.catPaw);
  });

  it('should set room mount point on furniture containers', () => {
    const tree = buildScene([], { toys: 0, beds: 1, catTrees: 1 });

    const catTree = tree.children.find(c => c.type === 'catTree')!;
    const bed = tree.children.find(c => c.type === 'bed')!;

    expect(catTree.basePoint).toEqual(MOUNT_POINTS.roomFloor);
    expect(bed.basePoint).toEqual(MOUNT_POINTS.roomFloor);
  });
});

describe('Hierarchy - getCatSpotType', () => {
  it('should identify cat tree spot', () => {
    const cats = [createTestCat('cat1')];
    const tree = buildScene(cats, { toys: 0, beds: 0, catTrees: 1 });

    const spotType = getCatSpotType(tree, 'cat1');
    expect(spotType).toBe('catTree');
  });

  it('should identify bed spot', () => {
    const cats = Array.from({ length: 4 }, (_, i) => createTestCat(`cat${i + 1}`));
    const tree = buildScene(cats, { toys: 0, beds: 1, catTrees: 1 });

    const spotType = getCatSpotType(tree, 'cat4');
    expect(spotType).toBe('bed');
  });

  it('should identify rug spot', () => {
    const cats = Array.from({ length: 6 }, (_, i) => createTestCat(`cat${i + 1}`));
    const tree = buildScene(cats, { toys: 0, beds: 1, catTrees: 1 });

    const spotType = getCatSpotType(tree, 'cat6');
    expect(spotType).toBe('rug');
  });

  it('should identify floor spot', () => {
    const cats = Array.from({ length: 10 }, (_, i) => createTestCat(`cat${i + 1}`));
    const tree = buildScene(cats, { toys: 0, beds: 1, catTrees: 1 });

    const spotType = getCatSpotType(tree, 'cat10');
    expect(spotType).toBe('room');
  });

  it('should return undefined for non-existent cat', () => {
    const cats = [createTestCat('cat1')];
    const tree = buildScene(cats, { toys: 0, beds: 0, catTrees: 1 });

    const spotType = getCatSpotType(tree, 'non-existent');
    expect(spotType).toBeUndefined();
  });
});

describe('Hierarchy - Cat Positioning', () => {
  it('should position cats with valid world coordinates', () => {
    const cats = [createTestCat('cat1')];
    const tree = buildScene(cats, { toys: 0, beds: 0, catTrees: 1 });

    const catTree = tree.children.find(c => c.type === 'catTree')!;
    const cat = catTree.children[0];

    expect(cat.x).toBeGreaterThanOrEqual(0);
    expect(cat.x).toBeLessThanOrEqual(100);
    expect(cat.y).toBeGreaterThanOrEqual(0);
    expect(cat.y).toBeLessThanOrEqual(100);
  });

  it('should position furniture at base locations', () => {
    const tree = buildScene([], { toys: 0, beds: 1, catTrees: 1 });

    const catTree = tree.children.find(c => c.type === 'catTree')!;
    const bed = tree.children.find(c => c.type === 'bed')!;

    expect(catTree.x).toEqual(BASE_POSITIONS.catTree[0].x);
    expect(catTree.y).toEqual(BASE_POSITIONS.catTree[0].y);

    expect(bed.x).toEqual(BASE_POSITIONS.bed[0].x);
    expect(bed.y).toEqual(BASE_POSITIONS.bed[0].y);
  });
});

describe('Hierarchy - Empty Furniture', () => {
  it('should create empty furniture containers', () => {
    const tree = buildScene([], { toys: 1, beds: 1, catTrees: 1 });

    expect(tree.children.find(c => c.type === 'catTree')).toBeDefined();
    expect(tree.children.find(c => c.type === 'bed')).toBeDefined();
    expect(tree.children.find(c => c.type === 'rug')).toBeDefined();
  });

  it('should create multiple cat trees', () => {
    const tree = buildScene([], { toys: 0, beds: 0, catTrees: 2 });

    const catTrees = tree.children.filter(c => c.type === 'catTree');
    expect(catTrees).toHaveLength(2);
    expect(catTrees[0].index).toBe(0);
    expect(catTrees[1].index).toBe(1);
  });

  it('should create multiple beds', () => {
    const tree = buildScene([], { toys: 0, beds: 3, catTrees: 0 });

    const beds = tree.children.filter(c => c.type === 'bed');
    expect(beds).toHaveLength(3);
    expect(beds[0].index).toBe(0);
    expect(beds[1].index).toBe(1);
    expect(beds[2].index).toBe(2);
  });
});
