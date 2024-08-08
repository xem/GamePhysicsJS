// Render
// ======

// Scene is initialized
Scene.init = 0;

// Render
Scene.render = (canvas) => {
  
  // Init scene
  if(!Scene.init){
    W.reset(canvas);
    W.light({x:.5,y:-.5,z:-.2});  // light
    W.camera({z:10});   // back up camera
    W.clearColor("#def");
    Scene.init = 1;
  }
  
  // Render spheres
  for(var i of Scene.b){
    
    // Create sphere 
    if(!(W.next[i.id])){
      
      // Ball
      if(i.id == "ball"){
        W.sphere({n:i.id,x:i.p.x,y:i.p.y,z:i.p.z,size:i.r,s:1,ry:100,t:ball});
      }
      
      // Ground
      else {
        W.sphere({n:i.id,x:i.p.x,y:i.p.y,z:i.p.z,size:i.r,s:1,b:"#88FFaaFF"});
      }
    }
    
    // Move sphere
    else {
      W.move({n:i.id,x:i.p.x,y:i.p.y,z:i.p.z});
    }
  }
}