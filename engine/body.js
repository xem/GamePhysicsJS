class Body {
  
  s;  // shape (0: NONE, 1: SPHERE, ...)
  p;  // position (DOMPoint, in world space)
  o;  // orientation (DOMMatrix)
  c;  // center of mass (DOMPoint, in model space)
  lr; // linear velocity (DOMPoint)
  
  constructor(s = 0, p = new DOMPoint, o = new DOMMatrix, c = new DOMPoint){
    this.s = s;
    this.p = p;
    this.o = o;
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
  
}

class Sphere extends Body {
  
  r; // radius
  
  constructor(p, o, r = 1){
    super(1, p, o);
    this.r = r;
  }
  
}