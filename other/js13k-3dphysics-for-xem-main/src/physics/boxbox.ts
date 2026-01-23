import {
  Vec3,
  addVec3,
  copyVec3,
  createVec3,
  createVec3Array,
  crossVec3,
  dotVec3,
  negateVec3,
  normalizeVec3,
  scaleVec3,
  setVec3,
  subtractVec3,
} from '../math/vec3';
import { Box } from './box';
import { CollisionInfo, addCollisionContactPoint } from './collision';

const axes = createVec3Array(15);
const centerToCenter = createVec3();

/**
 * Calculates the intersection between two boxes.
 *
 * Uses the Separating Axis Theorem (SAT).
 *
 * @param out CollisionInfo details.
 * @param a First box.
 * @param b Second box.
 * @returns True if the boxes intersect, false otherwise.
 */
export const detectCollisionBoxBox = (out: CollisionInfo, a: Box, b: Box): boolean => {
  // First, build list of axes to test

  // Box A faces
  subtractVec3(axes[0], a.points[0], a.points[1]);
  subtractVec3(axes[1], a.points[0], a.points[3]);
  subtractVec3(axes[2], a.points[0], a.points[4]);

  // Box B faces
  subtractVec3(axes[3], b.points[0], b.points[1]);
  subtractVec3(axes[4], b.points[0], b.points[3]);
  subtractVec3(axes[5], b.points[0], b.points[4]);

  // Cross products
  let i = 6;
  for (let j = 0; j < 3; j++) {
    for (let k = 3; k < 6; k++) {
      crossVec3(axes[i++], axes[j], axes[k]);
    }
  }

  // Check for overlap on each axis
  let minOverlap = Number.POSITIVE_INFINITY;
  let collisionNormal: Vec3 | undefined;

  for (const axis of axes) {
    if (axis[0] === 0 && axis[1] === 0 && axis[2] === 0) {
      continue; // Skip zero-length axes
    }

    normalizeVec3(axis, axis);
    const [minA, maxA] = projectBoxToAxis(a, axis);
    const [minB, maxB] = projectBoxToAxis(b, axis);

    if (isSeparated(minA, maxA, minB, maxB)) {
      return false; // Boxes are not colliding on this axis
    }

    const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
    if (overlap < minOverlap) {
      minOverlap = overlap;
      collisionNormal = axis;
    }
  }

  collisionNormal = collisionNormal as Vec3;

  // Flip normal if necessary
  subtractVec3(centerToCenter, a.center, b.center);
  if (dotVec3(centerToCenter, collisionNormal) < 0) {
    negateVec3(collisionNormal, collisionNormal);
  }

  // Build a contact point
  setVec3(out.contactPoint, 0, 0, 0);
  out.numPoints = 0;

  for (const p of a.points) {
    if (b.broadphaseContains(p) && b.containsPoint(p)) {
      addCollisionContactPoint(out, p);
    }
  }

  for (const p of b.points) {
    if (a.broadphaseContains(p) && a.containsPoint(p)) {
      addCollisionContactPoint(out, p);
    }
  }

  if (out.numPoints > 0) {
    // Calculate the average
    scaleVec3(out.contactPoint, out.contactPoint, 1 / out.numPoints);
  } else {
    // This is an edge-edge collision
    // Use a rough approximation
    addVec3(out.contactPoint, a.center, b.center);
    scaleVec3(out.contactPoint, out.contactPoint, 0.5);
  }

  out.depth = minOverlap;
  copyVec3(out.normal, collisionNormal);
  return true;
};

const projectBoxToAxis = (box: Box, axis: Vec3): [number, number] => {
  let minProjection = Number.POSITIVE_INFINITY;
  let maxProjection = Number.NEGATIVE_INFINITY;

  for (const corner of box.points) {
    const projection = dotVec3(corner, axis);
    minProjection = Math.min(minProjection, projection);
    maxProjection = Math.max(maxProjection, projection);
  }

  return [minProjection, maxProjection];
};

const isSeparated = (minA: number, maxA: number, minB: number, maxB: number): boolean => maxA < minB || maxB < minA;
