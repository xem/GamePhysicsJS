class Matrix3 {
  data; // 9 elements
  
  constructor(data = [1, 0, 0, 0, 1, 0, 0, 0, 1]){
    this.data = data;
  }
  
  // Transform a 3D vector
  transform(v){
    return new Vector3(
      v.x*this.data[0] + v.y*this.data[1] + v.z*this.data[2],
      v.x*this.data[3] + v.y*this.data[4] + v.z*this.data[5],
      v.x*this.data[6] + v.y*this.data[7] + v.z*this.data[8],
    );
  }
  
  // Multiply with another Matrix3
  multiply(o){
    return Matrix3([
      this.data[0]*o.data[0] + this.data[1]*o.data[3] + this.data[2]*o.data[6],
      this.data[0]*o.data[1] + this.data[1]*o.data[4] + this.data[2]*o.data[7],
      this.data[0]*o.data[2] + this.data[1]*o.data[5] + this.data[2]*o.data[8],
      this.data[3]*o.data[0] + this.data[4]*o.data[3] + this.data[5]*o.data[6],
      this.data[3]*o.data[1] + this.data[4]*o.data[4] + this.data[5]*o.data[7],
      this.data[3]*o.data[2] + this.data[4]*o.data[5] + this.data[5]*o.data[8],
      this.data[6]*o.data[0] + this.data[7]*o.data[3] + this.data[8]*o.data[6],
      this.data[6]*o.data[1] + this.data[7]*o.data[4] + this.data[8]*o.data[7],
      this.data[6]*o.data[2] + this.data[7]*o.data[5] + this.data[8]*o.data[8]
    ]);
  }
}

class Matrix4 {
  data; // 12 elements: 3x4 + (0,0,0,1) on the last row
  
  constructor(data = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]){
    this.data = data;
  }
  
  // Transform a 3D vector
  transform(v){
    return new Vector3(
      v.x*this.data[0] + v.y*this.data[1] + v.z*this.data[2] + this.data[3],
      v.x*this.data[4] + v.y*this.data[5] + v.z*this.data[6] + this.data[7],
      v.x*this.data[8] + v.y*this.data[9] + v.z*this.data[10] + this.data[11],
    );
  }
  
  // Multiply with another Matrix4
  multiply(o){
    return new Matrix4([
      o.data[0]*this.data[0] + o.data[4]*this.data[1] + o.data[8]*this.data[2],
      o.data[1]*this.data[0] + o.data[5]*this.data[1] + o.data[9]*this.data[2],
      o.data[2]*this.data[0] + o.data[6]*this.data[1] + o.data[10]*this.data[2],
      o.data[3]*this.data[0] + o.data[7]*this.data[1] + o.data[11]*this.data[2] + this.data[3],
      o.data[0]*this.data[4] + o.data[4]*this.data[5] + o.data[8]*this.data[6],
      o.data[1]*this.data[4] + o.data[5]*this.data[5] + o.data[9]*this.data[6],
      o.data[2]*this.data[4] + o.data[6]*this.data[5] + o.data[10]*this.data[6],
      o.data[3]*this.data[4] + o.data[7]*this.data[5] + o.data[11]*this.data[6] + this.data[7],
      o.data[0]*this.data[8] + o.data[4]*this.data[9] + o.data[8]*this.data[10],
      o.data[1]*this.data[8] + o.data[5]*this.data[9] + o.data[9]*this.data[10],
      o.data[2]*this.data[8] + o.data[6]*this.data[9] + o.data[10]*this.data[10],
      o.data[3]*this.data[8] + o.data[7]*this.data[9] + o.data[11]*this.data[10] + this.data[11]
    ]);
  }
  
}