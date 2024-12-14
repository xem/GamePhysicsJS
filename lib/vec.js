class Vector3 {
  x;
  y;
  z;
  
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  // invert
  invert(){
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }
  
  // magnitude
  magnitude(){
    return Math.hypot(this.x, this.y, this.z);
  }
  
  // magnitude squared (faster for comparing two vectors)
  squareMagnitude(){
    return this.x ** 2 + this.y ** 2 + this.z ** 2;
  }
  
  // normalize
  normalize(){
    var l = this.magnitude();
    if(l > 0) this.scale(1/l);
    return this;
  }
  
  // scale
  scale(s){
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  
  // add
  add(v){
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  // subtract
  sub(v){
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  // add a scaled vector
  addScaled(v, s){
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
  }

  // component product
  componentProduct(v){
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }

  // scalar (dot) product (operator used in the book: *)
  scalarProduct(v){
    return this.x * v.x + this.y*v.y + this.z*v.z;
  }

  // vector (cross) product (operator used in the book: %)
  vectorProduct(v){
    return Vector3(this.y*b.z - this.z*b.y,
                   this.z*b.x - this.x*b.z,
                   this.x*b.y - this.y*b.x);
  }
  
  // Clone
  clone(){
    return new Vector3(this.x, this.y, this.z);
  }
}