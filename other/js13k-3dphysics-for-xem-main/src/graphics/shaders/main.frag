#version 300 es

precision mediump float;

uniform vec3 u_cameraPosition;

uniform vec3 u_lightPosition;

uniform float u_ambientLight;

// Color varying
// Simple copy of the input color
in vec4 v_color;

// World position
// Mesh position transformed to world position
in vec4 v_position;

// World normal
// Mesh normal transformed to world normal
in vec4 v_normal;

// Output color
out vec4 outputColor;

void main() {
  vec3 textureColor = v_color.rgb;

  // First we need to calculate the surface normal
  vec3 surfaceNormal = normalize(v_normal.xyz);

  // Directional light
  vec3 lightRay = normalize(v_position.xyz - u_lightPosition);
  float directionalLight = max(0.0f, dot(lightRay, surfaceNormal));

  // Ambient directional light
  vec3 ambientLightSource = vec3(256.0f, 256.0f, -128.0f);
  vec3 ambientLightRay = normalize(v_position.xyz - ambientLightSource);
  float ambientDirectionalLight = max(0.0f, dot(ambientLightRay, surfaceNormal));

  // Light factor can be in the range of 0.0 to 1.0
  float lightFactor = clamp(u_ambientLight * ambientDirectionalLight + (1.2f - u_ambientLight) * directionalLight, 0.0f, 1.0f);

  // Now map the light factor to a color
  // Light factor 0-1 is black to color
  vec3 surfaceColor = mix(vec3(0.0f, 0.0f, 0.0f), textureColor, lightFactor);

  // Specular light
  vec3 viewDir = normalize(u_cameraPosition - v_position.xyz);
  vec3 reflectDir = reflect(lightRay, surfaceNormal);
  float shininess = 64.0f;
  float specular = pow(max(dot(viewDir, reflectDir), 0.0f), shininess);

  // Put it all together
  surfaceColor = mix(surfaceColor, vec3(1.0f, 1.0f, 1.0f), specular);
  outputColor = vec4(surfaceColor.rgb, v_color.a);
}
