# js13k-3dphysics-for-xem

Live demo: <https://js13k-3dphysics-for-xem.vercel.app/>

## Usage

Install:

```bash
npm i
```

Run dev server:

```bash
npm run dev
```

By default, the dev server will be available at <http://localhost:5173/>

Build:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

By default, the preview server will be available at <http://localhost:4173/>

## Status and known issues

* Currently only supports boxes
   * Spheres and heightfields should be possible without too much additional code
* Performance has a lot of room for improvement
   * For example, consider Rapier's pyramid demo: https://rapier.rs/demos3d/index.html
      * When boxes are awake, each physics step takes 8 ms
      * When boxes are asleep, each step takes 1 ms
   * I've tried to make the same pyramid demo with my toy engine
      * It won't even run with the same number of boxes
      * With 25% the number of boxes, when boxes are awake, each step takes 50+ ms
      * It doesn't truly stabilize, it kinda wobbles
* The biggest performance opportunity is keeping track of collisions
   * Currently, the engine is "stateless", so collisions are recalculated every step
   * Most 3d physics engines use a "stateful" system, where collisions are tracked and reused across steps
   * This would be a huge performance win, and necessary for 1000's of colliding objects
   * I don't know how much additional code would be required
* Currently only supports SAT for collision detection
   * I looked into GJK, but i think the code would be much bigger
* "sleeping" is pretty naive - could be much better
* Gravity is hardcoded - at minimum, this should be a configurable global, but ideally it would be per shape/body

## License

MIT
