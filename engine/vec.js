// Vector
// ======

// Addition
add = (u, v) => new DOMPoint(u.x + v.x, u.y + v.y, u.z + v.z, u.w);

// Subtraction
sub = (u, v) => new DOMPoint(u.x - v.x, u.y - v.y, u.z - v.z, u.w);

// Component-wise multiplication
mul = (u, v) => new DOMPoint(u.x * v.x, u.y * v.y, u.z * v.z, u.w);

// Scaling (s is a number)
scale = (u, s) => new DOMPoint(u.x * s, u.y * s, u.z * s, u.w);

// Dot product
dot = (u, v) => u.x * v.x + u.y * v.y + u.z * v.z;

// Magnitude / magnitude squared
mag = v => Math.sqrt(dot(v, v));
mags = v => dot(v, v);

// Normalize
norm = v => scale(v, 1 / mag(v));

// Cross product
cross = (u, v) => new DOMPoint(
  u.y * v.z - u.z * v.y,
  u.x * v.z - u.z * v.x,
  u.x * v.y - u.y * v.x,
  0
);