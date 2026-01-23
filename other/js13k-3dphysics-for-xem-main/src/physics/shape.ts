import { EPSILON } from '../math/constants';
import { Mat4, createMat4, fromRotationTranslationMat4, invertMat4 } from '../math/mat4';
import { Quaternion, createQuaternion, multiplyQuat, normalizeQuat } from '../math/quat';
import { Vec3, createVec3, lessThanOrEqualsVec3, magnitudeVec3, scaleAndAddVec3 } from '../math/vec3';
import { setVec4 } from '../math/vec4';

export const STATIC_MASS = 10000;

export const SLEEP_THRESHOLD = 100;

export const DEFAULT_RESTITUTION = 0.01;

export const DEFAULT_COEFFICIENT_OF_FRICTION = 0.01;

export const GRAVITY = 60.0;

const deltaRotationQuat = createQuaternion();

export abstract class Shape {
  readonly static: boolean;
  readonly mass: number;
  readonly invMass: number;
  readonly center: Vec3;
  readonly rotation: Quaternion;
  readonly velocity: Vec3;
  readonly angularVelocity: Vec3;
  readonly invInertia: Mat4;
  readonly transformMatrix: Mat4;
  readonly inverseTransformMatrix: Mat4;
  readonly aabbMin: Vec3;
  readonly aabbMax: Vec3;
  restitution = DEFAULT_RESTITUTION;
  coefficientOfFriction = DEFAULT_COEFFICIENT_OF_FRICTION;
  noclip = false;
  sleepCount = 0;

  constructor(mass: number) {
    this.static = mass >= STATIC_MASS;
    this.mass = mass;
    this.invMass = mass >= STATIC_MASS ? 0 : 1 / mass;
    this.center = createVec3();
    this.rotation = createQuaternion();
    this.velocity = createVec3();
    this.angularVelocity = createVec3();
    this.invInertia = createMat4();
    this.transformMatrix = createMat4();
    this.inverseTransformMatrix = createMat4();
    this.aabbMin = createVec3();
    this.aabbMax = createVec3();
  }

  update(): void {
    const dt = 1.0 / 60.0 / 10.0;

    if (!this.static) {
      const gravity = GRAVITY;
      this.velocity[1] -= dt * gravity;
    }

    scaleAndAddVec3(this.center, this.center, this.velocity, dt);

    // "Exponential Map" method
    // "Rodrigues' Rotation Formula" applied to quaternions
    // Create a quaternion from angular velocity
    const x = this.angularVelocity[0];
    const y = this.angularVelocity[1];
    const z = this.angularVelocity[2];
    const magnitude = magnitudeVec3(this.angularVelocity);

    if (magnitude > EPSILON) {
      // Only update for non-negligible rotations
      // Calculate rotation angle over the time step
      const halfAngle = 0.5 * magnitude * dt;
      const sinHalfAngle = Math.sin(halfAngle);

      // Construct quaternion representing the rotation over dt
      // This converts the axis-angle representation (angular velocity * dt)
      // into a quaternion representation
      setVec4(
        deltaRotationQuat,
        (x / magnitude) * sinHalfAngle, // Scaled x component
        (y / magnitude) * sinHalfAngle, // Scaled y component
        (z / magnitude) * sinHalfAngle, // Scaled z component
        Math.cos(halfAngle) // w component
      );

      // Apply this incremental rotation to the current rotation
      // Order matters: this applies deltaRotationQuat in local space
      multiplyQuat(this.rotation, this.rotation, deltaRotationQuat);

      // Normalize to prevent accumulation of numerical errors
      normalizeQuat(this.rotation, this.rotation);
    }
  }

  /**
   * Sets up the default transform matrix.
   */
  setupTransformMatrix(): void {
    fromRotationTranslationMat4(this.transformMatrix, this.rotation, this.center);
    invertMat4(this.inverseTransformMatrix, this.transformMatrix);
  }

  broadphaseIntersects(shape: Shape): boolean {
    return lessThanOrEqualsVec3(this.aabbMin, shape.aabbMax) && lessThanOrEqualsVec3(shape.aabbMin, this.aabbMax);
  }

  broadphaseContains(point: Vec3): boolean {
    return lessThanOrEqualsVec3(this.aabbMin, point) && lessThanOrEqualsVec3(point, this.aabbMax);
  }

  abstract updateBounds(): void;

  abstract containsPoint(point: Vec3): boolean;
}
