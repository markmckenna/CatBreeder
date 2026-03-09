/**
 * Public API for random number generation utilities.
 * 
 * This module exports seeded and default random functions.
 */

export type { RandomFn } from './random.ts';
export { createSeededRandom, defaultRandom, pickRandom, coinFlip, randomInt, normalRandom } from './random.ts';
