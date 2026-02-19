import { describe, it, expect } from 'vitest';
import {
  createSeededRandom,
  defaultRandom,
  pickRandom,
  coinFlip,
  randomInt,
} from './random.ts';

describe('random utilities', () => {
  describe('createSeededRandom', () => {
    it('returns deterministic values for the same seed', () => {
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(12345);
      
      const values1 = [rng1(), rng1(), rng1(), rng1(), rng1()];
      const values2 = [rng2(), rng2(), rng2(), rng2(), rng2()];
      
      expect(values1).toEqual(values2);
    });

    it('returns different values for different seeds', () => {
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(54321);
      
      expect(rng1()).not.toBe(rng2());
    });

    it('returns values in [0, 1) range', () => {
      const rng = createSeededRandom(42);
      
      for (let i = 0; i < 100; i++) {
        const value = rng();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('produces a uniform distribution over many samples', () => {
      const rng = createSeededRandom(999);
      const buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 10 buckets
      const samples = 10000;
      
      for (let i = 0; i < samples; i++) {
        const value = rng();
        const bucket = Math.floor(value * 10);
        buckets[bucket]++;
      }
      
      // Each bucket should have ~1000 samples (10% of total)
      // Allow 20% variance
      for (const count of buckets) {
        expect(count).toBeGreaterThan(800);
        expect(count).toBeLessThan(1200);
      }
    });

    it('handles negative seeds', () => {
      const rng = createSeededRandom(-12345);
      expect(rng()).toBeGreaterThanOrEqual(0);
      expect(rng()).toBeLessThan(1);
    });

    it('handles floating point seeds by truncating', () => {
      const rng1 = createSeededRandom(12345.6789);
      const rng2 = createSeededRandom(12345);
      
      expect(rng1()).toBe(rng2());
    });
  });

  describe('defaultRandom', () => {
    it('returns values in [0, 1) range', () => {
      for (let i = 0; i < 100; i++) {
        const value = defaultRandom();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });
  });

  describe('pickRandom', () => {
    it('picks items from array', () => {
      const items = ['a', 'b', 'c'];
      const rng = createSeededRandom(42);
      
      const picked = pickRandom(items, rng);
      expect(items).toContain(picked);
    });

    it('returns deterministic result with seeded random', () => {
      const items = [1, 2, 3, 4, 5];
      
      const rng1 = createSeededRandom(123);
      const rng2 = createSeededRandom(123);
      
      expect(pickRandom(items, rng1)).toBe(pickRandom(items, rng2));
    });

    it('picks all items over many samples', () => {
      const items = ['a', 'b', 'c'];
      const rng = createSeededRandom(42);
      const picked = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        picked.add(pickRandom(items, rng));
      }
      
      expect(picked.size).toBe(3);
    });
  });

  describe('coinFlip', () => {
    it('returns one of two options', () => {
      const rng = createSeededRandom(42);
      
      const result = coinFlip('heads', 'tails', rng);
      expect(['heads', 'tails']).toContain(result);
    });

    it('is deterministic with seeded random', () => {
      const rng1 = createSeededRandom(123);
      const rng2 = createSeededRandom(123);
      
      expect(coinFlip('a', 'b', rng1)).toBe(coinFlip('a', 'b', rng2));
    });

    it('produces approximately 50/50 distribution', () => {
      const rng = createSeededRandom(999);
      let heads = 0;
      const trials = 10000;
      
      for (let i = 0; i < trials; i++) {
        if (coinFlip('heads', 'tails', rng) === 'heads') {
          heads++;
        }
      }
      
      // Should be close to 50% (allow 5% variance)
      const ratio = heads / trials;
      expect(ratio).toBeGreaterThan(0.45);
      expect(ratio).toBeLessThan(0.55);
    });
  });

  describe('randomInt', () => {
    it('returns integers in range', () => {
      const rng = createSeededRandom(42);
      
      for (let i = 0; i < 100; i++) {
        const value = randomInt(1, 10, rng);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(10);
        expect(Number.isInteger(value)).toBe(true);
      }
    });

    it('is deterministic with seeded random', () => {
      const rng1 = createSeededRandom(123);
      const rng2 = createSeededRandom(123);
      
      expect(randomInt(1, 100, rng1)).toBe(randomInt(1, 100, rng2));
    });

    it('produces all values in range', () => {
      const rng = createSeededRandom(42);
      const seen = new Set<number>();
      
      for (let i = 0; i < 1000; i++) {
        seen.add(randomInt(1, 6, rng));
      }
      
      expect(seen.size).toBe(6); // All dice values 1-6
    });
  });
});
