import { EPSILON } from '../math/constants';
import { createMat4, fromRotationTranslationMat4, multiplyMat4, transposeMat4 } from '../math/mat4';
import {
  Vec3,
  addVec3,
  copyVec3,
  createVec3,
  crossVec3,
  dotVec3,
  magnitudeVec3,
  origin,
  scaleAndAddVec3,
  scaleVec3,
  subtractVec3,
  transformMat4Vec3,
} from '../math/vec3';
import { CollisionInfo } from './collision';
import { Shape } from './shape';

const rA = createVec3();
const rB = createVec3();
const relativeVelocity = createVec3();
const temp1 = createVec3();
const temp1Transformed = createVec3();
const temp2 = createVec3();
const temp2Transformed = createVec3();
const tempRotation = createMat4();
const tempRotationT = createMat4();
const invInertiaA = createMat4();
const invInertiaB = createMat4();
const impulse = createVec3();
const normalVelocity = createVec3();
const tangentVelocity = createVec3();
const tangentDirection = createVec3();
const frictionImpulseVector = createVec3();
const angularFrictionA = createVec3();
const angularFrictionB = createVec3();
const nextVelocityA = createVec3();
const nextVelocityB = createVec3();
const nextAngularVelocityA = createVec3();
const nextAngularVelocityB = createVec3();

export const solvePenatration = (a: Shape, b: Shape, intersection: CollisionInfo): void => {
  const { normal, depth } = intersection;

  // Solve penetration
  // Assuming you have values for invMassA and invMassB available
  const moveFactorA = a.invMass / (a.invMass + b.invMass);
  const moveFactorB = b.invMass / (a.invMass + b.invMass);

  scaleAndAddVec3(a.center, a.center, normal, depth * moveFactorA);
  a.setupTransformMatrix();
  a.updateBounds();

  if (depth * moveFactorA > 0.005) {
    a.sleepCount = 0;
  }

  scaleAndAddVec3(b.center, b.center, normal, -depth * moveFactorB);
  b.setupTransformMatrix();
  b.updateBounds();

  if (depth * moveFactorB > 0.005) {
    b.sleepCount = 0;
  }

  copyVec3(nextVelocityA, a.velocity);
  copyVec3(nextVelocityB, b.velocity);
  copyVec3(nextAngularVelocityA, a.angularVelocity);
  copyVec3(nextAngularVelocityB, b.angularVelocity);

  for (let i = 0; i < intersection.numPoints; i++) {
    solvePenatrationContactPoint(a, b, intersection, i);
  }

  copyVec3(a.velocity, nextVelocityA);
  copyVec3(b.velocity, nextVelocityB);
  copyVec3(a.angularVelocity, nextAngularVelocityA);
  copyVec3(b.angularVelocity, nextAngularVelocityB);
};

const solvePenatrationContactPoint = (
  a: Shape,
  b: Shape,
  intersection: CollisionInfo,
  contactPointIndex: number
): void => {
  const { normal } = intersection;
  const contactPoint = intersection.allContactPoints[contactPointIndex];

  // rA and rB are vectors from the center of mass of bodies A and B to the contactPoint.
  subtractVec3(rA, contactPoint, a.center);
  subtractVec3(rB, contactPoint, b.center);

  // Compute Relative Velocities:
  crossVec3(temp1, rA, a.angularVelocity);
  crossVec3(temp2, rB, b.angularVelocity);
  addVec3(relativeVelocity, b.velocity, temp2);
  subtractVec3(relativeVelocity, relativeVelocity, a.velocity);
  subtractVec3(relativeVelocity, relativeVelocity, temp1);

  // If the relative velocity is separating, then don't resolve.
  if (dotVec3(relativeVelocity, normal) < 0) {
    return;
  }

  // Compute scalar inverse moment of inertia terms
  fromRotationTranslationMat4(tempRotation, a.rotation, origin);
  transposeMat4(tempRotationT, tempRotation);
  multiplyMat4(invInertiaA, tempRotation, a.invInertia);
  multiplyMat4(invInertiaA, invInertiaA, tempRotationT);

  fromRotationTranslationMat4(tempRotation, b.rotation, origin);
  transposeMat4(tempRotationT, tempRotation);
  multiplyMat4(invInertiaB, tempRotation, b.invInertia);
  multiplyMat4(invInertiaB, invInertiaB, tempRotationT);

  // Compute Impulse:
  crossVec3(temp1, rA, normal);
  transformMat4Vec3(temp1Transformed, temp1, invInertiaA);
  const dotProductA = dotVec3(temp1Transformed, temp1);

  crossVec3(temp2, rB, normal);
  transformMat4Vec3(temp2Transformed, temp2, invInertiaB);
  const dotProductB = dotVec3(temp2Transformed, temp2);

  const restitution = Math.min(a.restitution, b.restitution);

  // Calculate the magnitude of the collision impulse (j)
  // Formula: j = -(1 + e) * (v_rel • n) / ((1/m_a + 1/m_b) + ((I_a^-1 * r_a × n) × r_a + (I_b^-1 * r_b × n) × r_b) • n)
  // Where:
  //   e: coefficient of restitution
  //   v_rel: relative velocity
  //   n: collision normal
  //   m_a, m_b: masses of objects a and b
  //   I_a, I_b: inertia tensors of objects a and b
  //   r_a, r_b: vectors from center of mass to contact point for objects a and b
  const j =
    (-(1 + restitution) * dotVec3(relativeVelocity, normal)) / (a.invMass + b.invMass + dotProductA + dotProductB);

  // Apply Impulse to Bodies:
  scaleVec3(impulse, normal, j);

  // Linear impulse
  scaleAndAddVec3(nextVelocityA, nextVelocityA, impulse, -a.invMass);
  scaleAndAddVec3(nextVelocityB, nextVelocityB, impulse, b.invMass);

  // Angular impulse
  crossVec3(temp1, rA, impulse);
  transformMat4Vec3(temp1Transformed, temp1, invInertiaA);
  addVec3(nextAngularVelocityA, nextAngularVelocityA, temp1Transformed);

  crossVec3(temp2, rB, impulse);
  transformMat4Vec3(temp2Transformed, temp2, invInertiaB);
  subtractVec3(nextAngularVelocityB, nextAngularVelocityB, temp2Transformed);

  // Start friction
  // Calculate the tangential component of relative velocity
  scaleVec3(normalVelocity, normal, dotVec3(relativeVelocity, normal));
  subtractVec3(tangentVelocity, relativeVelocity, normalVelocity);

  // Check if the tangential velocity is significant
  const tangentSpeed = magnitudeVec3(tangentVelocity);
  const frictionEnabled = true;
  const linearFrictionEnabled = true;
  const angularFrictionEnabled = true;

  if (frictionEnabled && tangentSpeed > EPSILON) {
    // There is significant tangential velocity
    scaleVec3(tangentDirection, tangentVelocity, 1 / tangentSpeed);

    // Calculate the magnitude of friction force
    // const coefficientOfFriction = 0.001; // Adjust this value as needed
    const coefficientOfFriction = Math.min(a.coefficientOfFriction, b.coefficientOfFriction);
    const minNormalForce = 9.8; // Minimum normal force (approximating Earth's gravity)
    const normalForceMagnitude = Math.max(Math.abs(j) / intersection.allContactPoints.length, minNormalForce);
    const frictionMagnitude = Math.min(coefficientOfFriction * normalForceMagnitude, tangentSpeed);

    scaleVec3(frictionImpulseVector, tangentDirection, -frictionMagnitude);

    if (linearFrictionEnabled) {
      addFriction(nextVelocityA, frictionImpulseVector, a.invMass);
      addFriction(nextVelocityB, frictionImpulseVector, -b.invMass);
    }

    if (angularFrictionEnabled) {
      crossVec3(angularFrictionA, rA, frictionImpulseVector);
      crossVec3(angularFrictionB, rB, frictionImpulseVector);

      transformMat4Vec3(angularFrictionA, angularFrictionA, a.invInertia);
      transformMat4Vec3(angularFrictionB, angularFrictionB, b.invInertia);

      addFriction(nextAngularVelocityA, angularFrictionA, 1.0);
      addFriction(nextAngularVelocityB, angularFrictionB, -1.0);
    }
  }
};

const addFriction = (out: Vec3, delta: Vec3, scale: number): void => {
  for (let i = 0; i < 3; i++) {
    let axisDelta = delta[i] * scale;
    if (Math.sign(out[i]) !== Math.sign(axisDelta)) {
      axisDelta = -axisDelta;
    }
    if (Math.abs(out[i]) < Math.abs(axisDelta)) {
      axisDelta = out[i];
    }
    out[i] -= axisDelta;
  }
};
