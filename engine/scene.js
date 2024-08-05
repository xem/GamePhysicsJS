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
      for(var j = i+1; j < Scene.b.length; j++){
        if(Scene.b[i].im != 0 || Scene.b[j].im != 0){      
          if(contact = collisionSphereSphere(Scene.b[i], Scene.b[j])){
            resolve(contact);
          }
        }
      }
    }
    
    // Update position
    for(i of Scene.b){
      i.p = add(i.p, scale(i.lv, dt));
    }
  },
  
  // Rendering (exampe of implementation in renderer/render.js)
  render: () => {},
  updateRender : () => {} 

}

// Resolve a contact
resolve = contact => {
  
  // Elasticity
  var e = contact.a.e * contact.b.e;
  
  // Collision impulse
  var vj = scale(contact.n, -2 * e * dot(sub(contact.a.lv, contact.b.lv), contact.n) / (contact.a.im + contact.b.im));
  contact.a.applyImpulseLinear(vj);
  contact.b.applyImpulseLinear(scale(vj, -1));
  
  // Move the objects outside of each other
  var ds = sub(contact.pb, contact.pa); 
  contact.a.p = add(contact.a.p, scale(ds, contact.a.im / (contact.a.im + contact.b.im)));
  contact.b.p = add(contact.b.p, scale(ds, contact.b.im / (contact.a.im + contact.b.im)));
}