import { describe, it, expect } from 'vitest';
import {
  SHOP_ITEMS,
  createInitialFurniture,
  calculateCapacity,
  getTotalFurniture,
  getHappinessStatus,
  BASE_CAPACITY,
  HAPPINESS_RULES,
} from './furniture.ts';

describe('furniture system', () => {
  describe('SHOP_ITEMS', () => {
    it('has toy item at $50', () => {
      expect(SHOP_ITEMS.toy.price).toBe(50);
      expect(SHOP_ITEMS.toy.name).toBe('Cat Toy');
      expect(SHOP_ITEMS.toy.capacityBonus).toBe(1);
    });

    it('has bed item at $100', () => {
      expect(SHOP_ITEMS.bed.price).toBe(100);
      expect(SHOP_ITEMS.bed.name).toBe('Cat Bed');
      expect(SHOP_ITEMS.bed.capacityBonus).toBe(1);
    });
  });

  describe('createInitialFurniture', () => {
    it('starts with no furniture', () => {
      const furniture = createInitialFurniture();
      expect(furniture.toys).toBe(0);
      expect(furniture.beds).toBe(0);
    });
  });

  describe('calculateCapacity', () => {
    it('base capacity is 2 with no furniture', () => {
      expect(BASE_CAPACITY).toBe(2);
      const furniture = createInitialFurniture();
      expect(calculateCapacity(furniture)).toBe(2);
    });

    it('toys add to capacity', () => {
      const furniture = { toys: 3, beds: 0, catTrees: 0 };
      expect(calculateCapacity(furniture)).toBe(5);
    });

    it('beds add to capacity', () => {
      const furniture = { toys: 0, beds: 2, catTrees: 0 };
      expect(calculateCapacity(furniture)).toBe(4);
    });

    it('combined furniture adds up', () => {
      const furniture = { toys: 2, beds: 3, catTrees: 0 };
      // Base 2 + 2 toys + 3 beds = 7
      expect(calculateCapacity(furniture)).toBe(7);
    });
  });

  describe('getTotalFurniture', () => {
    it('counts all furniture items', () => {
      expect(getTotalFurniture({ toys: 0, beds: 0, catTrees: 0 })).toBe(0);
      expect(getTotalFurniture({ toys: 2, beds: 3, catTrees: 0 })).toBe(5);
      expect(getTotalFurniture({ toys: 5, beds: 0, catTrees: 0 })).toBe(5);
    });
  });

  describe('HAPPINESS_RULES', () => {
    it('defines base daily decay', () => {
      expect(HAPPINESS_RULES.BASE_DECAY).toBe(-5);
    });

    it('defines toy bonus', () => {
      expect(HAPPINESS_RULES.TOY_BONUS).toBe(5);
    });

    it('defines bed bonus', () => {
      expect(HAPPINESS_RULES.BED_BONUS).toBe(8);
    });

    it('defines no comfort penalty', () => {
      expect(HAPPINESS_RULES.NO_COMFORT_PENALTY).toBe(-5);
    });

    it('defines alone penalty', () => {
      expect(HAPPINESS_RULES.ALONE_PENALTY).toBe(-5);
    });

    it('defines overcrowd penalty per cat', () => {
      expect(HAPPINESS_RULES.OVERCROWD_PENALTY_PER_CAT).toBe(-1);
    });
  });

  describe('getHappinessStatus', () => {
    it('returns happy status when cats have comfort items and company', () => {
      const furniture = { toys: 1, beds: 1, catTrees: 0 }; // capacity = 4
      const result = getHappinessStatus(2, furniture);
      expect(result.status).toBe('happy');
    });

    it('returns neutral status when no comfort items', () => {
      const furniture = { toys: 0, beds: 0, catTrees: 0 }; // capacity = 2
      const result = getHappinessStatus(2, furniture);
      expect(result.status).toBe('neutral');
    });

    it('returns stressed status when overcrowded', () => {
      const furniture = { toys: 0, beds: 0, catTrees: 0 }; // capacity = 2
      const result = getHappinessStatus(4, furniture); // over capacity
      expect(result.status).toBe('stressed');
    });
  });
});
