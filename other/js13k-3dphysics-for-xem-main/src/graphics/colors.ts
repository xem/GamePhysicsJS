import { Vec3 } from '../math/vec3';

/**
 * Creates a little-endian 32-bit color from red, green, and blue components.
 * @param r Red (0-255).
 * @param g Green (0-255).
 * @param b Blue (0-255).
 * @return A 32-bit little-endian color.
 */
export const createColor = (r: number, g: number, b: number): number => {
  return 0xff000000 + (b << 16) + (g << 8) + r;
};

/**
 * Converts a color from HSV format to RGB format.
 *
 * Based on: https://stackoverflow.com/a/17243070/2051724
 *
 * @param h Hue.
 * @param s Saturation.
 * @param v Value.
 * @return A 32-bit little-endian color.
 */
export const createHsvColor = (h: number, s: number, v: number): number => {
  // let r, g, b, i, f, p, q, t;
  const i = (h * 6) | 0;
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r: number;
  let g: number;
  let b: number;
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    default: /* case 5: */
      r = v;
      g = p;
      b = q;
      break;
  }
  return createColor(((r as number) * 255) | 0, ((g as number) * 255) | 0, ((b as number) * 255) | 0);
};

/**
 * Blends two RGB colors.
 * @param r1
 * @param g1
 * @param b1
 * @param r2
 * @param g2
 * @param b2
 * @param f
 * @return A 32-bit little-endian color.
 */
export const blendColors = (
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
  f: number
): number => {
  const f2 = 1.0 - f;
  return createColor((r1 * f2 + r2 * f) | 0, (g1 * f2 + g2 * f) | 0, (b1 * f2 + b2 * f) | 0);
};

/**
 * Blends two RGB colors.
 * @param c1
 * @param c2
 * @param f
 * @return A 32-bit little-endian color.
 */
export const blendColors2 = (c1: Vec3, c2: Vec3, f: number): number => {
  const f2 = 1.0 - f;
  return createColor((c1[0] * f2 + c2[0] * f) | 0, (c1[1] * f2 + c2[1] * f) | 0, (c1[2] * f2 + c2[2] * f) | 0);
};

export const COLOR_BLACK = 0xff333333;

export const COLOR_WHITE = 0xfff0f0f0;
