const EPSILON = 1e-5;

const createVec3 = (x = 0, y = 0, z = 0) => new Float32Array([x, y, z]);
const createVec3Array = (n) => {
  const a = [];
  for (let i = 0; i < n; i++) {
    a.push(createVec3());
  }
  return a;
};
const cloneVec3 = (a) => new Float32Array(a);
const magnitudeVec3 = (a) => Math.hypot(a[0], a[1], a[2]);
const origin = createVec3();
const copyVec3 = (out, a) => {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
};
const setVec3 = (out, x, y, z) => {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
};
const addVec3 = (out, a, b) => {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
};
const subtractVec3 = (out, a, b) => {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
};
const multiplyVec3 = (out, a, b) => {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
};
const minVec3 = (out, a, b) => {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
};
const maxVec3 = (out, a, b) => {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
};
const scaleVec3 = (out, a, b) => {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
};
const scaleAndAddVec3 = (out, a, b, scale) => {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
};
const negateVec3 = (out, a) => {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
};
const normalizeVec3 = (out, a) => {
  const len = magnitudeVec3(a);
  return len > 0 ? scaleVec3(out, a, 1 / len) : copyVec3(out, a);
};
const dotVec3 = (a, b) => {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
const crossVec3 = (out, a, b) => {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const bx = b[0];
  const by = b[1];
  const bz = b[2];
  out[0] = az * by - ay * bz;
  out[1] = ax * bz - az * bx;
  out[2] = ay * bx - ax * by;
  return out;
};
const transformMat4Vec3 = (out, a, m) => {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
};
const lessThanOrEqualsVec3 = (a, b) => a[0] <= b[0] && a[1] <= b[1] && a[2] <= b[2];

const createCamera = () => ({
  source: createVec3(),
  lookAt: createVec3(),
  direction: createVec3(),
  pitch: 0,
  yaw: 0,
  fov: 0,
  // near: 1,
  // far: 1000,
  ambientLight: 0.5
});
const lookAt = (camera, target, fov) => {
  copyVec3(camera.lookAt, target);
  subtractVec3(camera.direction, target, camera.source);
  camera.yaw = Math.atan2(camera.direction[0], camera.direction[2]);
  camera.pitch = Math.atan2(camera.direction[1], Math.hypot(camera.direction[0], camera.direction[2]));
  camera.fov = fov;
};

const BYTES_PER_COMPONENT = 4;
const COMPONENTS_PER_VERTEX = 6;
const BYTES_PER_VERTEX = COMPONENTS_PER_VERTEX * BYTES_PER_COMPONENT;
const COMPONENTS_PER_MATRIX = 4 * 4;
const COMPONENTS_PER_INSTANCE = 1 + COMPONENTS_PER_MATRIX;
const BYTES_PER_INSTANCE = COMPONENTS_PER_INSTANCE * BYTES_PER_COMPONENT;
const DYNAMIC_CUBES = 2;

const WIDTH = 1920 / 2;
const HEIGHT = 1080 / 2;
const canvases = document.querySelectorAll("canvas");
const canvas = canvases[0];
const gl = canvas.getContext("webgl2", { alpha: false });
const handleResizeEvent = () => {
  const scale = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
  const width = scale * WIDTH;
  const height = scale * HEIGHT;
  const x = (window.innerWidth - width) / 2;
  const y = (window.innerHeight - height) / 2;
  if (canvas) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.left = pixelString(x);
    canvas.style.top = pixelString(y);
    canvas.style.width = pixelString(width);
    canvas.style.height = pixelString(height);
  }
};
const pixelString = (num) => `${num | 0}px`;
window.addEventListener("resize", handleResizeEvent, false);
handleResizeEvent();

const createMat4 = () => {
  const out = new Float32Array(16);
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
};
const identityMat4 = (out) => {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
};
const transposeMat4 = (out, a) => {
  if (out === a) {
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a12 = a[6];
    const a13 = a[7];
    const a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
  return out;
};
const invertMat4 = (out, a) => {
  const a00 = a[0];
  const a01 = a[1];
  const a02 = a[2];
  const a03 = a[3];
  const a10 = a[4];
  const a11 = a[5];
  const a12 = a[6];
  const a13 = a[7];
  const a20 = a[8];
  const a21 = a[9];
  const a22 = a[10];
  const a23 = a[11];
  const a30 = a[12];
  const a31 = a[13];
  const a32 = a[14];
  const a33 = a[15];
  const b00 = a00 * a11 - a01 * a10;
  const b01 = a00 * a12 - a02 * a10;
  const b02 = a00 * a13 - a03 * a10;
  const b03 = a01 * a12 - a02 * a11;
  const b04 = a01 * a13 - a03 * a11;
  const b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30;
  const b07 = a20 * a32 - a22 * a30;
  const b08 = a20 * a33 - a23 * a30;
  const b09 = a21 * a32 - a22 * a31;
  const b10 = a21 * a33 - a23 * a31;
  const b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return void 0;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
};
const multiplyMat4 = (out, a, b) => {
  const a00 = a[0];
  const a01 = a[1];
  const a02 = a[2];
  const a03 = a[3];
  const a10 = a[4];
  const a11 = a[5];
  const a12 = a[6];
  const a13 = a[7];
  const a20 = a[8];
  const a21 = a[9];
  const a22 = a[10];
  const a23 = a[11];
  const a30 = a[12];
  const a31 = a[13];
  const a32 = a[14];
  const a33 = a[15];
  let b0 = b[0];
  let b1 = b[1];
  let b2 = b[2];
  let b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
};
const translateMat4Vec3 = (out, a, v) => translateMat4(out, a, v[0], v[1], v[2]);
const translateMat4 = (out, a, x, y, z) => {
  let a00 = void 0;
  let a01 = void 0;
  let a02 = void 0;
  let a03 = void 0;
  let a10 = void 0;
  let a11 = void 0;
  let a12 = void 0;
  let a13 = void 0;
  let a20 = void 0;
  let a21 = void 0;
  let a22 = void 0;
  let a23 = void 0;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
};
const scaleMat4 = (out, a, x, y, z) => {
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
};
const rotateXMat4 = (out, a, rad) => {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const a10 = a[4];
  const a11 = a[5];
  const a12 = a[6];
  const a13 = a[7];
  const a20 = a[8];
  const a21 = a[9];
  const a22 = a[10];
  const a23 = a[11];
  if (a !== out) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
};
const rotateYMat4 = (out, a, rad) => {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const a00 = a[0];
  const a01 = a[1];
  const a02 = a[2];
  const a03 = a[3];
  const a20 = a[8];
  const a21 = a[9];
  const a22 = a[10];
  const a23 = a[11];
  if (a !== out) {
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
};
const fromRotationTranslationMat4 = (out, q, v) => {
  const x = q[0];
  const y = q[1];
  const z = q[2];
  const w = q[3];
  const x2 = x + x;
  const y2 = y + y;
  const z2 = z + z;
  const xx = x * x2;
  const xy = x * y2;
  const xz = x * z2;
  const yy = y * y2;
  const yz = y * z2;
  const zz = z * z2;
  const wx = w * x2;
  const wy = w * y2;
  const wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
};
const perspectiveMat4 = (out, fovy, aspect, near, far) => {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = -(far + near) * nf;
  out[11] = 1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
  return out;
};

const mainFragStr = "#version 300 es\n\nprecision mediump float;\n\nuniform vec3 u_cameraPosition;\n\nuniform vec3 u_lightPosition;\n\nuniform float u_ambientLight;\n\n// Color varying\n// Simple copy of the input color\nin vec4 v_color;\n\n// World position\n// Mesh position transformed to world position\nin vec4 v_position;\n\n// World normal\n// Mesh normal transformed to world normal\nin vec4 v_normal;\n\n// Output color\nout vec4 outputColor;\n\nvoid main() {\n  vec3 textureColor = v_color.rgb;\n\n  // First we need to calculate the surface normal\n  vec3 surfaceNormal = normalize(v_normal.xyz);\n\n  // Directional light\n  vec3 lightRay = normalize(v_position.xyz - u_lightPosition);\n  float directionalLight = max(0.0f, dot(lightRay, surfaceNormal));\n\n  // Ambient directional light\n  vec3 ambientLightSource = vec3(256.0f, 256.0f, -128.0f);\n  vec3 ambientLightRay = normalize(v_position.xyz - ambientLightSource);\n  float ambientDirectionalLight = max(0.0f, dot(ambientLightRay, surfaceNormal));\n\n  // Light factor can be in the range of 0.0 to 1.0\n  float lightFactor = clamp(u_ambientLight * ambientDirectionalLight + (1.2f - u_ambientLight) * directionalLight, 0.0f, 1.0f);\n\n  // Now map the light factor to a color\n  // Light factor 0-1 is black to color\n  vec3 surfaceColor = mix(vec3(0.0f, 0.0f, 0.0f), textureColor, lightFactor);\n\n  // Specular light\n  vec3 viewDir = normalize(u_cameraPosition - v_position.xyz);\n  vec3 reflectDir = reflect(lightRay, surfaceNormal);\n  float shininess = 64.0f;\n  float specular = pow(max(dot(viewDir, reflectDir), 0.0f), shininess);\n\n  // Put it all together\n  surfaceColor = mix(surfaceColor, vec3(1.0f, 1.0f, 1.0f), specular);\n  outputColor = vec4(surfaceColor.rgb, v_color.a);\n}\n";

const mainVertStr = "#version 300 es\n\nprecision mediump float;\n\n// Position attribute\n// Represents a position on the geometry\n// In the original unit-space\n// layout(location = 0)\nin vec4 a_position;\n\n// Color attribute.\n// The raw color is passed in as a 32-bit unsigned integer /\n// 4 unsigned bytes.\n// layout(location = 1)\nin vec4 a_color;\n\n// Normal attribute\n// Represents the normal of the geometry\n// In the original unit-space\n// layout(location = 2)\nin vec4 a_normal;\n\n// World transformation matrix\n// One matrix per instance\n// layout(location = 3)\nin mat4 a_worldMatrix;\n\n// Camera projection uniform\nuniform mat4 u_projectionMatrix;\n\n// Camera view uniform\nuniform mat4 u_viewMatrix;\n\n// Shadow map transformation matrix\n// Transforms from world coordinates to shadow map coordinates\n// uniform mat4 u_shadowMapMatrix;\n\n// World position\n// Mesh position transformed to world position\nout vec4 v_position;\n\n// World normal\n// Mesh normal transformed to world normal\nout vec4 v_normal;\n\n// Color varying\n// Simple copy of the input color\nout vec4 v_color;\n\n// Projected texture coordinate on the shadow map\n// out vec4 v_shadowMapTexCoord;\n\nvoid main() {\n  v_position = a_worldMatrix * a_position;\n  v_normal = transpose(inverse(a_worldMatrix)) * a_normal * -1.0f;\n  v_color = a_color;\n  // v_shadowMapTexCoord = u_shadowMapMatrix * v_position;\n  gl_Position = u_projectionMatrix * u_viewMatrix * v_position;\n}\n";

const MAIN_FRAG = mainFragStr;
const MAIN_VERT = mainVertStr;
const UNIFORM_AMBIENTLIGHT = "u_ambientLight";
const UNIFORM_CAMERAPOSITION = "u_cameraPosition";
const UNIFORM_LIGHTPOSITION = "u_lightPosition";
const UNIFORM_PROJECTIONMATRIX = "u_projectionMatrix";
const UNIFORM_VIEWMATRIX = "u_viewMatrix";

const positionAttrib = 0;
const colorAttrib = 1;
const normalAttrib = 2;
const worldMatrixAttrib = 3;
const getUniform = (program, name) => {
  return gl.getUniformLocation(program, name);
};
const loadShader = (type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};
const initShaderProgram = (vertexShaderSource, fragmentShaderSource, bindAttribs) => {
  const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  return program;
};
const mainProgram = initShaderProgram(MAIN_VERT, MAIN_FRAG);
const mainViewMatrixUniform = getUniform(mainProgram, UNIFORM_VIEWMATRIX);
const mainProjectionMatrixUniform = getUniform(mainProgram, UNIFORM_PROJECTIONMATRIX);
const mainAmbientLightUniform = getUniform(mainProgram, UNIFORM_AMBIENTLIGHT);
const mainCameraPositionUniform = getUniform(mainProgram, UNIFORM_CAMERAPOSITION);
const mainLightPositionUniform = getUniform(mainProgram, UNIFORM_LIGHTPOSITION);

class DrawList {
  /**
   * Creates a new buffer set.
   *
   * @param usage The usage pattern (either STATIC_DRAW or DYNAMIC_DRAW).
   * @param geometry The unit geometry for a single instance.
   * @param maxInstances Maximum number of instances.
   */
  constructor(usage, geometry, maxInstances) {
    this.usage = usage;
    this.verticesPerInstance = geometry.length / COMPONENTS_PER_VERTEX;
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    this.geometryBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.geometryBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, BYTES_PER_VERTEX, 0);
    gl.enableVertexAttribArray(normalAttrib);
    gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, BYTES_PER_VERTEX, 3 * BYTES_PER_COMPONENT);
    this.instanceData = new Uint32Array(maxInstances * COMPONENTS_PER_INSTANCE);
    this.instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.instanceData, usage);
    gl.enableVertexAttribArray(colorAttrib);
    gl.vertexAttribPointer(colorAttrib, 4, gl.UNSIGNED_BYTE, true, BYTES_PER_INSTANCE, 0);
    gl.vertexAttribDivisor(colorAttrib, 1);
    this.matrices = new Array(maxInstances);
    for (let i = 0; i < maxInstances; i++) {
      const byteOffsetToMatrix = 1 * BYTES_PER_COMPONENT + i * BYTES_PER_INSTANCE;
      this.matrices[i] = new Float32Array(this.instanceData.buffer, byteOffsetToMatrix, COMPONENTS_PER_MATRIX);
    }
    gl.enableVertexAttribArray(worldMatrixAttrib);
    for (let i = 0; i < 4; i++) {
      const loc = worldMatrixAttrib + i;
      gl.enableVertexAttribArray(loc);
      const offset = 4 + i * 16;
      gl.vertexAttribPointer(
        loc,
        // location
        4,
        // size (num values to pull from buffer per iteration)
        gl.FLOAT,
        // type of data in buffer
        false,
        // normalize
        BYTES_PER_INSTANCE,
        // stride, num bytes to advance to get to next set of values
        offset
        // offset in buffer
      );
      gl.vertexAttribDivisor(loc, 1);
    }
    this.instanceCount = 0;
  }
  /**
   * Resets the buffers to empty state.
   */
  resetBuffers() {
    this.instanceCount = 0;
  }
  /**
   * Adds a new instance to the set.
   * @param color The 32-bit color.
   * @returns
   */
  addInstance(color) {
    const i = this.instanceCount++;
    this.instanceData[i * COMPONENTS_PER_INSTANCE] = color;
    return identityMat4(this.matrices[i]);
  }
  /**
   * Updates the WebGL buffers with the current data.
   */
  updateBuffers() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceData, 0, this.instanceCount * COMPONENTS_PER_INSTANCE);
  }
  /**
   * Draws the buffer set.
   */
  render() {
    gl.bindVertexArray(this.vao);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, this.verticesPerInstance, this.instanceCount);
  }
}

const CUBE_POINTS = [
  createVec3(-1, 1, -1),
  createVec3(1, 1, -1),
  createVec3(1, 1, 1),
  createVec3(-1, 1, 1),
  createVec3(-1, -1, -1),
  createVec3(1, -1, -1),
  createVec3(1, -1, 1),
  createVec3(-1, -1, 1)
];
const buildCube = () => {
  const data = [];
  const [c1, c2, c3, c4, c5, c6, c7, c8] = CUBE_POINTS;
  addQuad(data, c1, c2, c3, c4, createVec3(0, 1, 0));
  addQuad(data, c8, c7, c6, c5, createVec3(0, -1, 0));
  addQuad(data, c2, c1, c5, c6, createVec3(0, 0, -1));
  addQuad(data, c4, c3, c7, c8, createVec3(0, 0, 1));
  addQuad(data, c1, c4, c8, c5, createVec3(-1, 0, 0));
  addQuad(data, c3, c2, c6, c7, createVec3(1, 0, 0));
  return new Float32Array(data);
};
const buildSphere = () => {
  const data = [];
  const p1 = createVec3(-1, 0, 0);
  const p2 = createVec3(1, 0, 0);
  const p3 = createVec3(0, -1, 0);
  const p4 = createVec3(0, 1, 0);
  const p5 = createVec3(0, 0, -1);
  const p6 = createVec3(0, 0, 1);
  const buildFace = (c1, c2, c3, depth = 0) => {
    if (depth === 3) {
      addTriangle(data, c1, c2, c3, c1, c2, c3);
    } else {
      const m1 = createVec3();
      const m2 = createVec3();
      const m3 = createVec3();
      normalizeVec3(m1, addVec3(m1, c1, c2));
      normalizeVec3(m2, addVec3(m2, c2, c3));
      normalizeVec3(m3, addVec3(m3, c3, c1));
      buildFace(c1, m1, m3, depth + 1);
      buildFace(m1, c2, m2, depth + 1);
      buildFace(m3, m2, c3, depth + 1);
      buildFace(m1, m2, m3, depth + 1);
    }
  };
  buildFace(p1, p6, p3);
  buildFace(p6, p2, p3);
  buildFace(p2, p5, p3);
  buildFace(p5, p1, p3);
  buildFace(p6, p1, p4);
  buildFace(p2, p6, p4);
  buildFace(p5, p2, p4);
  buildFace(p1, p5, p4);
  return new Float32Array(data);
};
const addQuad = (data, p1, p2, p3, p4, normal) => {
  addTriangle(data, p1, p2, p3, normal, normal, normal);
  addTriangle(data, p1, p3, p4, normal, normal, normal);
};
const addTriangle = (data, p1, p2, p3, n1, n2, n3) => {
  addPoint(data, p1);
  addPoint(data, n1);
  addPoint(data, p2);
  addPoint(data, n2);
  addPoint(data, p3);
  addPoint(data, n3);
};
const addPoint = (data, p) => data.push(...p);

const camera = createCamera();
const lightSource = createCamera();
const projectionMatrix = createMat4();
const modelViewMatrix = createMat4();
const cameraTranslate = createVec3();
const pitchMatrix = createMat4();
const yawMatrix = createMat4();
const cubeGeometry = buildCube();
const sphereGeometry = buildSphere();
const drawLists = [
  new DrawList(gl.STATIC_DRAW, cubeGeometry, 4096),
  new DrawList(gl.STATIC_DRAW, sphereGeometry, 4096),
  new DrawList(gl.DYNAMIC_DRAW, cubeGeometry, 4096),
  new DrawList(gl.DYNAMIC_DRAW, sphereGeometry, 4096)
];
const resetBuffers = (usage) => {
  for (const b of drawLists) {
    if (b.usage === usage) {
      b.resetBuffers();
    }
  }
};
const updateBuffers = (usage) => {
  for (const b of drawLists) {
    if (b.usage === usage) {
      b.updateBuffers();
    }
  }
};
const startFrame = () => {
  resetBuffers(gl.DYNAMIC_DRAW);
};
const endFrame = () => {
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
const renderScene = () => {
  for (const b of drawLists) {
    b.render();
  }
};
const resetGl = () => {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};
const setupCamera = (camera2, w, h) => {
  const aspect = w / h;
  const zNear = 0.1;
  const zFar = 1e3;
  perspectiveMat4(projectionMatrix, camera2.fov, aspect, zNear, zFar);
  rotateXMat4(pitchMatrix, identityMat4(pitchMatrix), camera2.pitch);
  rotateYMat4(yawMatrix, identityMat4(yawMatrix), -camera2.yaw);
  multiplyMat4(modelViewMatrix, pitchMatrix, yawMatrix);
  negateVec3(cameraTranslate, camera2.source);
  translateMat4Vec3(modelViewMatrix, modelViewMatrix, cameraTranslate);
};

const setVec4 = (out, x, y, z, w = 0) => {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
};

const createQuaternion = (x = 0, y = 0, z = 0, w = 1) => new Float32Array([x, y, z, w]);
const magnitudeQuat = (a) => Math.hypot(a[0], a[1], a[2], a[3]);
const copyQuat = (out, a) => {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
};
const multiplyQuat = (out, a, b) => {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  const bx = b[0];
  const by = b[1];
  const bz = b[2];
  const bw = b[3];
  out[0] = ax * bw + aw * bx - ay * bz + az * by;
  out[1] = ay * bw + aw * by - az * bx + ax * bz;
  out[2] = az * bw + aw * bz - ax * by + ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
};
const scaleQuat = (out, a, b) => {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
};
const normalizeQuat = (out, a) => {
  const len = magnitudeQuat(a);
  return len > 0 ? scaleQuat(out, a, 1 / len) : copyQuat(out, a);
};

const STATIC_MASS = 1e4;
const SLEEP_THRESHOLD = 100;
const DEFAULT_RESTITUTION = 0.01;
const DEFAULT_COEFFICIENT_OF_FRICTION = 0.01;
const GRAVITY = 60;
const deltaRotationQuat = createQuaternion();
class Shape {
  constructor(mass) {
    this.restitution = DEFAULT_RESTITUTION;
    this.coefficientOfFriction = DEFAULT_COEFFICIENT_OF_FRICTION;
    this.noclip = false;
    this.sleepCount = 0;
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
  update() {
    const dt = 1 / 60 / 10;
    if (!this.static) {
      const gravity = GRAVITY;
      this.velocity[1] -= dt * gravity;
    }
    scaleAndAddVec3(this.center, this.center, this.velocity, dt);
    const x = this.angularVelocity[0];
    const y = this.angularVelocity[1];
    const z = this.angularVelocity[2];
    const magnitude = magnitudeVec3(this.angularVelocity);
    if (magnitude > EPSILON) {
      const halfAngle = 0.5 * magnitude * dt;
      const sinHalfAngle = Math.sin(halfAngle);
      setVec4(
        deltaRotationQuat,
        x / magnitude * sinHalfAngle,
        // Scaled x component
        y / magnitude * sinHalfAngle,
        // Scaled y component
        z / magnitude * sinHalfAngle,
        // Scaled z component
        Math.cos(halfAngle)
        // w component
      );
      multiplyQuat(this.rotation, this.rotation, deltaRotationQuat);
      normalizeQuat(this.rotation, this.rotation);
    }
  }
  /**
   * Sets up the default transform matrix.
   */
  setupTransformMatrix() {
    fromRotationTranslationMat4(this.transformMatrix, this.rotation, this.center);
    invertMat4(this.inverseTransformMatrix, this.transformMatrix);
  }
  broadphaseIntersects(shape) {
    return lessThanOrEqualsVec3(this.aabbMin, shape.aabbMax) && lessThanOrEqualsVec3(shape.aabbMin, this.aabbMax);
  }
  broadphaseContains(point) {
    return lessThanOrEqualsVec3(this.aabbMin, point) && lessThanOrEqualsVec3(point, this.aabbMax);
  }
}

const localPoint = createVec3();
class Box extends Shape {
  constructor(mass, halfExtents) {
    super(mass);
    this.halfExtents = halfExtents;
    this.points = CUBE_POINTS.map(cloneVec3);
    if (mass >= STATIC_MASS) {
      this.invInertia[0] = 0;
      this.invInertia[5] = 0;
      this.invInertia[10] = 0;
    } else {
      this.invInertia[0] = 12 / (mass * (halfExtents[1] * halfExtents[1] + halfExtents[2] * halfExtents[2]));
      this.invInertia[5] = 12 / (mass * (halfExtents[0] * halfExtents[0] + halfExtents[2] * halfExtents[2]));
      this.invInertia[10] = 12 / (mass * (halfExtents[0] * halfExtents[0] + halfExtents[1] * halfExtents[1]));
    }
  }
  updateBounds() {
    copyVec3(this.aabbMin, this.center);
    copyVec3(this.aabbMax, this.center);
    for (let i = 0; i < 8; i++) {
      multiplyVec3(this.points[i], this.halfExtents, CUBE_POINTS[i]);
      transformMat4Vec3(this.points[i], this.points[i], this.transformMatrix);
      minVec3(this.aabbMin, this.aabbMin, this.points[i]);
      maxVec3(this.aabbMax, this.aabbMax, this.points[i]);
    }
  }
  containsPoint(point) {
    transformMat4Vec3(localPoint, point, this.inverseTransformMatrix);
    return Math.abs(localPoint[0]) <= this.halfExtents[0] && Math.abs(localPoint[1]) <= this.halfExtents[1] && Math.abs(localPoint[2]) <= this.halfExtents[2];
  }
}

const axes = createVec3Array(15);
const centerToCenter = createVec3();
const detectCollisionBoxBox = (out, a, b) => {
  subtractVec3(axes[0], a.points[0], a.points[1]);
  subtractVec3(axes[1], a.points[0], a.points[3]);
  subtractVec3(axes[2], a.points[0], a.points[4]);
  subtractVec3(axes[3], b.points[0], b.points[1]);
  subtractVec3(axes[4], b.points[0], b.points[3]);
  subtractVec3(axes[5], b.points[0], b.points[4]);
  let i = 6;
  for (let j = 0; j < 3; j++) {
    for (let k = 3; k < 6; k++) {
      crossVec3(axes[i++], axes[j], axes[k]);
    }
  }
  let minOverlap = Number.POSITIVE_INFINITY;
  let collisionNormal;
  for (const axis of axes) {
    if (axis[0] === 0 && axis[1] === 0 && axis[2] === 0) {
      continue;
    }
    normalizeVec3(axis, axis);
    const [minA, maxA] = projectBoxToAxis(a, axis);
    const [minB, maxB] = projectBoxToAxis(b, axis);
    if (isSeparated(minA, maxA, minB, maxB)) {
      return false;
    }
    const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
    if (overlap < minOverlap) {
      minOverlap = overlap;
      collisionNormal = axis;
    }
  }
  collisionNormal = collisionNormal;
  subtractVec3(centerToCenter, a.center, b.center);
  if (dotVec3(centerToCenter, collisionNormal) < 0) {
    negateVec3(collisionNormal, collisionNormal);
  }
  setVec3(out.contactPoint, 0, 0, 0);
  out.numPoints = 0;
  for (const p of a.points) {
    if (b.broadphaseContains(p) && b.containsPoint(p)) {
      addCollisionContactPoint(out, p);
    }
  }
  for (const p of b.points) {
    if (a.broadphaseContains(p) && a.containsPoint(p)) {
      addCollisionContactPoint(out, p);
    }
  }
  if (out.numPoints > 0) {
    scaleVec3(out.contactPoint, out.contactPoint, 1 / out.numPoints);
  } else {
    addVec3(out.contactPoint, a.center, b.center);
    scaleVec3(out.contactPoint, out.contactPoint, 0.5);
  }
  out.depth = minOverlap;
  copyVec3(out.normal, collisionNormal);
  return true;
};
const projectBoxToAxis = (box, axis) => {
  let minProjection = Number.POSITIVE_INFINITY;
  let maxProjection = Number.NEGATIVE_INFINITY;
  for (const corner of box.points) {
    const projection = dotVec3(corner, axis);
    minProjection = Math.min(minProjection, projection);
    maxProjection = Math.max(maxProjection, projection);
  }
  return [minProjection, maxProjection];
};
const isSeparated = (minA, maxA, minB, maxB) => maxA < minB || maxB < minA;

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
const solvePenatration = (a, b, intersection) => {
  const { normal, depth } = intersection;
  const moveFactorA = a.invMass / (a.invMass + b.invMass);
  const moveFactorB = b.invMass / (a.invMass + b.invMass);
  scaleAndAddVec3(a.center, a.center, normal, depth * moveFactorA);
  a.setupTransformMatrix();
  a.updateBounds();
  if (depth * moveFactorA > 5e-3) {
    a.sleepCount = 0;
  }
  scaleAndAddVec3(b.center, b.center, normal, -depth * moveFactorB);
  b.setupTransformMatrix();
  b.updateBounds();
  if (depth * moveFactorB > 5e-3) {
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
const solvePenatrationContactPoint = (a, b, intersection, contactPointIndex) => {
  const { normal } = intersection;
  const contactPoint = intersection.allContactPoints[contactPointIndex];
  subtractVec3(rA, contactPoint, a.center);
  subtractVec3(rB, contactPoint, b.center);
  crossVec3(temp1, rA, a.angularVelocity);
  crossVec3(temp2, rB, b.angularVelocity);
  addVec3(relativeVelocity, b.velocity, temp2);
  subtractVec3(relativeVelocity, relativeVelocity, a.velocity);
  subtractVec3(relativeVelocity, relativeVelocity, temp1);
  if (dotVec3(relativeVelocity, normal) < 0) {
    return;
  }
  fromRotationTranslationMat4(tempRotation, a.rotation, origin);
  transposeMat4(tempRotationT, tempRotation);
  multiplyMat4(invInertiaA, tempRotation, a.invInertia);
  multiplyMat4(invInertiaA, invInertiaA, tempRotationT);
  fromRotationTranslationMat4(tempRotation, b.rotation, origin);
  transposeMat4(tempRotationT, tempRotation);
  multiplyMat4(invInertiaB, tempRotation, b.invInertia);
  multiplyMat4(invInertiaB, invInertiaB, tempRotationT);
  crossVec3(temp1, rA, normal);
  transformMat4Vec3(temp1Transformed, temp1, invInertiaA);
  const dotProductA = dotVec3(temp1Transformed, temp1);
  crossVec3(temp2, rB, normal);
  transformMat4Vec3(temp2Transformed, temp2, invInertiaB);
  const dotProductB = dotVec3(temp2Transformed, temp2);
  const restitution = Math.min(a.restitution, b.restitution);
  const j = -(1 + restitution) * dotVec3(relativeVelocity, normal) / (a.invMass + b.invMass + dotProductA + dotProductB);
  scaleVec3(impulse, normal, j);
  scaleAndAddVec3(nextVelocityA, nextVelocityA, impulse, -a.invMass);
  scaleAndAddVec3(nextVelocityB, nextVelocityB, impulse, b.invMass);
  crossVec3(temp1, rA, impulse);
  transformMat4Vec3(temp1Transformed, temp1, invInertiaA);
  addVec3(nextAngularVelocityA, nextAngularVelocityA, temp1Transformed);
  crossVec3(temp2, rB, impulse);
  transformMat4Vec3(temp2Transformed, temp2, invInertiaB);
  subtractVec3(nextAngularVelocityB, nextAngularVelocityB, temp2Transformed);
  scaleVec3(normalVelocity, normal, dotVec3(relativeVelocity, normal));
  subtractVec3(tangentVelocity, relativeVelocity, normalVelocity);
  const tangentSpeed = magnitudeVec3(tangentVelocity);
  if (tangentSpeed > EPSILON) {
    scaleVec3(tangentDirection, tangentVelocity, 1 / tangentSpeed);
    const coefficientOfFriction = Math.min(a.coefficientOfFriction, b.coefficientOfFriction);
    const minNormalForce = 9.8;
    const normalForceMagnitude = Math.max(Math.abs(j) / intersection.allContactPoints.length, minNormalForce);
    const frictionMagnitude = Math.min(coefficientOfFriction * normalForceMagnitude, tangentSpeed);
    scaleVec3(frictionImpulseVector, tangentDirection, -frictionMagnitude);
    {
      addFriction(nextVelocityA, frictionImpulseVector, a.invMass);
      addFriction(nextVelocityB, frictionImpulseVector, -b.invMass);
    }
    {
      crossVec3(angularFrictionA, rA, frictionImpulseVector);
      crossVec3(angularFrictionB, rB, frictionImpulseVector);
      transformMat4Vec3(angularFrictionA, angularFrictionA, a.invInertia);
      transformMat4Vec3(angularFrictionB, angularFrictionB, b.invInertia);
      addFriction(nextAngularVelocityA, angularFrictionA, 1);
      addFriction(nextAngularVelocityB, angularFrictionB, -1);
    }
  }
};
const addFriction = (out, delta, scale) => {
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

const MAX_COLLISION_CONTACTS = 16;
const createCollisionInfo = () => {
  return {
    depth: 0,
    normal: createVec3(),
    contactPoint: createVec3(),
    allContactPoints: createVec3Array(MAX_COLLISION_CONTACTS),
    numPoints: 0
  };
};
const tempCollisionInfo = createCollisionInfo();
const addCollisionContactPoint = (out, p) => {
  addVec3(out.contactPoint, out.contactPoint, p);
  copyVec3(out.allContactPoints[out.numPoints], p);
  out.numPoints++;
};
const detectCollision = (out, a, b) => {
  if (a instanceof Box && b instanceof Box) {
    return detectCollisionBoxBox(out, a, b);
  }
  return false;
};
const collisionDetection = (shapes, stepCount) => {
  for (let step = 0; step < stepCount; step++) {
    for (const shape of shapes) {
      if (!shape.noclip && !shape.static && shape.sleepCount < SLEEP_THRESHOLD) {
        shape.update();
      }
      shape.setupTransformMatrix();
      shape.updateBounds();
    }
    for (let i = 0; i < shapes.length; i++) {
      const shape1 = shapes[i];
      if (!shape1.noclip) {
        for (let j = i + 1; j < shapes.length; j++) {
          const shape2 = shapes[j];
          if (!shape2.noclip && (!shape1.static && shape1.sleepCount < SLEEP_THRESHOLD || !shape2.static && shape2.sleepCount < SLEEP_THRESHOLD) && shape1.broadphaseIntersects(shape2)) {
            if (detectCollision(tempCollisionInfo, shape1, shape2)) {
              solvePenatration(shape1, shape2, tempCollisionInfo);
            }
          }
        }
      }
    }
  }
  for (const shape of shapes) {
    if (!shape.static) {
      if (magnitudeVec3(shape.velocity) < 1.5 && magnitudeVec3(shape.angularVelocity) < 0.5) {
        shape.sleepCount++;
      }
    }
  }
};

const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
const symmetricRandom = () => Math.random() * 2 - 1;

const shapes = [];
const ground = new Box(STATIC_MASS, createVec3(100, 4, 100));
setVec3(ground.center, 0, -4, 0);
shapes.push(ground);
let time = 0;
let dt = 0;
const gameLoop = (now) => {
  now *= 1e-3;
  dt = Math.min(now - time, 1 / 30);
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
  const stepCount = clamp(Math.round(600 * dt), 1, 20);
  collisionDetection(shapes, stepCount);
  startFrame();
  const ground2 = drawLists[DYNAMIC_CUBES].addInstance(4282417216);
  scaleMat4(ground2, ground2, 100, 0.1, 100);
  const backWall = drawLists[DYNAMIC_CUBES].addInstance(4294492320);
  translateMat4(backWall, backWall, 0, 10, 50);
  scaleMat4(backWall, backWall, 100, 20, 0.1);
  for (const shape of shapes) {
    const m = drawLists[DYNAMIC_CUBES].addInstance(4286636256);
    multiplyMat4(m, m, shape.transformMatrix);
  }
  setVec3(camera.source, 0, 40, -50);
  setVec3(camera.lookAt, 0, 3, 0);
  lookAt(camera, camera.lookAt, Math.PI / 4);
  setVec3(lightSource.source, 20, 100, -40);
  setVec3(lightSource.lookAt, 0, 5, 0);
  lookAt(lightSource, lightSource.lookAt, 1);
  lightSource.ambientLight = 0.5;
  endFrame();
  requestAnimationFrame(gameLoop);
};
requestAnimationFrame(gameLoop);
