/**
 * Returns the input as the output.
 * The identity function is a useful placeholder for instrument functions.
 * @param x Input value.
 * @returns Output value.
 */
export const identity = (x: number): number => x;

/**
 * Clamps an input value to the range [min, max].
 * @param x The input number.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns The clamped result.
 */
export const clamp = (x: number, min: number, max: number): number => Math.max(min, Math.min(max, x));

/**
 * Returns a random number between 0.0 and 1.0.
 * @returns A random number between 0.0 and 1.0
 */
export const unitRandom = (): number => Math.random();

/**
 * Returns a random number between -1.0 and 1.0.
 * @returns A random number between -1.0 and 1.0
 */
export const symmetricRandom = (): number => Math.random() * 2 - 1;

/**
 * Kills an event by preventing default behavior and stopping all propagation.
 * @param e
 */
export const killEvent = (e: Event): void => {
  e.preventDefault();
  e.stopPropagation();
};

/**
 * Returns the linear interpolation between a and b at time t.
 * @param a - start value
 * @param b  - end value
 * @param t - time
 * @returns The linear interpolation between a and b at time t.
 */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Sleeps for the specified time.
 * @param ms - Optional sleep time in milliseconds, defaults to 0.
 * @returns Promise that resolves after the specified time.
 */
export const sleep = (ms = 0): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
