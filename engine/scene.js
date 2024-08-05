// Scene

Scene = {
  
  b: [], // list of bodies
  
  // Update
  update: dt => {
    
      // For each body
      for(var i of Scene.b){
       
        // Apply gravity as an impulse
        i.applyImpulseLinear(scale(new DOMPoint(0, -10, 0), dt / i.im));
      }
      
      // For each body
      for(i of Scene.b){
        
        // Update position
        //console.log(i.p, i.lv, dt);
        i.p = add(i.p, scale(i.lv, dt));
      }
      
  },
  
  // Rendering (exampe of implementation in renderer/render.js)
  render: () => {},
  updateRender : () => {} 

}