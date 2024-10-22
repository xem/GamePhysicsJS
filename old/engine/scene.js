// Scene
// =====

Scene = {
  
  b: [], // list of bodies
  
  // Update
  update: (dt) => {
    var i, j, contat;
  
    // Apply gravity as an impulse
    for(var i of Scene.b){     
      i.applyImpulseLinear(scale(new DOMPoint(0, -10, 0), dt / i.im));
    }

    // Check collisions
    for(i = 0; i < Scene.b.length; i++){
      for(var j = i + 1; j < Scene.b.length; j++){
        if(Scene.b[i].im != 0 || Scene.b[j].im != 0){      
          if(contact = collisionSphereSphere(Scene.b[i], Scene.b[j])){
            resolve(contact);
          }
        }
      }
    }
    
    // Update body position and rotation
    for(i of Scene.b){
      i.update(dt);
    }
  },
  
  // Render (optional implementation in renderer/render.js)
  render: () => {},

}

var logs = 0;

// Resolve a contact
resolve = contact => {
  
  // Elasticity
  var e = contact.a.e * contact.b.e;
  
  // Inertia tensors in world space
  var iwa = contact.a.inverseInertiaTensorWorld();
  var iwb = contact.b.inverseInertiaTensorWorld();
  
  if(logs < 5) console.log(logs++, {e, iwa, iwb});
  
  // Centers of masses in world space
  var ra = sub(contact.pa, contact.a.cWorld());
  var rb = sub(contact.pb, contact.b.cWorld());
  
  // Angular impulses
  var aja = cross(iwa.transformPoint(cross(ra, contact.n)), ra);
  var ajb = cross(iwb.transformPoint(cross(rb, contact.n)), rb);
  var af = dot(add(aja, ajb), contact.n);
  
  // Get world space velocity of motion and rotation
  var va = add(contact.a.lv, cross(contact.a.av, ra));
  var vb = add(contact.b.lv, cross(contact.b.av, rb));
  
  // Collision impulse
  var vab = sub(va, vb);
  var ij = (1 + e) * dot(vab, contact.n) / (contact.a.im + contact.b.im + af);
  var vij = scale(contact.n, ij);
  console.log(vij);
  contact.a.applyImpulse(contact.pa, scale(vij, -1));
  contact.b.applyImpulse(contact.pb, vij);
  
  // Compute friction impulse
  var f = contact.a.f * contact.b.f;
  var vn = scale(contact.n, dot(contact.n, vab));
  var vt = sub(vab, vn);
  var rvt = norm(vt);
  var ia = cross(contact.a.inverseInertiaTensorWorld().transformPoint(cross(ra, rvt)), ra);
  var ib = cross(contact.b.inverseInertiaTensorWorld().transformPoint(cross(rb, rvt)), rb);
  var ii = dot(add(ia, ib), rvt);
  var rm = 1 / (contact.a.im + contact.b.im + ii);
  var fi = scale(vt, rm * f);
  contact.a.applyImpulse(contact.pa, scale(fi, -1));
  contact.b.applyImpulse(contact.pb, fi);
  
  // Move the objects outside of each other
  var ta = contact.a.im / (contact.a.im + contact.b.im);
  var tb = contact.b.im / (contact.a.im + contact.b.im);
  var ds = sub(contact.pb, contact.pa);
  contact.a.p = add(contact.a.p, scale(ds, ta));
  contact.b.p = sub(contact.b.p, scale(ds, tb));
}