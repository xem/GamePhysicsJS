# math

This is a heavily modified version of [glMatrix](https://glmatrix.net/), a high performance matrix and vector library for JavaScript. The original library was created by [Brandon Jones](https://toji.dev/).

Key changes:

- Stripped down to vec3, vec4, mat4, and quat
- Renamed all functions to be globally unique, typically by appending type name (i.e., `create()` becomes `createVec3()`)
- Converted from right-handed to left-handed coordinate system (e.g., `crossVec3()`)
- Converted `function` to `const` and lambda expressions for better compression
