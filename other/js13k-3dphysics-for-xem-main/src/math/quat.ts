// glMatrix - quat
// https://github.com/toji/gl-matrix

import { DEBUG } from '../debug';
import { EPSILON } from './constants';
import { Vec3 } from './vec3';
import { Vec4, dotVec4, scaleVec4 } from './vec4';

export type Quaternion = Float32Array & { length: 4 };

/**
 * Creates a new, empty quat.
 *
 * @param x X component
 * @param y Y component
 * @param z Z component
 * @param w W component
 * @returns a new Quaternion
 * @noinline
 */
export const createQuaternion = (x = 0, y = 0, z = 0, w = 1): Quaternion =>
  new Float32Array([x, y, z, w]) as Quaternion;

/**
 * Calculates the magnitude of a vec3
 *
 * @param a vector to calculate length of
 * @returns length of a
 */
export const magnitudeQuat = (a: Quaternion): number => Math.hypot(a[0], a[1], a[2], a[3]);

/**
 * Copy the values from one vec3 to another
 *
 * @param out the receiving vector
 * @param a the source vector
 * @returns out
 */
export const copyQuat = (out: Quaternion, a: Quaternion): Quaternion => {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
};

/**
 * Set a quat to the identity quaternion
 *
 * @param out the receiving quaternion
 * @return out
 */
export const identityQuat = (out: Quaternion): Quaternion => {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param out the receiving quaternion
 * @param axis the axis around which to rotate
 * @param rad the angle in radians
 * @return out
 **/
export const setAxisAngleQuat = (out: Quaternion, axis: Vec3, rad: number): Quaternion => {
  rad = rad * 0.5;
  const s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
};

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param out_axis  Vector receiving the axis of rotation
 * @param q     Quaternion to be decomposed
 * @return     Angle, in radians, of the rotation
 */
export const getAxisAngleQuat = (out_axis: Vec3, q: Quaternion): number => {
  const rad = Math.acos(q[3]) * 2.0;
  const s = Math.sin(rad / 2.0);
  if (s > EPSILON) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
};

/**
 * Gets the angular distance between two unit quaternions
 *
 * @param a     Origin unit quaternion
 * @param b     Destination unit quaternion
 * @return     Angle, in radians, between the two quaternions
 */
export const getAngleQuat = (a: Quaternion, b: Quaternion): number => {
  const dotproduct = dotVec4(a as Vec4, b as Vec4);

  return Math.acos(2 * dotproduct * dotproduct - 1);
};

/**
 * Multiplies two quat's
 *
 * @param out the receiving quaternion
 * @param a the first operand
 * @param b the second operand
 * @return out
 */
export const multiplyQuat = (out: Quaternion, a: Quaternion, b: Quaternion): Quaternion => {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  const bx = b[0];
  const by = b[1];
  const bz = b[2];
  const bw = b[3];

  // Right-handed
  // out[0] = ax * bw + aw * bx + ay * bz - az * by;
  // out[1] = ay * bw + aw * by + az * bx - ax * bz;
  // out[2] = az * bw + aw * bz + ax * by - ay * bx;
  // out[3] = aw * bw - ax * bx - ay * by - az * bz;

  // Left-handed
  out[0] = ax * bw + aw * bx - ay * bz + az * by; // Changed sign
  out[1] = ay * bw + aw * by - az * bx + ax * bz; // Changed sign
  out[2] = az * bw + aw * bz - ax * by + ay * bx; // Changed sign
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
};

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param out quat receiving operation result
 * @param a quat to rotate
 * @param rad angle (in radians) to rotate
 * @return out
 */
export const rotateXQuat = (out: Quaternion, a: Quaternion, rad: number): Quaternion => {
  rad *= 0.5;

  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  const bx = Math.sin(rad);
  const bw = Math.cos(rad);

  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param out quat receiving operation result
 * @param a quat to rotate
 * @param rad angle (in radians) to rotate
 * @return out
 */
export const rotateYQuat = (out: Quaternion, a: Quaternion, rad: number): Quaternion => {
  rad *= 0.5;

  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  const by = Math.sin(rad);
  const bw = Math.cos(rad);

  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param out quat receiving operation result
 * @param a quat to rotate
 * @param rad angle (in radians) to rotate
 * @return out
 */
export const rotateZQuat = (out: Quaternion, a: Quaternion, rad: number): Quaternion => {
  rad *= 0.5;

  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  const bz = Math.sin(rad);
  const bw = Math.cos(rad);

  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param out the receiving quaternion
 * @param a quat to calculate W component of
 * @return out
 */
export const calculateWQuat = (out: Quaternion, a: Quaternion): Quaternion => {
  const x = a[0];
  const y = a[1];
  const z = a[2];

  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
};

/**
 * Calculate the exponential of a unit quaternion.
 *
 * @param out the receiving quaternion
 * @param a quat to calculate the exponential of
 * @return out
 */
export const expQuat = (out: Quaternion, a: Quaternion): Quaternion => {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  const w = a[3];

  const r = Math.sqrt(x * x + y * y + z * z);
  const et = Math.exp(w);
  const s = r > 0 ? (et * Math.sin(r)) / r : 0;

  out[0] = x * s;
  out[1] = y * s;
  out[2] = z * s;
  out[3] = et * Math.cos(r);

  return out;
};

/**
 * Calculate the natural logarithm of a unit quaternion.
 *
 * @param out the receiving quaternion
 * @param a quat to calculate the exponential of
 * @return out
 */
export const lnQuat = (out: Quaternion, a: Quaternion): Quaternion => {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  const w = a[3];

  const r = Math.sqrt(x * x + y * y + z * z);
  const t = r > 0 ? Math.atan2(r, w) / r : 0;

  out[0] = x * t;
  out[1] = y * t;
  out[2] = z * t;
  out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);

  return out;
};

/**
 * Calculate the scalar power of a unit quaternion.
 *
 * @param out the receiving quaternion
 * @param a quat to calculate the exponential of
 * @param b amount to scale the quaternion by
 * @return out
 */
export const powQuat = (out: Quaternion, a: Quaternion, b: number): Quaternion => {
  lnQuat(out, a);
  scaleVec4(out, out, b);
  expQuat(out, out);
  return out;
};

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param out the receiving quaternion
 * @param a the first operand
 * @param b the second operand
 * @param t interpolation amount, in the range [0-1], between the two inputs
 * @return out
 */
export const slerpQuat = (out: Quaternion, a: Quaternion, b: Quaternion, t: number): Quaternion => {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  let bx = b[0];
  let by = b[1];
  let bz = b[2];
  let bw = b[3];

  let omega: number;
  let cosom: number;
  let sinom: number;
  let scale0: number;
  let scale1: number;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  // calculate coefficients
  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param out the receiving quaternion
 * @param a quat to calculate inverse of
 * @return out
 */
export const invertQuat = (out: Quaternion, a: Quaternion): Quaternion => {
  const a0 = a[0];
  const a1 = a[1];
  const a2 = a[2];
  const a3 = a[3];
  const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  const invDot = dot ? 1.0 / dot : 0;

  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param out the receiving quaternion
 * @param a quat to calculate conjugate of
 * @return out
 */
export const conjugateQuat = (out: Quaternion, a: Quaternion): Quaternion => {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
};

/**
 * Creates a quaternion from the given euler angle x, y, z using the provided intrinsic order for the conversion.
 *
 * @param out the receiving quaternion
 * @param x Angle to rotate around X axis in degrees.
 * @param y Angle to rotate around Y axis in degrees.
 * @param z Angle to rotate around Z axis in degrees.
 * @param order Intrinsic order for conversion, default is zyx.
 * @return out
 * @function
 */
export const fromEulerQuat = (out: Quaternion, x: number, y: number, z: number, order = 'zyx'): Quaternion => {
  const halfToRad = Math.PI / 360;
  x *= halfToRad;
  z *= halfToRad;
  y *= halfToRad;

  const sx = Math.sin(x);
  const cx = Math.cos(x);
  const sy = Math.sin(y);
  const cy = Math.cos(y);
  const sz = Math.sin(z);
  const cz = Math.cos(z);

  switch (order) {
    case 'xyz':
      out[0] = sx * cy * cz + cx * sy * sz;
      out[1] = cx * sy * cz - sx * cy * sz;
      out[2] = cx * cy * sz + sx * sy * cz;
      out[3] = cx * cy * cz - sx * sy * sz;
      break;

    case 'xzy':
      out[0] = sx * cy * cz - cx * sy * sz;
      out[1] = cx * sy * cz - sx * cy * sz;
      out[2] = cx * cy * sz + sx * sy * cz;
      out[3] = cx * cy * cz + sx * sy * sz;
      break;

    case 'yxz':
      out[0] = sx * cy * cz + cx * sy * sz;
      out[1] = cx * sy * cz - sx * cy * sz;
      out[2] = cx * cy * sz - sx * sy * cz;
      out[3] = cx * cy * cz + sx * sy * sz;
      break;

    case 'yzx':
      out[0] = sx * cy * cz + cx * sy * sz;
      out[1] = cx * sy * cz + sx * cy * sz;
      out[2] = cx * cy * sz - sx * sy * cz;
      out[3] = cx * cy * cz - sx * sy * sz;
      break;

    case 'zxy':
      out[0] = sx * cy * cz - cx * sy * sz;
      out[1] = cx * sy * cz + sx * cy * sz;
      out[2] = cx * cy * sz + sx * sy * cz;
      out[3] = cx * cy * cz - sx * sy * sz;
      break;

    case 'zyx':
      out[0] = sx * cy * cz - cx * sy * sz;
      out[1] = cx * sy * cz + sx * cy * sz;
      out[2] = cx * cy * sz - sx * sy * cz;
      out[3] = cx * cy * cz + sx * sy * sz;
      break;

    default:
      if (DEBUG) {
        throw new Error(`Unknown angle order ${order}`);
      }
  }

  return out;
};

/**
 * Returns a string representation of a quaternion
 *
 * @param a vector to represent as a string
 * @return string representation of the vector
 */
export const strQuat = (a: Quaternion): string => {
  return `quat(${a[0]}, ${a[1]}, ${a[2]}, ${a[3]})`;
};

/**
 * Scales a quat by a scalar number
 *
 * @param out the receiving quat
 * @param a the quat to scale
 * @param b amount to scale the quat by
 * @returns out
 */
export const scaleQuat = (out: Quaternion, a: Quaternion, b: number): Quaternion => {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
};

/**
 * Normalize a quat
 *
 * @param out the receiving quat
 * @param a quat to normalize
 * @returns out
 */
export const normalizeQuat = (out: Quaternion, a: Quaternion): Quaternion => {
  const len = magnitudeQuat(a);
  return len > 0 ? scaleQuat(out, a, 1 / len) : copyQuat(out, a);
};

/**
 * Returns an euler angle representation of a quaternion
 * Original return value: Euler angles, pitch-yaw-roll
 * @param quat - the quaternion to create an euler from
 * @return The euler angles in radians
 */
export const getYawFromQuat = (quat: Quaternion): number => {
  const x = quat[0];
  const y = quat[1];
  const z = quat[2];
  const w = quat[3];
  const x2 = x * x;
  const y2 = y * y;
  const z2 = z * z;
  const w2 = w * w;
  const unit = x2 + y2 + z2 + w2;
  const test = x * w - y * z;
  if (test > 0.499995 * unit) {
    //TODO: Use glmatrix.EPSILON
    // singularity at the north pole
    // out[0] = Math.PI / 2;
    return 2 * Math.atan2(y, x);
    // out[2] = 0;
  }
  if (test < -0.499995 * unit) {
    //TODO: Use glmatrix.EPSILON
    // singularity at the south pole
    // out[0] = -Math.PI / 2;
    return 2 * Math.atan2(y, x);
    // out[2] = 0;
  }
  // out[0] = Math.asin(2 * (x * z - w * y));
  return Math.atan2(2 * (x * w + y * z), 1 - 2 * (z2 + w2));
  // out[2] = Math.atan2(2 * (x * y + z * w), 1 - 2 * (y2 + z2));
  // TODO: Return them as degrees and not as radians
  // return out[1];
};
