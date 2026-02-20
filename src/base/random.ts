/**
 * Seeded random number generator for deterministic testing.
 * 
 * Uses a linear congruential generator (LCG) with the same parameters
 * as glibc for predictable, reproducible sequences.
 */

/**
 * Random function interface - returns a number in [0, 1)
 */
export type RandomFn = () => number;

/**
 * Create a seeded random number generator.
 * 
 * The returned function produces deterministic values based on the seed.
 * Each call advances the internal state, producing the next value in sequence.
 * 
 * @param seed - Initial seed value (will be converted to 32-bit integer)
 * @returns A function that returns random numbers in [0, 1)
 * 
 * @example
 * ```ts
 * const rng = createSeededRandom(12345);
 * rng(); // Always returns the same first value for seed 12345
 * rng(); // Always returns the same second value
 * ```
 */
export function createSeededRandom(seed: number): RandomFn {
  // LCG parameters (same as glibc)
  const a = 1103515245;
  const c = 12345;
  const m = 2 ** 31;
  
  let state = Math.abs(Math.floor(seed)) % m;
  
  return () => {
    state = (a * state + c) % m;
    return state / m;
  };
}

/**
 * Default random function using Math.random().
 * Use this when you don't need deterministic behavior.
 */
export const defaultRandom: RandomFn = Math.random;

/**
 * Pick a random item from an array.
 * 
 * @param items - Array to pick from
 * @param random - Random function (defaults to Math.random)
 * @returns A random item from the array
 */
export function pickRandom<T>(items: T[], random: RandomFn = defaultRandom): T {
  return items[Math.floor(random() * items.length)];
}

/**
 * Pick one of two items with 50/50 probability.
 * 
 * @param a - First option
 * @param b - Second option  
 * @param random - Random function (defaults to Math.random)
 * @returns Either a or b
 */
export function coinFlip<T>(a: T, b: T, random: RandomFn = defaultRandom): T {
  return random() < 0.5 ? a : b;
}

/** Generate a random integer in range [min, max] inclusive */
export const randomInt = (min: number, max: number, random: RandomFn = defaultRandom) =>
  Math.floor(random() * (max - min + 1)) + min;

/**
 * Returns a random number from a normal distribution using Box-Muller transform.
 * @param mean - The mean of the distribution (default: 0)
 * @param stdDev - The standard deviation of the distribution (default: 1)
 * @param random - Optional random function
 */
export function normalRandom(mean = 0, stdDev = 1, random: RandomFn = defaultRandom): number {
  // Box-Muller transform
  const u1 = random();
  const u2 = random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}
