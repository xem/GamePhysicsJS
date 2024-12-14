class BoundingSphere {
  position;
  radius;
  
  constructor(position, radius){
    this.position = position;
    this.radius = radius;
  }
}

class BoundingBox {
  position;
  halfSize;
  transform;
  
  constructor(position, halfSize, transform){
    this.position = position;
    this.halfSize = halfSize;
    this.transform = transform;
  }
}

class Plane {
  offset;
  normal;
  
  constructor(offset, normal){
    this.offset = offset;
    this.normal = normal;
  }
}