import { HEIGHT, WIDTH, gl } from '../globals';
import {
  createMat4,
  identityMat4,
  multiplyMat4,
  perspectiveMat4,
  rotateXMat4,
  rotateYMat4,
  translateMat4Vec3,
} from '../math/mat4';
import { createVec3, negateVec3 } from '../math/vec3';
import { Camera, createCamera } from './camera';
import { DrawList } from './drawlist';
import { buildCube, buildSphere } from './geometry';
import {
  mainAmbientLightUniform,
  mainCameraPositionUniform,
  mainLightPositionUniform,
  mainProgram,
  mainProjectionMatrixUniform,
  mainViewMatrixUniform,
} from './programs';

export const camera = createCamera();
export const lightSource = createCamera();
export const projectionMatrix = createMat4();
export const modelViewMatrix = createMat4();

const cameraTranslate = createVec3();
const pitchMatrix = createMat4();
const yawMatrix = createMat4();

const cubeGeometry = buildCube();
const sphereGeometry = buildSphere();

export const drawLists = [
  new DrawList(gl.STATIC_DRAW, cubeGeometry, 4096),
  new DrawList(gl.STATIC_DRAW, sphereGeometry, 4096),
  new DrawList(gl.DYNAMIC_DRAW, cubeGeometry, 4096),
  new DrawList(gl.DYNAMIC_DRAW, sphereGeometry, 4096),
];

export const resetBuffers = (usage: number): void => {
  for (const b of drawLists) {
    if (b.usage === usage) {
      b.resetBuffers();
    }
  }
};

export const updateBuffers = (usage: number): void => {
  for (const b of drawLists) {
    if (b.usage === usage) {
      b.updateBuffers();
    }
  }
};

/**
 * Starts a new frame.
 * Clears the overlay canvas and resets the dynamic drawLists.
 */
export const startFrame = (): void => {
  // Reset the dynamic drawLists
  resetBuffers(gl.DYNAMIC_DRAW);
};

/**
 * Ends the current frame.
 * Updates the dynamic drawLists and renders the scene.
 */
export const endFrame = (): void => {
  // Update buffer data
  updateBuffers(gl.DYNAMIC_DRAW);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, WIDTH, HEIGHT);
  resetGl();
  setupCamera(camera, WIDTH, HEIGHT);
  gl.useProgram(mainProgram);
  gl.uniformMatrix4fv(mainProjectionMatrixUniform, false, projectionMatrix);
  gl.uniformMatrix4fv(mainViewMatrixUniform, false, modelViewMatrix);
  gl.uniform3fv(mainCameraPositionUniform, camera.source);
  gl.uniform3fv(mainLightPositionUniform, lightSource.source);
  gl.uniform1f(mainAmbientLightUniform, lightSource.ambientLight);
  renderScene();
};

/**
 * Render the scene using the current camera and drawLists.
 */
const renderScene = (): void => {
  for (const b of drawLists) {
    b.render();
  }
};

/**
 * Resets the WebGL state for a new render.
 * Clears color buffer and depth buffer.
 */
const resetGl = (): void => {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

/**
 * Sets up the game camera.
 * @param camera
 * @param w Viewport width.
 * @param h Viewport height.
 */
const setupCamera = (camera: Camera, w: number, h: number): void => {
  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  const aspect = w / h;
  const zNear = 0.1;
  const zFar = 1000.0;
  perspectiveMat4(projectionMatrix, camera.fov, aspect, zNear, zFar);

  // Rotate around the X-axis by the pitch
  rotateXMat4(pitchMatrix, identityMat4(pitchMatrix), camera.pitch);

  // Rotate around the Y-axis by the yaw
  rotateYMat4(yawMatrix, identityMat4(yawMatrix), -camera.yaw);

  // Combine the pitch and yaw transformations
  multiplyMat4(modelViewMatrix, pitchMatrix, yawMatrix);

  // Finally, translate the world the opposite of the camera position
  // subtractVec3(cameraTranslate, origin, camera.source);
  negateVec3(cameraTranslate, camera.source);
  translateMat4Vec3(modelViewMatrix, modelViewMatrix, cameraTranslate);
};
