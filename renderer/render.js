// Render

Scene.render = (canvas) => {
  
  W.reset(canvas);
  W.light({x:.5,y:-.5,z:-.2});  // light
  W.camera({z:10});   // back up camera
  W.clearColor("#def");
  
  for(var i of Scene.b){
    W.sphere({n:i.id,x:i.p.x,y:i.p.y,z:i.p.z,size:i.r,s:1,b:"#88FFaaFF"});
  }

}

Scene.updateRender = () => {
  
  for(var i of Scene.b){
    W.move({n:i.id,x:i.p.x,y:i.p.y,z:i.p.z});
  }

}