// Body
// ====
cnt = 0; // debug

// Body
class Body {
  id; // unique identifier
  s;  // shape (1: SPHERE, 2: box...)
  p;  // position (DOMPoint, in world space)
  o;  // orientation (DOMMatrix)
  c;  // center of mass (DOMPoint, in model space)
  im; // inverse mass (0 = immovable)
  lv; // linear velocity (DOMPoint)
  av; // angular velocity (DOMPoint)
  e;  // elasticity (number)
  f;  // friction (number)
  
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
    this.f = params.f ?? 0;
  }
  
  // Center of mass in world space
  cWorld(){
    return add(this.p, this.o.transformPoint(this.c));
  }
  
  // Center of mass in model space
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
      this.av = this.inverseInertiaTensorWorld().transformPoint(i);
      var max = 30; // max: 30 rad/s (modifiable)
      if(mags(this.av) > max ** 2){
        this.av = scale(norm(this.av), max);
      }
    }
  }
  
  // Apply impulse on a specific point (defined in world space)
  applyImpulse(p, i){
    if(this.im){
      this.applyImpulseLinear(i);
      this.applyImpulseAngular(cross(sub(p, this.cWorld()), i));
    }
  }
  
  // Inverse inertia tensor in model space
  inverseInertiaTensorModel(){
    return this.inverseInertiaTensor().scale(this.im,this.im,this.im);
  }
  
  // Inverse inertia tensor in world space
  inverseInertiaTensorWorld(){
    return this.o.multiply(this.inverseInertiaTensor().scale(this.im,this.im,this.im)).multiply(transpose(this.o));
  }

  // Update position and orientation
  update(dt){
    if(this.im){
      // Position
      this.p = add(this.p, scale(this.lv, dt));
      
      // Orientation
      // Convert the angular velocity, around the center of mass, relatively to the model position 
      var pCM = this.cWorld(); // center of mass in world space
      var ctop = sub(this.p, pCM);
      
      // Compute torque
      var iT = this.o.multiply(this.inertiaTensor()).multiply(transpose(this.o));
      var alpha = iT.inverse().transformPoint(cross(this.av, iT.transformPoint(this.av)));
      this.av = add(this.av, scale(alpha, dt));
      
      // Update orientation
      var dA = scale(this.av, dt);
      this.o = this.o.rotateAxisAngle(dA.x, dA.y, dA.z, mag(dA));
      
      // New model position
      this.p = add(pCM, this.o.transformPoint(ctop));
    }
  }
}

// Sphere
class Sphere extends Body {
  r; // radius
  
  constructor(params){
    super(params);
    this.r = params.r ?? 1;
  }
  
  // Inertia tensor (2/5 * r² on the diagonals)
  inertiaTensor(){
    var m = new DOMMatrix;
    m.m11 = m.m22 = m.m33 = 2 * (this.r ** 2) / 5;
    return m;
  }
  
  // Inverse inertia tensor
  inverseInertiaTensor(){
    return this.inertiaTensor().inverse();
  }
}