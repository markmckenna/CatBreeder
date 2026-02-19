import { describe, it, expect } from 'vitest';
import {
  SHOP_ITEMS,
  createInitialFurniture,
  calculateCapacity,
  getTotalFurniture,
  calculateHappinessChange,
  getHappinessStatus,
  BASE_CAPACITY,
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
      const furniture = { toys: 3, beds: 0 };
      expect(calculateCapacity(furniture)).toBe(5);
    });

    it('beds add to capacity', () => {
      const furniture = { toys: 0, beds: 2 };
      expect(calculateCapacity(furniture)).toBe(4);
    });

    it('combined furniture adds up', () => {
      const furniture = { toys: 2, beds: 3 };
      // Base 2 + 2 toys + 3 beds = 7
      expect(calculateCapacity(furniture)).toBe(7);
    });
  });

  describe('getTotalFurniture', () => {
    it('counts all furniture items', () => {
      expect(getTotalFurniture({ toys: 0, beds: 0 })).toBe(0);
      expect(getTotalFurniture({ toys: 2, beds: 3 })).toBe(5);
      expect(getTotalFurniture({ toys: 5, beds: 0 })).toBe(5);
    });
  });

  describe('calculateHappinessChange', () => {
    it('returns +5 at optimal capacity', () => {
      const furniture = { toys: 0, beds: 0 }; // capacity = 2
      expect(calculateHappinessChange(2, furniture)).toBe(5);
    });

    it('returns 0 at 25% over capacity', () => {
      const furniture = { toys: 2, beds: 0 }; // capacity = 4
      // 5 cats = 25% over (4 + 4*0.25 = 5)
      expect(calculateHappinessChange(5, furniture)).toBe(0);
    });

    it('returns -5 at 50% over capacity', () => {
      const furniture = { toys: 2, beds: 0 }; // capacity = 4
      // 6 cats = 50% over
      expect(calculateHappinessChange(6, furniture)).toBe(-5);
    });

    it('returns +10 at 25% under capacity', () => {
      const furniture = { toys: 2, beds: 0 }; // capacity = 4
      // 3 cats = 25% under
      expect(calculateHappinessChange(3, furniture)).toBe(10);
    });
  });

  describe('getHappinessStatus', () => {
    it('returns happy status when cats are thriving', () => {
      const furniture = { toys: 0, beds: 0 }; // capacity = 2
      const result = getHappinessStatus(2, furniture); // at optimal
      expect(result.status).toBe('happy');
      expect(result.change).toBe(5);
    });

    it('returns neutral status at slight overcrowding', () => {
      const furniture = { toys: 2, beds: 0 }; // capacity = 4
      const result = getHappinessStatus(5, furniture); // 25% over
      expect(result.status).toBe('neutral');
      expect(result.change).toBe(0);
    });

    it('returns stressed status when heavily overcrowded', () => {
      const furniture = { toys: 0, beds: 0 }; // capacity = 2
      const result = getHappinessStatus(4, furniture); // 100% over
      expect(result.status).toBe('stressed');
      expect(result.change).toBeLessThan(-2);
    });
  });
});
