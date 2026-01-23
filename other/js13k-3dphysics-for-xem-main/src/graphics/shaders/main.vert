#version 300 es

precision mediump float;

// Position attribute
// Represents a position on the geometry
// In the original unit-space
// layout(location = 0)
in vec4 a_position;

// Color attribute.
// The raw color is passed in as a 32-bit unsigned integer /
// 4 unsigned bytes.
// layout(location = 1)
in vec4 a_color;

// Normal attribute
// Represents the normal of the geometry
// In the original unit-space
// layout(location = 2)
in vec4 a_normal;

// World transformation matrix
// One matrix per instance
// layout(location = 3)
in mat4 a_worldMatrix;

// Camera projection uniform
uniform mat4 u_projectionMatrix;

// Camera view uniform
uniform mat4 u_viewMatrix;

// Shadow map transformation matrix
// Transforms from world coordinates to shadow map coordinates
// uniform mat4 u_shadowMapMatrix;

// World position
// Mesh position transformed to world position
out vec4 v_position;

// World normal
// Mesh normal transformed to world normal
out vec4 v_normal;

// Color varying
// Simple copy of the input color
out vec4 v_color;

// Projected texture coordinate on the shadow map
// out vec4 v_shadowMapTexCoord;

void main() {
  v_position = a_worldMatrix * a_position;
  v_normal = transpose(inverse(a_worldMatrix)) * a_normal * -1.0f;
  v_color = a_color;
  // v_shadowMapTexCoord = u_shadowMapMatrix * v_position;
  gl_Position = u_projectionMatrix * u_viewMatrix * v_position;
}
