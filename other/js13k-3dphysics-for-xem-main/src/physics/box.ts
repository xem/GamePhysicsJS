import { CUBE_POINTS } from '../graphics/geometry';
import { Vec3, cloneVec3, copyVec3, createVec3, maxVec3, minVec3, multiplyVec3, transformMat4Vec3 } from '../math/vec3';
import { STATIC_MASS, Shape } from './shape';

const localPoint = createVec3();

export class Box extends Shape {
  readonly halfExtents: Vec3;
  readonly points: Vec3[];

  constructor(mass: number, halfExtents: Vec3) {
    super(mass);
    this.halfExtents = halfExtents;
    this.points = CUBE_POINTS.map(cloneVec3);

    if (mass >= STATIC_MASS) {
      this.invInertia[0] = 0;
      this.invInertia[5] = 0;
      this.invInertia[10] = 0;
    } else {
      this.invInertia[0] = 12 / (mass * (halfExtents[1] * halfExtents[1] + halfExtents[2] * halfExtents[2]));
      this.invInertia[5] = 12 / (mass * (halfExtents[0] * halfExtents[0] + halfExtents[2] * halfExtents[2]));
      this.invInertia[10] = 12 / (mass * (halfExtents[0] * halfExtents[0] + halfExtents[1] * halfExtents[1]));
    }
  }

  updateBounds(): void {
    copyVec3(this.aabbMin, this.center);
    copyVec3(this.aabbMax, this.center);
    for (let i = 0; i < 8; i++) {
      multiplyVec3(this.points[i], this.halfExtents, CUBE_POINTS[i]);
      transformMat4Vec3(this.points[i], this.points[i], this.transformMatrix);
      minVec3(this.aabbMin, this.aabbMin, this.points[i]);
      maxVec3(this.aabbMax, this.aabbMax, this.points[i]);
    }
  }

  containsPoint(point: Vec3): boolean {
    // Transform the point to the OBB's local space
    // const localPoint = vec3.create();
    transformMat4Vec3(localPoint, point, this.inverseTransformMatrix);

    // Check if the transformed point is within the half extents
    return (
      Math.abs(localPoint[0]) <= this.halfExtents[0] &&
      Math.abs(localPoint[1]) <= this.halfExtents[1] &&
      Math.abs(localPoint[2]) <= this.halfExtents[2]
    );
  }
}
