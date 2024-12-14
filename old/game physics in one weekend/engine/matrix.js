// Matrix
// ======

transpose = m => {
  return new DOMMatrix([
    m.m11, m.m12, m.m13, m.m14,
    m.m21, m.m22, m.m23, m.m24,
    m.m31, m.m32, m.m33, m.m34,
    m.m41, m.m42, m.m43, m.m44,
  ]);
}