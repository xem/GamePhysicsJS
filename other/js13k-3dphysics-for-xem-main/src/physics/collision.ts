import { DEBUG } from '../debug';
import { Vec3, addVec3, copyVec3, createVec3, createVec3Array, magnitudeVec3 } from '../math/vec3';
import { Box } from './box';
import { detectCollisionBoxBox } from './boxbox';
import { solvePenatration } from './resolve';
import { SLEEP_THRESHOLD, Shape } from './shape';

export const MAX_COLLISION_CONTACTS = 16;

export type CollisionInfo = {
  depth: number;
  normal: Vec3;
  contactPoint: Vec3;
  allContactPoints: Vec3[];
  numPoints: number;
};

export const createCollisionInfo = (): CollisionInfo => {
  return {
    depth: 0,
    normal: createVec3(),
    contactPoint: createVec3(),
    allContactPoints: createVec3Array(MAX_COLLISION_CONTACTS),
    numPoints: 0,
  };
};

const tempCollisionInfo = createCollisionInfo();

export const addCollisionContactPoint = (out: CollisionInfo, p: Vec3): void => {
  addVec3(out.contactPoint, out.contactPoint, p);
  copyVec3(out.allContactPoints[out.numPoints], p);
  out.numPoints++;
  if (DEBUG && out.numPoints >= MAX_COLLISION_CONTACTS) {
    throw new Error('Too many contact points');
  }
};

export const detectCollision = (out: CollisionInfo, a: Shape, b: Shape): boolean => {
  if (a instanceof Box && b instanceof Box) {
    return detectCollisionBoxBox(out, a, b);
  }
  return false;
};

/**
 * Detects collisions between shapes.
 * Resolves collisions by solving penetration.
 * @param shapes - List of shapes to check for collisions.
 * @param stepCount - Number of steps to take.
 */
export const collisionDetection = (shapes: Shape[], stepCount: number): void => {
  for (let step = 0; step < stepCount; step++) {
    // Update all shape positions, matrices, and AABB bounds
    for (const shape of shapes) {
      if (!shape.noclip && !shape.static && shape.sleepCount < SLEEP_THRESHOLD) {
        shape.update();
      }
      shape.setupTransformMatrix();
      shape.updateBounds();
    }

    // Do entity-to-entity collision detection
    for (let i = 0; i < shapes.length; i++) {
      const shape1 = shapes[i];
      if (!shape1.noclip) {
        for (let j = i + 1; j < shapes.length; j++) {
          const shape2 = shapes[j];
          if (
            !shape2.noclip &&
            ((!shape1.static && shape1.sleepCount < SLEEP_THRESHOLD) ||
              (!shape2.static && shape2.sleepCount < SLEEP_THRESHOLD)) &&
            shape1.broadphaseIntersects(shape2)
          ) {
            if (detectCollision(tempCollisionInfo, shape1, shape2)) {
              solvePenatration(shape1, shape2, tempCollisionInfo);
            }
          }
        }
      }
    }
  }

  for (const shape of shapes) {
    if (!shape.static) {
      if (magnitudeVec3(shape.velocity) < 1.5 && magnitudeVec3(shape.angularVelocity) < 0.5) {
        shape.sleepCount++;
      }
    }
  }
};

/**
 * Line intersect with sphere
 * https://math.stackexchange.com/a/1939462
 *
 * @param center Center of sphere.
 * @param radius Radius of sphere.
 * @param start Start of line segment.
 * @param end End of line segment.
 * @return The numeric distance along the line segment where the intersection occurs, or undefined if there is no intersection.
 */
export const lineIntersectSphere = (center: Vec3, radius: number, start: Vec3, end: Vec3): number | undefined => {
  const r = radius;

  const qx = start[0] - center[0];
  const qy = start[1] - center[1];
  const qz = start[2] - center[2];

  let ux = end[0] - start[0];
  let uy = end[1] - start[1];
  let uz = end[2] - start[2];
  const max = Math.hypot(ux, uy, uz);
  ux /= max;
  uy /= max;
  uz /= max;

  const a = ux * ux + uy * uy + uz * uz;
  const b = 2 * (ux * qx + uy * qy + uz * qz);
  const c = qx * qx + qy * qy + qz * qz - r * r;
  const d = b * b - 4 * a * c;
  if (d < 0) {
    // Solutions are complex, so no intersections
    return undefined;
  }

  const t1 = (-1 * b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  const t2 = (-1 * b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  if ((t1 >= 0.0 && t1 < max) || (t2 >= 0.0 && t2 < max)) {
    return Math.min(t1, t2);
  }
  if (t1 >= 0 && t1 < max) {
    return t1;
  }
  if (t2 >= 0 && t2 < max) {
    return t2;
  }
  return undefined;
};
