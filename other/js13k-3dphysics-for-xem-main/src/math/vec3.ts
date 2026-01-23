import { EPSILON } from './constants';
import { Mat4 } from './mat4';
import { Quaternion } from './quat';

// glMatrix - vec3
// https://github.com/toji/gl-matrix

export type Vec3 = Float32Array & { length: 3 };

/**
 * Creates a new, empty vec3
 *
 * @param x X component
 * @param y Y component
 * @param z Z component
 * @returns a new 3D vector
 * @noinline
 */
export const createVec3 = (x = 0, y = 0, z = 0): Vec3 => new Float32Array([x, y, z]) as Vec3;

export const createVec3Array = (n: number): Vec3[] => {
  const a: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    a.push(createVec3());
  }
  return a;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param a vector to clone
 * @returns a new 3D vector
 */
export const cloneVec3 = (a: Vec3): Vec3 => new Float32Array(a) as Vec3;

/**
 * Calculates the magnitude of a vec3
 *
 * @param a vector to calculate length of
 * @returns length of a
 */
export const magnitudeVec3 = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);

export const origin = createVec3();

/**
 * Copy the values from one vec3 to another
 *
 * @param out the receiving vector
 * @param a the source vector
 * @returns out
 */
export const copyVec3 = (out: Vec3, a: Vec3): Vec3 => {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param out the receiving vector
 * @param x X component
 * @param y Y component
 * @param z Z component
 * @returns out
 */
export const setVec3 = (out: Vec3, x: number, y: number, z: number): Vec3 => {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
};

/**
 * Adds two vec3's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const addVec3 = (out: Vec3, a: Vec3, b: Vec3): Vec3 => {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
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
export const subtractVec3 = (out: Vec3, a: Vec3, b: Vec3): Vec3 => {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
};

/**
 * Multiplies two vec3's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const multiplyVec3 = (out: Vec3, a: Vec3, b: Vec3): Vec3 => {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
};

/**
 * Divides two vec3's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const divideVec3 = (out: Vec3, a: Vec3, b: Vec3): Vec3 => {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
};

/**
 * Math.ceil the components of a vec3
 *
 * @param out the receiving vector
 * @param a vector to ceil
 * @returns out
 */
export const ceilVec3 = (out: Vec3, a: Vec3): Vec3 => {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
};

/**
 * Returns the minimum of two vec3's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const minVec3 = (out: Vec3, a: Vec3, b: Vec3): Vec3 => {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const maxVec3 = (out: Vec3, a: Vec3, b: Vec3): Vec3 => {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param out the receiving vector
 * @param a the vector to scale
 * @param b amount to scale the vector by
 * @returns out
 */
export const scaleVec3 = (out: Vec3, a: Vec3, b: number): Vec3 => {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @param scale the amount to scale b by before adding
 * @returns out
 */
export const scaleAndAddVec3 = (out: Vec3, a: Vec3, b: Vec3, scale: number): Vec3 => {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param a the first operand
 * @param b the second operand
 * @returns distance between a and b
 */
export const distanceVec3 = (a: Vec3, b: Vec3): number => {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  const z = b[2] - a[2];
  return Math.hypot(x, y, z);
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param a the first operand
 * @param b the second operand
 * @returns distance between a and b
 */
export const distanceVec3IgnoreY = (a: Vec3, b: Vec3): number => {
  const x = b[0] - a[0];
  const z = b[2] - a[2];
  return Math.hypot(x, z);
};

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param a the first operand
 * @param b the second operand
 * @returns squared distance between a and b
 */
export const squaredDistanceVec3 = (a: Vec3, b: Vec3): number => {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  const z = b[2] - a[2];
  return x * x + y * y + z * z;
};

/**
 * Calculates the squared length of a vec3
 *
 * @param a vector to calculate squared length of
 * @returns squared length of a
 */
export const squaredLengthVec3 = (a: Vec3): number => {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  return x * x + y * y + z * z;
};

/**
 * Negates the components of a vec3
 *
 * @param out the receiving vector
 * @param a vector to negate
 * @returns out
 */
export const negateVec3 = (out: Vec3, a: Vec3): Vec3 => {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param out the receiving vector
 * @param a vector to invert
 * @returns out
 */
export const inverseVec3 = (out: Vec3, a: Vec3): Vec3 => {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param out the receiving vector
 * @param a vector to normalize
 * @returns out
 */
export const normalizeVec3 = (out: Vec3, a: Vec3): Vec3 => {
  const len = magnitudeVec3(a);
  return len > 0 ? scaleVec3(out, a, 1 / len) : copyVec3(out, a);
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param a the first operand
 * @param b the second operand
 * @returns dot product of a and b
 */
export const dotVec3 = (a: Vec3, b: Vec3): number => {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const crossVec3 = (out: Vec3, a: Vec3, b: Vec3): Vec3 => {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const bx = b[0];
  const by = b[1];
  const bz = b[2];

  // Right-handed:
  // out[0] = ay * bz - az * by;
  // out[1] = az * bx - ax * bz;
  // out[2] = ax * by - ay * bx;

  // Left-handed:
  out[0] = az * by - ay * bz;
  out[1] = ax * bz - az * bx;
  out[2] = ay * bx - ax * by;

  return out;
};

/**
 * Computes the cross product of two vec3's
 *
 * @param out the receiving vector
 * @param origin the relative origin point for a and b
 * @param a the first operand
 * @param b the second operand
 * @returns out
 */
export const cross2Vec3 = (out: Vec3, origin: Vec3, a: Vec3, b: Vec3): Vec3 => {
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
 * Performs a linear interpolation between two vec3's
 *
 * @param out the receiving vector
 * @param a the first operand
 * @param x The x component of the b vector
 * @param y The y component of the b vector
 * @param z The z component of the b vector
 * @param t interpolation amount, in the range [0-1], between the two inputs
 * @returns out
 */
export const lerpVec3 = (out: Vec3, a: Vec3, x: number, y: number, z: number, t: number): Vec3 => {
  out[0] = a[0] + t * (x - a[0]);
  out[1] = a[1] + t * (y - a[1]);
  out[2] = a[2] + t * (z - a[2]);
  return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param out the receiving vector
 * @param a the vector to transform
 * @param m matrix to transform with
 * @returns out
 */
export const transformMat4Vec3 = (out: Vec3, a: Vec3, m: Mat4): Vec3 => {
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
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param out the receiving vector
 * @param a the vector to transform
 * @param q quaternion to transform with
 * @returns out
 */
export const transformQuatVec3 = (out: Vec3, a: Vec3, q: Quaternion): Vec3 => {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  const qx = q[0];
  const qy = q[1];
  const qz = q[2];
  const qw = q[3];
  const x = a[0];
  const y = a[1];
  const z = a[2];
  // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);
  let uvx = qy * z - qz * y;
  let uvy = qz * x - qx * z;
  let uvz = qx * y - qy * x;
  // var uuv = vec3.cross([], qvec, uv);
  let uuvx = qy * uvz - qz * uvy;
  let uuvy = qz * uvx - qx * uvz;
  let uuvz = qx * uvy - qy * uvx;
  // vec3.scale(uv, uv, 2 * w);
  const w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  // vec3.scale(uuv, uuv, 2);
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  // return vec3.add(out, a, vec3.add(out, uv, uuv));
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param out The receiving vec3
 * @param a The vec3 point to rotate
 * @param b The origin of the rotation
 * @param c The angle of rotation
 * @returns out
 */
export const rotateXVec3 = (out: Vec3, a: Vec3, b: Vec3, c: number): Vec3 => {
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
 * @param out The receiving vec3
 * @param a The vec3 point to rotate
 * @param b The origin of the rotation
 * @param c The angle of rotation
 * @returns out
 */
export const rotateYVec3 = (out: Vec3, a: Vec3, b: Vec3, c: number): Vec3 => {
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
 * @param out The receiving vec3
 * @param a The vec3 point to rotate
 * @param b The origin of the rotation
 * @param c The angle of rotation
 * @returns out
 */
export const rotateZVec3 = (out: Vec3, a: Vec3, b: Vec3, c: number): Vec3 => {
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
export const strVec3 = (a: Vec3): string => {
  return `vec3(${a[0].toFixed(4)}, ${a[1].toFixed(4)}, ${a[2].toFixed(4)})`;
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param a The first vector.
 * @param b The second vector.
 * @returns True if the vectors are equal, false otherwise.
 */
export const exactEqualsVec3 = (a: Vec3, b: Vec3): boolean => {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param a The first vector.
 * @param b The second vector.
 * @returns True if the vectors are equal, false otherwise.
 */
export const equalsVec3 = (a: Vec3, b: Vec3): boolean => {
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

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param a The first vector.
 * @param b The second vector.
 * @returns True if all components of a are less than or equal to all components of b, false otherwise.
 */
export const lessThanOrEqualsVec3 = (a: Vec3, b: Vec3): boolean => a[0] <= b[0] && a[1] <= b[1] && a[2] <= b[2];
