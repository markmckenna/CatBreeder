import { describe, it, expect } from 'vitest';
import {
  isCatSelection,
  isFurnitureSelection,
  getSelectableId,
  isSameSelectable,
  type CatSelection,
  type FurnitureSelection,
} from './selection.ts';
import { createMockCat } from './cats/test/helpers.ts';

function createCatSelection(catId: string): CatSelection {
  return {
    type: 'cat',
    cat: createMockCat({ id: catId }),
  };
}

function createFurnitureSelection(type: 'bed' | 'catTree' | 'toy', index: number): FurnitureSelection {
  return {
    type: 'furniture',
    furnitureType: type,
    item: { type, name: type, price: 100, capacityBonus: 1 },
    index,
  };
}

describe('selection', () => {
  describe('isCatSelection', () => {
    it('returns true for cat selections', () => {
      const selection = createCatSelection('cat-1');
      expect(isCatSelection(selection)).toBe(true);
    });

    it('returns false for furniture selections', () => {
      const selection = createFurnitureSelection('bed', 0);
      expect(isCatSelection(selection)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isCatSelection(null)).toBe(false);
    });
  });

  describe('isFurnitureSelection', () => {
    it('returns true for furniture selections', () => {
      const selection = createFurnitureSelection('catTree', 1);
      expect(isFurnitureSelection(selection)).toBe(true);
    });

    it('returns false for cat selections', () => {
      const selection = createCatSelection('cat-1');
      expect(isFurnitureSelection(selection)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isFurnitureSelection(null)).toBe(false);
    });
  });

  describe('getSelectableId', () => {
    it('returns cat ID for cat selections', () => {
      const selection = createCatSelection('whiskers-123');
      expect(getSelectableId(selection)).toBe('cat-whiskers-123');
    });

    it('returns furniture ID for bed selections', () => {
      const selection = createFurnitureSelection('bed', 2);
      expect(getSelectableId(selection)).toBe('furniture-bed-2');
    });

    it('returns furniture ID for cat tree selections', () => {
      const selection = createFurnitureSelection('catTree', 0);
      expect(getSelectableId(selection)).toBe('furniture-catTree-0');
    });

    it('returns furniture ID for toy selections', () => {
      const selection = createFurnitureSelection('toy', 5);
      expect(getSelectableId(selection)).toBe('furniture-toy-5');
    });
  });

  describe('isSameSelectable', () => {
    it('returns true for same cat', () => {
      const a = createCatSelection('cat-1');
      const b = createCatSelection('cat-1');
      expect(isSameSelectable(a, b)).toBe(true);
    });

    it('returns false for different cats', () => {
      const a = createCatSelection('cat-1');
      const b = createCatSelection('cat-2');
      expect(isSameSelectable(a, b)).toBe(false);
    });

    it('returns true for same furniture', () => {
      const a = createFurnitureSelection('bed', 1);
      const b = createFurnitureSelection('bed', 1);
      expect(isSameSelectable(a, b)).toBe(true);
    });

    it('returns false for different furniture indices', () => {
      const a = createFurnitureSelection('bed', 1);
      const b = createFurnitureSelection('bed', 2);
      expect(isSameSelectable(a, b)).toBe(false);
    });

    it('returns false for different furniture types', () => {
      const a = createFurnitureSelection('bed', 0);
      const b = createFurnitureSelection('catTree', 0);
      expect(isSameSelectable(a, b)).toBe(false);
    });

    it('returns false for cat vs furniture', () => {
      const a = createCatSelection('cat-1');
      const b = createFurnitureSelection('bed', 0);
      expect(isSameSelectable(a, b)).toBe(false);
    });

    it('returns false when first is null', () => {
      const b = createCatSelection('cat-1');
      expect(isSameSelectable(null, b)).toBe(false);
    });

    it('returns false when second is null', () => {
      const a = createCatSelection('cat-1');
      expect(isSameSelectable(a, null)).toBe(false);
    });

    it('returns false when both are null', () => {
      expect(isSameSelectable(null, null)).toBe(false);
    });
  });
});
