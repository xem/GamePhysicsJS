import { Vec3, squaredDistanceVec3 } from '../math/vec3';
import { Shape } from './shape';

/**
 * TODO: This doesn't work yet
 */
export class Sphere extends Shape {
  readonly radius: number;

  constructor(radius: number) {
    super(1);
    this.radius = radius;
  }

  updateBounds(): void {
    for (let i = 0; i < 3; i++) {
      this.aabbMin[i] = this.center[i] - this.radius;
      this.aabbMax[i] = this.center[i] + this.radius;
    }
  }

  containsPoint(point: Vec3): boolean {
    return squaredDistanceVec3(this.center, point) <= this.radius * this.radius;
  }
}
