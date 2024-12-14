// Collision
// =========

// Sphere-sphere collision

collisionSphereSphere = (a, b) => {
  
  // Vector from a to b
  var ab = sub(b.p, a.p);
  
  // If the spheres collide
  if(mags(ab) < (a.r + b.r) ** 2){
    
    // normal
    ab = norm(ab);
    
    // Contact
    return {
      n: ab, // collision normal (from a to b)
      a,  // body a
      b,  // body b
      pa: add(a.p, scale(ab, a.r)), // collision point on a, in world space
      pb: sub(b.p, scale(ab, b.r)), // collision point on b, in world space
    };
  }
  return false;
}