import { lookAt } from './graphics/camera';
import { DYNAMIC_CUBES } from './graphics/constants';
import { camera, drawLists, endFrame, lightSource, startFrame } from './graphics/engine';
import { multiplyMat4, scaleMat4, translateMat4 } from './math/mat4';
import { createVec3, setVec3 } from './math/vec3';
import { Box } from './physics/box';
import { collisionDetection } from './physics/collision';
import { STATIC_MASS, Shape } from './physics/shape';
import { clamp, symmetricRandom } from './utils';

const shapes: Shape[] = [];

const ground = new Box(STATIC_MASS, createVec3(100, 4, 100));
setVec3(ground.center, 0, -4, 0);
shapes.push(ground);

let time = 0;
let dt = 0;

const gameLoop = (now: number): void => {
  // Convert to seconds
  now *= 0.001;

  // Calculate the time delta
  // Maximum of 30 FPS
  dt = Math.min(now - time, 1.0 / 30.0);

  // Set the current real world time
  time = now;

  if (Math.random() < 0.1) {
    if (shapes.length > 100) {
      shapes.splice(1, 1);
    }
    const newBox = new Box(1, createVec3(1, 1, 1));
    setVec3(newBox.center, 4 * symmetricRandom(), 20, 4 * symmetricRandom());
    setVec3(newBox.velocity, 4 * symmetricRandom(), 20, 4 * symmetricRandom());
    setVec3(newBox.angularVelocity, 2 * symmetricRandom(), 2 * symmetricRandom(), 2 * symmetricRandom());
    shapes.push(newBox);
  }

  // Step count: Should be 600 steps per second
  const stepCount = clamp(Math.round(600 * dt), 1, 20);

  collisionDetection(shapes, stepCount);

  // Start a new frame
  startFrame();

  // Ground
  const ground = drawLists[DYNAMIC_CUBES].addInstance(0xff408040);
  scaleMat4(ground, ground, 100, 0.1, 100);

  // Back wall
  const backWall = drawLists[DYNAMIC_CUBES].addInstance(0xfff8c0a0);
  translateMat4(backWall, backWall, 0, 10, 50);
  scaleMat4(backWall, backWall, 100, 20, 0.1);

  // Add all the shapes to the draw list
  for (const shape of shapes) {
    const m = drawLists[DYNAMIC_CUBES].addInstance(0xff80e0e0);
    multiplyMat4(m, m, shape.transformMatrix);
  }

  // Setup the camera to look at the cube
  setVec3(camera.source, 0, 40, -50);
  setVec3(camera.lookAt, 0, 3, 0);
  lookAt(camera, camera.lookAt, Math.PI / 4);

  // Setup the light source
  setVec3(lightSource.source, 20, 100, -40);
  setVec3(lightSource.lookAt, 0, 5, 0);
  lookAt(lightSource, lightSource.lookAt, 1);
  lightSource.ambientLight = 0.5;

  // End the frame
  endFrame();

  // Request the next frame
  requestAnimationFrame(gameLoop);
};
requestAnimationFrame(gameLoop);
