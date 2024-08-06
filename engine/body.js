// Body
// ====

// Body
class Body {
  id; // unique identifier
  s;  // shape (1: SPHERE, 2: box...)
  p;  // position (DOMPoint, in world space)
  o;  // orientation (DOMMatrix)
  c;  // center of mass (DOMPoint, in model space)
  im; // inverse mass (0 = immovable)
  lv; // linear velocity
  av; // angular velocity
  e;  // elasticity
  
  constructor(params){
    this.id = params.id ?? "b" + (scene.b.length);
    this.s = params.s ?? 0;
    this.p = params.p ?? new DOMPoint;
    this.o = params.o ?? new DOMMatrix;
    this.c = params.c ?? new DOMPoint;
    this.im = params.im ?? 1;
    this.lv = params.lv ?? new DOMPoint;
    this.av = params.lv ?? new DOMPoint;
    this.e = params.e ?? 1;
  }
  
  // Center of mass in world space
  cWorld(){
    return add(this.p, this.o.transformPoint(this.c));
  }
  
  // Center of mass if model space
  cModel(){
    return this.c;
  }

  // World space to model space
  worldToModel(p){
    return (this.o.inverse()).transformPoint(sub(p, this.cWorld()));
  }

  // Model space to world space
  modelToWorld(p){
    return add(this.cWorld(), this.o.transformPoint(p));
  }
  
  // Apply impulse (linear)
  applyImpulseLinear(i){
    if(this.im){
      this.lv = add(this.lv, scale(i, this.im));
    }
  }
  
  // Apply impulse (angular)
  applyImpulseAngular(i){
    if(this.im){
      this.av = inverseInertiaTensorWorld().transformPoint(impulse);
      var max = 30; // max: 30 rad/s (modifiable)
      if(mags(this.av) > max ** 2){
        this.av = scale(norm(this.av), max);
      }
      
    }
  }
  
  // Inverse inertia tensor in model space
  inverseInertiaTensorModel(){
    return inverseInertiaTensor();
  }
  
  // Inverse inertia tensor in world space
  inverseInertiaTensorWorld(){
    return this.o.multiply(inverseInertiaTensor()).multiply(transpose(this.o));
  }

}

// Sphere
class Sphere extends Body {
  r; // radius
  
  constructor(params){
    super(params);
    this.r = params.r ?? 1;
  }
  
  inverseInertiaTensor(){
    var m = new DOMMatrix;
    m.m11 = m.m22 = m.m33 = 2 * (1 / this.im) * (this.radius ** 2) / 5;
    return m.inverse();
  }
}