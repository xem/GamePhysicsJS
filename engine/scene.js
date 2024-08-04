// Scene

Scene = {
  
  b: [], // list of bodies
  
  // Update
  update: dt => {
    
      // Update linear velocity with gravity (~10 m/s²)
      for(var i of Scene.b){
        i.lv = add(i.lv, scale(new DOMPoint(0,-10,0), dt));
      }
      
      // Update position with linear velocity
      for(i of Scene.b){
        i.p = add(i.p, scale(i.lr, dt));
      }
      
  },
  
  // Render
  render: () => {} // implemented in renderer/render.js (optional)

}