/**
 * Components refer to the GLSL inputs.
 * They can be 32 bit floats (for vec3 coordinates and transformation matrices),
 * or they can be 32 bit unsigned integers (for colors).
 */
export const BYTES_PER_COMPONENT = 4;

/**
 * Geometry vertexes include a 3D position and a 3D vector.
 */
export const COMPONENTS_PER_VERTEX = 6;

/**
 * Number of bytes per vertex.
 * For vertexAttribPointer.
 */
export const BYTES_PER_VERTEX = COMPONENTS_PER_VERTEX * BYTES_PER_COMPONENT;

/**
 * Number of elements in a 4x4 matrix.
 * Note that "component" = "float" here.
 * Used for calculating the number of bytes per instance.
 */
export const COMPONENTS_PER_MATRIX = 4 * 4;

/**
 * Each instance has one 32-bit color and one 4x4 transofrmation matrix.
 */
export const COMPONENTS_PER_INSTANCE = 1 + COMPONENTS_PER_MATRIX;

/**
 * Number of bytes per instance.
 * For vertexAttribPointer.
 */
export const BYTES_PER_INSTANCE = COMPONENTS_PER_INSTANCE * BYTES_PER_COMPONENT;

/**
 * Index of "static cubes" in the draw list array.
 * This must be the correct array index.
 * See engine.ts.
 */
export const STATIC_CUBES = 0;

/**
 * Index of "static sphers" in the draw list array.
 * This must be the correct array index.
 * See engine.ts.
 */
export const STATIC_SPHERES = 1;

/**
 * Index of "dynamic cubes" in the draw list array.
 * This must be the correct array index.
 * See engine.ts.
 */
export const DYNAMIC_CUBES = 2;

/**
 * Index of "dynamic spheres" in the draw list array.
 * This must be the correct array index.
 * See engine.ts.
 */
export const DYNAMIC_SPHERES = 3;
