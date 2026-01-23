import { EPSILON } from './constants';
import { Mat4 } from './mat4';

// glMatrix - vec4
// https://github.com/toji/gl-matrix

export type Vec4 = Float32Array & { length: 4 };

/**
 * Creates a new, empty vec4
 *
 * @returns a new 3D vector
 */
export const createVec4 = (): Vec4 => new Float32Array(4) as Vec4;

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param a vector to clone
 * @returns a new 3D vector
 */
export const cloneVec4 = (a: Vec4): Vec4 => new Float32Array(a) as Vec4;

/**
 * Calculates the magnitude of a vec4
 *
 * @param a vector to calculate length of
 * @returns length of a
 */
export const magnitudeVec4 = (a: Vec4): number => Math.hypot(a[0], a[1], a[2], a[3]);

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param x X component
 * @param y Y component
 * @param z Z component
 * @returns a new 3D vector
 * @noinline
 */
export const fromValuesVec4 = (x: number, y: number, z: number): Vec4 => new Float32Array([x, y, z]) as Vec4;

export const origin = createVec4();

/**
 * Copy the values from one vec4 to another
 *
 * @param out the receiving vector
 * @param a the source vector
 * @returns out
 */
export const copyVec4 = (out: Vec4, a: Vec4): Vec4 => {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param out the receiving vector
 * @param x X component
 * @param y Y component
 * @param z Z component
 * @param w W component
 * @returns out
 */
export const setVec4 = (out: Vec4, x: number, y: number, z: number, w = 0): Vec4 => {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
};

/**
 * Adds two vec4's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const addVec4 = (out: Vec4, a: Vec4, b: Vec4): Vec4 => {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const subtractVec4 = (out: Vec4, a: Vec4, b: Vec4): Vec4 => {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
};

/**
 * Multiplies two vec4's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const multiplyVec4 = (out: Vec4, a: Vec4, b: Vec4): Vec4 => {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
};

/**
 * Divides two vec4's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const divideVec4 = (out: Vec4, a: Vec4, b: Vec4): Vec4 => {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
};

/**
 * Math.ceil the components of a vec4
 *
 * @param out the receiving vector
 * @param a vector to ceil
 * @returns out
 */
export const ceilVec4 = (out: Vec4, a: Vec4): Vec4 => {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
};

/**
 * Returns the minimum of two vec4's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const minVec4 = (out: Vec4, a: Vec4, b: Vec4): Vec4 => {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const maxVec4 = (out: Vec4, a: Vec4, b: Vec4): Vec4 => {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param out the receiving vector
 * @param a the vector to scale
 * @param b amount to scale the vector by
 * @returns out
 */
export const scaleVec4 = (out: Vec4, a: Vec4, b: number): Vec4 => {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @param scale the amount to scale b by before adding
 * @returns out
 */
export const scaleAndAddVec4 = (out: Vec4, a: Vec4, b: Vec4, scale: number): Vec4 => {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param a the first operand
 * @param b the second operand
 * @returns distance between a and b
 */
export const distanceVec4 = (a: Vec4, b: Vec4): number => {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  const z = b[2] - a[2];
  return Math.hypot(x, y, z);
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param a the first operand
 * @param b the second operand
 * @returns distance between a and b
 */
export const distanceVec4IgnoreY = (a: Vec4, b: Vec4): number => {
  const x = b[0] - a[0];
  const z = b[2] - a[2];
  return Math.hypot(x, z);
};

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param a the first operand
 * @param b the second operand
 * @returns squared distance between a and b
 */
export const squaredDistanceVec4 = (a: Vec4, b: Vec4): number => {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  const z = b[2] - a[2];
  return x * x + y * y + z * z;
};

/**
 * Calculates the squared length of a vec4
 *
 * @param a vector to calculate squared length of
 * @returns squared length of a
 */
export const squaredLengthVec4 = (a: Vec4): number => {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  return x * x + y * y + z * z;
};

/**
 * Negates the components of a vec4
 *
 * @param out the receiving vector
 * @param a vector to negate
 * @returns out
 */
export const negateVec4 = (out: Vec4, a: Vec4): Vec4 => {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param out the receiving vector
 * @param a vector to invert
 * @returns out
 */
export const inverseVec4 = (out: Vec4, a: Vec4): Vec4 => {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param out the receiving vector
 * @param a vector to normalize
 * @returns out
 */
export const normalizeVec4 = (out: Vec4, a: Vec4): Vec4 => {
  const len = magnitudeVec4(a);
  return len > 0 ? scaleVec4(out, a, 1 / len) : copyVec4(out, a);
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param a the first operand
 * @param b the second operand
 * @returns dot product of a and b
 */
export const dotVec4 = (a: Vec4, b: Vec4): number => {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec4's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const crossVec4 = (out: Vec4, a: Vec4, b: Vec4): Vec4 => {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const bx = b[0];
  const by = b[1];
  const bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
};

/**
 * Computes the cross product of two vec4's
 *
 * @param out the receiving vector
 * @param origin the relative origin point for a and b
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const cross2Vec4 = (out: Vec4, origin: Vec4, a: Vec4, b: Vec4): Vec4 => {
  const ax = a[0] - origin[0];
  const ay = a[1] - origin[1];
  const az = a[2] - origin[2];
  const bx = b[0] - origin[0];
  const by = b[1] - origin[1];
  const bz = b[2] - origin[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param x The x component of the b vector
 * @param y The y component of the b vector
 * @param z The z component of the b vector
 * @param t interpolation amount, in the range [0-1], between the two inputs
 * @returns out
 */
export const lerpVec4 = (out: Vec4, a: Vec4, x: number, y: number, z: number, t: number): Vec4 => {
  out[0] = a[0] + t * (x - a[0]);
  out[1] = a[1] + t * (y - a[1]);
  out[2] = a[2] + t * (z - a[2]);
  return out;
};

/**
 * Transforms the vec4 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param out the receiving vector
 * @param a the vector to transform
 * @param m matrix to transform with
 * @returns out
 */
export const transformMat4Vec4 = (out: Vec4, a: Vec4, m: Mat4): Vec4 => {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param out The receiving vec4
 * @param a The vec4 point to rotate
 * @param b The origin of the rotation
 * @param c The angle of rotation
 * @returns out
 */
export const rotateXVec4 = (out: Vec4, a: Vec4, b: Vec4, c: number): Vec4 => {
  const p = [];
  const r = [];
  // Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  // perform rotation
  r[0] = p[0];
  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);

  // translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param out The receiving vec4
 * @param a The vec4 point to rotate
 * @param b The origin of the rotation
 * @param c The angle of rotation
 * @returns out
 */
export const rotateYVec4 = (out: Vec4, a: Vec4, b: Vec4, c: number): Vec4 => {
  const p = [];
  const r = [];
  // Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  // perform rotation
  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);

  // translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param out The receiving vec4
 * @param a The vec4 point to rotate
 * @param b The origin of the rotation
 * @param c The angle of rotation
 * @returns out
 */
export const rotateZVec4 = (out: Vec4, a: Vec4, b: Vec4, c: number): Vec4 => {
  const p = [];
  const r = [];
  // Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  // perform rotation
  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
  r[2] = p[2];

  // translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
};

/**
 * Returns a string representation of a vector
 *
 * @param a vector to represent as a string
 * @returns string representation of the vector
 */
export const strVec4 = (a: Vec4): string => {
  return `vec4(${a[0].toFixed(4)}, ${a[1].toFixed(4)}, ${a[2].toFixed(4)}, ${a[3].toFixed(4)})`;
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param a The first vector.
 * @param b The second vector.
 * @returns True if the vectors are equal, false otherwise.
 */
export const exactEqualsVec4 = (a: Vec4, b: Vec4): boolean => {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param a The first vector.
 * @param b The second vector.
 * @returns True if the vectors are equal, false otherwise.
 */
export const equalsVec4 = (a: Vec4, b: Vec4): boolean => {
  const a0 = a[0];
  const a1 = a[1];
  const a2 = a[2];
  const b0 = b[0];
  const b1 = b[1];
  const b2 = b[2];
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2))
  );
};
