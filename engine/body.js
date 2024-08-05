class Body {
  
  id; // name
  s;  // shape (0: NONE, 1: SPHERE, ...)
  p;  // position (DOMPoint, in world space)
  o;  // orientation (DOMMatrix)
  c;  // center of mass (DOMPoint, in model space)
  lv = new DOMPoint; // linear velocity
  im; // inverse mass (0 = immovable)
  
  constructor(id, s = 0, p = new DOMPoint, o = new DOMMatrix, im = 1, c = new DOMPoint){
    this.id = id;
    this.s = s;
    this.p = p;
    this.o = o;
    this.c = c;
    this.im = im;
  }
  
  // Center of mass in world space
  cWorld(){
    return add(this.p, this.o.transformPoint(this.c));
  }
  
  // Center of mass if mode space
  cModel(){
    return this.c;
  }
  
  worldToBody(p) {
    return (this.o.inverse()).transformPoint(sub(p, this.cWorld()));
  }
  
  bodyToWorld(p) {
    return add(this.cWorld(), this.o.transformPoint(p));
  }
  
  applyImpulseLinear(i) {
    if(this.im){
      this.lv = add(this.lv, scale(i, this.im));
    }
  }
  
}

class Sphere extends Body {
  
  r; // radius
  
  constructor(id, p, o, im, r = 1){
    console.log(id);
    super(id, 1, p, o, im);
    this.r = r;
  }
  
}