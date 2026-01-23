import { DEBUG, log } from '../debug';
import { gl } from '../globals';
import {
  ATTRIBUTE_COLOR,
  ATTRIBUTE_NORMAL,
  ATTRIBUTE_POSITION,
  ATTRIBUTE_WORLDMATRIX,
  MAIN_FRAG,
  MAIN_VERT,
  UNIFORM_AMBIENTLIGHT,
  UNIFORM_CAMERAPOSITION,
  UNIFORM_LIGHTPOSITION,
  UNIFORM_PROJECTIONMATRIX,
  UNIFORM_VIEWMATRIX,
} from './shaders';

//
// Standard input attributes for "geometry" programs.
// These are programs that render geometry.
// This works because main.vert and shadow.vert have the same attributes.
// See the use of `layout(location = 0)` in the shaders.
//

export const positionAttrib = 0;
export const colorAttrib = 1;
export const normalAttrib = 2;
export const worldMatrixAttrib = 3; // Must be last!  Matrices are multiple attributes

/**
 * Returns the uniform location.
 * This is a simple wrapper, but helps with compression.
 * @param program
 * @param name
 * @returns The uniform location.
 */
export const getUniform = (program: WebGLProgram, name: string): WebGLUniformLocation => {
  return gl.getUniformLocation(program, name) as WebGLUniformLocation;
};

/**
 * Creates a shader.
 * @param type
 * @param source
 * @returns
 */
export const loadShader = (type: number, source: string): WebGLShader => {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (DEBUG) {
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    log(`Shader compiled: ${compiled}`);
    if (!compiled) {
      const compilationLog = gl.getShaderInfoLog(shader);
      log(`Shader compiler log: ${compilationLog}`);
      log(`Shader source: ${source}`);
    }
  }

  return shader;
};

/**
 * Creates the WebGL program.
 * Basic WebGL setup
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
 * @param vertexShaderSource
 * @param fragmentShaderSource
 */
export const initShaderProgram = (
  vertexShaderSource: string,
  fragmentShaderSource: string,
  bindAttribs?: boolean
): WebGLProgram => {
  const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  if (bindAttribs) {
    gl.bindAttribLocation(program, positionAttrib, ATTRIBUTE_POSITION);
    gl.bindAttribLocation(program, colorAttrib, ATTRIBUTE_COLOR);
    gl.bindAttribLocation(program, normalAttrib, ATTRIBUTE_NORMAL);
    gl.bindAttribLocation(program, worldMatrixAttrib, ATTRIBUTE_WORLDMATRIX);
  }

  gl.linkProgram(program);

  if (DEBUG) {
    const compiled = gl.getProgramParameter(program, gl.LINK_STATUS);
    log(`Program compiled: ${compiled}`);
    const compilationLog = gl.getProgramInfoLog(program);
    log(`Program compiler log: ${compilationLog}`);
  }

  return program;
};

//
// Main program
// Primary renderer from the perspective of the camera.
// Renders to a color buffer and a depth buffer.
//

export const mainProgram = initShaderProgram(MAIN_VERT, MAIN_FRAG);
export const mainViewMatrixUniform = getUniform(mainProgram, UNIFORM_VIEWMATRIX);
export const mainProjectionMatrixUniform = getUniform(mainProgram, UNIFORM_PROJECTIONMATRIX);
export const mainAmbientLightUniform = getUniform(mainProgram, UNIFORM_AMBIENTLIGHT);
export const mainCameraPositionUniform = getUniform(mainProgram, UNIFORM_CAMERAPOSITION);
export const mainLightPositionUniform = getUniform(mainProgram, UNIFORM_LIGHTPOSITION);
