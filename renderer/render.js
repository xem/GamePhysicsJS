// Render

Scene.render = (canvas) => {
  
  W.reset(canvas);
  W.camera({z:3}); // back up camera
  W.clearColor("#def");
  
  for(var i of Scene.b){
    W.sphere({n:"s1",x:i.p.x,y:i.p.y,z:i.p.z,size:i.r,s:1,b:"#88FFaaFF"});
  }

}