/** Random function type - returns a number in [0, 1) */
export type RandomFn = () => number;

/** @returns a deterministic RNG seeded by [seed], using glibc's LCG parameters */
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

/** Default random source (Math.random) */
export const defaultRandom: RandomFn = Math.random;

/** @returns a random element from [items] */
export function pickRandom<T>(items: T[], random: RandomFn = defaultRandom): T {
  return items[Math.floor(random() * items.length)];
}

/** @returns either [a] or [b] with equal probability */
export function coinFlip<T>(a: T, b: T, random: RandomFn = defaultRandom): T {
  return random() < 0.5 ? a : b;
}

/** Generate a random integer in range [min, max] inclusive */
export const randomInt = (min: number, max: number, random: RandomFn = defaultRandom) =>
  Math.floor(random() * (max - min + 1)) + min;

/** @returns a random number from a normal distribution (Box-Muller transform) */
export function normalRandom(mean = 0, stdDev = 1, random: RandomFn = defaultRandom): number {
  // Box-Muller transform
  const u1 = random();
  const u2 = random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}
