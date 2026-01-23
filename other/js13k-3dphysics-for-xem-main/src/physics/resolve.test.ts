import { createVec3, setVec3 } from '../math/vec3';
import { Box } from './box';
import { CollisionInfo, createCollisionInfo, detectCollision } from './collision';
import { solvePenatration } from './resolve';
import { STATIC_MASS } from './shape';

test('Box and ground', () => {
  // Create a box at (0, 0.9, 0) with half extents (1, 1, 1).
  const box = new Box(1, createVec3(1, 1, 1));
  setVec3(box.center, 0, 0.9, 0);
  box.setupTransformMatrix();
  box.updateBounds();

  // Create ground at y = -1.
  const ground = new Box(STATIC_MASS, createVec3(100, 1, 100));
  setVec3(ground.center, 0, -1, 0);
  ground.setupTransformMatrix();
  ground.updateBounds();

  // Collide the box with the ground.
  const intersection = createCollisionInfo();
  detectCollision(intersection, box, ground);
  expect(intersection).toBeDefined();
  expect(intersection?.depth).toBeCloseTo(0.1);

  // Resolve the collision.
  solvePenatration(box, ground, intersection as CollisionInfo);

  // The box should be pushed up to y=1
  expect(box.center[1]).toBeCloseTo(1);

  // The box y velocity should be 0
  expect(box.velocity[1]).toBeCloseTo(0);

  // The ground should have stayed at y=-1
  expect(ground.center[1]).toBeCloseTo(-1);

  // The ground y velocity should be 0
  expect(ground.velocity[1]).toBeCloseTo(0);
});

test('Rotating box', () => {
  // Create a box at (0, 0.9, 0) with half extents (1, 1, 1).
  const box = new Box(1, createVec3(1, 1, 1));
  setVec3(box.center, 0, 0.9, 0);
  box.angularVelocity[1] = 1;
  box.setupTransformMatrix();
  box.updateBounds();
  // box.update();

  // Create ground at y = -1.
  const ground = new Box(STATIC_MASS, createVec3(100, 1, 100));
  setVec3(ground.center, 0, -1, 0);
  ground.setupTransformMatrix();
  ground.updateBounds();
  // ground.update();

  // Collide the box with the ground.
  const intersection = createCollisionInfo();
  detectCollision(intersection, box, ground);
  expect(intersection).toBeDefined();
  expect(intersection?.depth).toBeCloseTo(0.1);

  // Resolve the collision.
  solvePenatration(box, ground, intersection as CollisionInfo);

  // The box should be pushed up to y=1
  expect(box.center[1]).toBeCloseTo(1);

  // The box y velocity should be 0
  expect(box.velocity[1]).toBeCloseTo(0);

  // The box's angular rotation should have slowed down
  expect(box.angularVelocity[1]).toBeCloseTo(0.0);
});
