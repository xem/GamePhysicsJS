class RigidBody {
  position; // Vector3
  orientation; // Quaternion
  velocity; // Vector3
  inverseMass; // float
  linearDamping; // float
  angularDamping; // float
  iverseInertiaTensor; // Matrix3
  iverseInertiaTensorWorld; // Matrix3
  rotation; // angular velocity, Vector3
  transformMatrix; // Matrix4, derived from position and orientation once per frame
  forceAccum; // Vector3
  torqueAccum; // Vector3
  isAwake; // boolean
  
  constructor(position, orientation, velocity, inverseMass, linearDamping, angularDamping){
    this.position = position;
    this.orientation = orientation;
    this.velocity = velocity;
    this.inverseMass = inverseMass;
    this.linearDamping = linearDamping;
    this.angularDamping = angularDamping;
    this.iverseInertiaTensor = new Matrix3();
    this.iverseInertiaTensorWorld = new Matrix3();
    this.rotation = new Vector3();
    this.transformMatrix = new Matrix4();
    this.forceAccum = new Vector3();
    this.torqueAccum = new Vector3();
    this.isAwake = true;
  }

  setInertiaTensor(inertiaTensor){
    this.iverseInertiaTensor = inertiaTensor.inverse();
  }
  
  transformInertiaTensor(q, iitBody, rotmat){
    var t4 = rotmat.data[0]*iitBody.data[0]+ rotmat.data[1]*iitBody.data[3]+ rotmat.data[2]*iitBody.data[6];
    var t9 = rotmat.data[0]*iitBody.data[1]+ rotmat.data[1]*iitBody.data[4]+ rotmat.data[2]*iitBody.data[7];
    var t14 = rotmat.data[0]*iitBody.data[2]+ rotmat.data[1]*iitBody.data[5]+ rotmat.data[2]*iitBody.data[8];
    var t28 = rotmat.data[4]*iitBody.data[0]+ rotmat.data[5]*iitBody.data[3]+ rotmat.data[6]*iitBody.data[6];
    var t33 = rotmat.data[4]*iitBody.data[1]+ rotmat.data[5]*iitBody.data[4]+ rotmat.data[6]*iitBody.data[7];
    var t38 = rotmat.data[4]*iitBody.data[2]+ rotmat.data[5]*iitBody.data[5]+ rotmat.data[6]*iitBody.data[8];
    var t52 = rotmat.data[8]*iitBody.data[0]+ rotmat.data[9]*iitBody.data[3]+ rotmat.data[10]*iitBody.data[6];
    var t57 = rotmat.data[8]*iitBody.data[1]+ rotmat.data[9]*iitBody.data[4]+ rotmat.data[10]*iitBody.data[7];
    var t62 = rotmat.data[8]*iitBody.data[2]+ rotmat.data[9]*iitBody.data[5]+ rotmat.data[10]*iitBody.data[8];
    this.iverseInertiaTensorWorld.data[0] = t4*rotmat.data[0]+ t9*rotmat.data[1]+ t14*rotmat.data[2];
    this.iverseInertiaTensorWorld.data[1] = t4*rotmat.data[4]+ t9*rotmat.data[5]+ t14*rotmat.data[6];
    this.iverseInertiaTensorWorld.data[2] = t4*rotmat.data[8]+ t9*rotmat.data[9]+ t14*rotmat.data[10];
    this.iverseInertiaTensorWorld.data[3] = t28*rotmat.data[0]+ t33*rotmat.data[1]+ t38*rotmat.data[2];
    this.iverseInertiaTensorWorld.data[4] = t28*rotmat.data[4]+ t33*rotmat.data[5]+ t38*rotmat.data[6];
    this.iverseInertiaTensorWorld.data[5] = t28*rotmat.data[8]+ t33*rotmat.data[9]+ t38*rotmat.data[10];
    this.iverseInertiaTensorWorld.data[6] = t52*rotmat.data[0]+ t57*rotmat.data[1]+ t62*rotmat.data[2];
    this.iverseInertiaTensorWorld.data[7] = t52*rotmat.data[4]+ t57*rotmat.data[5]+ t62*rotmat.data[6];
    this.iverseInertiaTensorWorld.data[8] = t52*rotmat.data[8]+ t57*rotmat.data[9]+ t62*rotmat.data[10];
  }
  
  calculateDerivedData(){
    this.orientation.normalize();
    this.calculateTransformMatrix(this.position, this.orientation);
    this.transformInertiaTensor(this.orientation, this.inverseInertiaTensor, this.transformMatrix);
  }
  
  calculateTransformMatrix(position, orientation){
    this.transformMatrix.data[0] = 1-2*orientation.j*orientation.j - 2*orientation.k*orientation.k;
    this.transformMatrix.data[1] = 2*orientation.i*orientation.j - 2*orientation.r*orientation.k;
    this.transformMatrix.data[2] = 2*orientation.i*orientation.k + 2*orientation.r*orientation.j;
    this.transformMatrix.data[3] = position.x; transformMatrix.data[4] = 2*orientation.i*orientation.j + 2*orientation.r*orientation.k; 
    this.transformMatrix.data[5] = 1-2*orientation.i*orientation.i - 2*orientation.k*orientation.k;
    this.transformMatrix.data[6] = 2*orientation.j*orientation.k - 2*orientation.r*orientation.i;
    this.transformMatrix.data[7] = position.y;
    this.transformMatrix.data[8] = 2*orientation.i*orientation.k - 2*orientation.r*orientation.j;
    this.transformMatrix.data[9] = 2*orientation.j*orientation.k + 2*orientation.r*orientation.i;
    this.transformMatrix.data[10] = 1-2*orientation.i*orientation.i - 2*orientation.j*orientation.j;
    this.transformMatrix.data[11] = position.z;
  }
  
  addForce(force){
    this.forceAccum.add(force); // Vector3
    this.isAwake = true;
  }
  
  addForceAtBodyPoint(force, point){
    var pt = getPointInWorldSpace(point);
    this.addForceAtPoint(force, pt);
    this.isAwake = true;
  }
  
  addForceAtBodyPoint(force, point){
    var pt = point.clone();
    pt.sub(position);
    this.forceAccum.add(force);
    this.torqueAccum.add(vectorProduct(pt, force));
    this.isAwake = true;
  }
  
  clearAccumulators(){
    this.forceAccum = new Vector3();
    this.torqueAccum = new Vector3();
  }
  
  integrate(duration){
  
    // Calculate linear acceleration from force inputs
    var lastFrameAcceleration = acceleration.clone();
    lastFrameAcceleration.addScaledVector(this.forceAccum, this.inverseMass);
    
    // Calculate angular acceleration from torque inputs
    var angularAcceleration = this.inverseInertiaTensorWorld.transform(this.torqueAccum);
    
    // Adjust velocities
    
    // Update linear velocity from both acceleration and impulse
    this.velocity.addScaledVector(lastFrameAcceleration, duration);
    
    // Update angular velocity from both acceleration and impulse
    this.rotation.addScaledVector(angularAcceleration, duration);
    
    // Impose drag
    this.velocity.scale(this.linearDamping ** duration);
    this.rotation.scale(angularDamping ** duration);
    
    // Adjust positions
    
    // Update linear position
    this.position.addScaledVector(this.velocity, duration);
    
    // Update angular position
    this.orientation.addScaledVector(this.rotation, duration);
    
    // Normalize the orientation, and update the matrices with the new position and orientation
    this.calculateDerivedData();
    
    // Clear accumulators
    this.clearAccumulators();
  }
}

class World {

  RigidBodies;
  
  constructor(RigidBodies){
    this.RigidBodies = RigidBodies;
  }
  
  startFrame(){
    for(var b of this.RigidBodies){
      b.clearAccumulators();
      b.calculateDerivedData();
    }
  }
  
  integrate(duration){
    for(var b of this.RigidBodies){
      b.integrate(duration);
    }
  }
  
  runPhysics(duration){
  
    // TODO: apply forces
    
    this.integrate(duration);
  }
}