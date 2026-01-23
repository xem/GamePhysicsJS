import { rotateXQuat, rotateZQuat } from '../math/quat';
import { createVec3, setVec3 } from '../math/vec3';
import { Box } from './box';
import { detectCollisionBoxBox } from './boxbox';
import { createCollisionInfo } from './collision';

test('No overlap', () => {
  const a = createCube(0, 0, 0); // Box from -1 to 1
  const b = createCube(3, 0, 0); // Box from 2 to 4
  const i = createCollisionInfo();
  expect(detectCollisionBoxBox(i, a, b)).toBe(false);
});

test('Simple overlap', () => {
  const a = createCube(0, 0, 0); // Box from -1 to 1
  const b = createCube(1, 0, 0); // Box from 0 to 2
  const i = createCollisionInfo();
  detectCollisionBoxBox(i, a, b);
  expect(i).toBeDefined();
  expect(i?.depth).toBe(1);
  expect(i?.normal).toMatchObject(createVec3(-1, 0, 0));
});

test('Box against log', () => {
  // Box:
  // x from -9 to 11
  // y from 0 to 2
  // z from 0.9 to 2.9
  const box = createCube(10, 1, 1.9);

  // Log:
  // x from -20 to 20
  // y from 0 to 2
  // z from -1 to 1
  const log = createCube(0, 1, 0, createVec3(20, 1, 1));
  const i = createCollisionInfo();
  detectCollisionBoxBox(i, box, log);
  expect(i).toBeDefined();
  expect(i?.depth).toBeCloseTo(0.1);
  expect(i?.normal[0]).toBeCloseTo(0);
  expect(i?.normal[1]).toBeCloseTo(0);
  expect(i?.normal[2]).toBeCloseTo(1);
  expect(i?.contactPoint[0]).toBeCloseTo(10);
  expect(i?.contactPoint[1]).toBeCloseTo(1);
  expect(i?.contactPoint[2]).toBeCloseTo(0.9);
});

test('Box centered on ground', () => {
  const box = createCube(0, 0.9, 0); // Box y from -0.1 to 1.9
  const ground = createCube(0, -1, 0, createVec3(100, 1, 100)); // Ground y from -2 to 0
  const i = createCollisionInfo();
  detectCollisionBoxBox(i, box, ground);
  expect(i).toBeDefined();
  expect(i?.depth).toBeCloseTo(0.1);
  expect(i?.normal).toMatchObject(createVec3(0, 1, 0));
  expect(i?.contactPoint[0]).toBeCloseTo(0);
  expect(i?.contactPoint[1]).toBeCloseTo(-0.1);
  expect(i?.contactPoint[2]).toBeCloseTo(0);
});

test('Box offset on ground', () => {
  const box = createCube(10, 0.9, 10); // Box y from -0.1 to 1.9
  const ground = createCube(0, -1, 0, createVec3(100, 1, 100)); // Ground y from -2 to 0
  const i = createCollisionInfo();
  detectCollisionBoxBox(i, box, ground);
  expect(i).toBeDefined();
  expect(i?.depth).toBeCloseTo(0.1);
  expect(i?.normal).toMatchObject(createVec3(0, 1, 0));
});

test('Perfect X rotated box on ground', () => {
  const box = createCube(0, 1.4, 0); // Box y from -0.1 to 1.9

  // Rotate box 45 degrees around x axis
  rotateXQuat(box.rotation, box.rotation, Math.PI / 4);
  box.setupTransformMatrix();
  box.updateBounds();
  expect(box.aabbMin[1]).toBeCloseTo(-0.014);

  const ground = createCube(0, -1, 0, createVec3(100, 1, 100)); // Ground y from -2 to 0
  const i = createCollisionInfo();
  detectCollisionBoxBox(i, box, ground);
  expect(i).toBeDefined();
  expect(i?.depth).toBeCloseTo(0.014);
  expect(i?.normal).toMatchObject(createVec3(0, 1, 0));
});

test('Perfect X and Z rotated box on ground', () => {
  const box = createCube(0, 1.7, 0); // Box y from -0.1 to 1.9

  // Rotate box 45 degrees around x axis
  rotateXQuat(box.rotation, box.rotation, Math.PI / 4);

  // Rotate box 45 degrees around z axis
  rotateZQuat(box.rotation, box.rotation, Math.PI / 4);

  box.setupTransformMatrix();
  box.updateBounds();
  expect(box.aabbMin[1]).toBeCloseTo(-0.007);

  const ground = createCube(0, -1, 0, createVec3(100, 1, 100)); // Ground y from -2 to 0
  const i = createCollisionInfo();
  detectCollisionBoxBox(i, box, ground);
  expect(i).toBeDefined();
  expect(i?.depth).toBeCloseTo(0.007);
  expect(i?.normal).toMatchObject(createVec3(0, 1, 0));
});

test('Offset X rotated box on ground', () => {
  const box = createCube(0, 1.3, 0); // Box y from -0.1 to 1.9

  // Rotate box 30 degrees around x axis
  rotateXQuat(box.rotation, box.rotation, Math.PI / 6);
  box.setupTransformMatrix();
  box.updateBounds();
  expect(box.aabbMin[1]).toBeCloseTo(-0.066);

  const ground = createCube(0, -1, 0, createVec3(100, 1, 100)); // Ground y from -2 to 0
  const i = createCollisionInfo();
  detectCollisionBoxBox(i, box, ground);
  expect(i).toBeDefined();
  expect(i?.depth).toBeCloseTo(0.066);
  expect(i?.normal).toMatchObject(createVec3(0, 1, 0));
});

const createCube = (x: number, y: number, z: number, halfExtents = createVec3(1, 1, 1)): Box => {
  const box = new Box(1, halfExtents);
  setVec3(box.center, x, y, z);
  box.setupTransformMatrix();
  box.updateBounds();
  return box;
};
