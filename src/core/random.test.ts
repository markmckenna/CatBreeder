import { describe, it, expect } from 'vitest';
import { createSeededRandom } from './random.ts';

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
			createSeededRandom(-12345);
		});
	});
});
