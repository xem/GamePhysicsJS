CollisionDetector = {

  sphereAndSphere(one, two){
    
    // Collision data
    var data = { collision: false, contacts: [{}] };
  
    // Make sure we have contacts
    //if(data.contactsLeft <= 0) return 0;
    
    // Cache the sphere positions
    var positionOne = one.position.clone();
    var positionTwo = two.position.clone();
    
    // Find the vector between the objects
    var midline = positionTwo.clone().sub(positionOne);
    var size = midline.magnitude();
    
    // See if it is large enough
    if(size <= 0 || size >= one.radius + two.radius){
      return data;
    }
    
    // Create the contact
    data.collision = true;
    data.contacts[0].contactNormal = midline.scale(1/size);
    data.contacts[0].contactPoint = positionOne.addScaled(midline, .5);
    data.contacts[0].penetration = (one.radius + two.radius - size);
    return data;
  },
  
  sphereAndHalfSpace(sphere, plane){
    
    // Collision data
    var data = { collision: false, contacts: [{}] };

    // Make sure we have contacts
    //if (data.contactsLeft <= 0) return 0;
    
    // Cache the sphere position
    var position = sphere.position.clone();
    
    // Find the distance from the plane
    var ballDistance = plane.normal.scalarProduct(position) -
    sphere.radius - plane.offset;
    
    // Exit if not touching
    if (ballDistance >= 0) return data;
    
    // Create the contact
    data.collision = true;
    data.contacts[0].contactNormal = plane.normal.clone();
    data.contacts[0].penetration = -ballDistance;
    data.contacts[0].contactPoint = position.addScaled(plane.normal, -(ballDistance + sphere.radius));
    return data;
  },
  
  boxAndSphere(box, sphere){
    
    // Collision data
    var data = { collision: false, contacts: [{}] };
    
    // Transform the centre of the sphere into box coordinates
    var centre = sphere.position.clone();
    var relCentre = box.transform.transformInverse(centre);

    // Early out check to see if we can exclude the contact
    if(
      Math.abs(relCentre.x) - sphere.radius > box.halfSize.x ||
      Math.abs(relCentre.y) - sphere.radius > box.halfSize.y ||
      Math.abs(relCentre.z) - sphere.radius > box.halfSize.z
    ){
      return data;
    }

    var closestPt = new Vector3(0,0,0);
    var dist;

    // Clamp each coordinate to the box
    dist = relCentre.x;
    if(dist > box.halfSize.x) dist = box.halfSize.x;
    if(dist &lt; -box.halfSize.x) dist = -box.halfSize.x;
    closestPt.x = dist;

    dist = relCentre.y;
    if(dist > box.halfSize.y) dist = box.halfSize.y;
    if(dist &lt; -box.halfSize.y) dist = -box.halfSize.y;
    closestPt.y = dist;

    dist = relCentre.z;
    if(dist > box.halfSize.z) dist = box.halfSize.z;
    if(dist &lt; -box.halfSize.z) dist = -box.halfSize.z;
    closestPt.z = dist;

    // Check we're in contact
    dist = closestPt.sub(relCentre).squareMagnitude();
    if(dist > sphere.radius ** 2) return 0;

    // Compile the contact
    var closestPtWorld = box.transform.transform(closestPt);
    data.collision = true;
    data.contacts[0].contactNormal = closestPtWorld.clone().sub(centre);
    data.contacts[0].contactNormal.normalise();
    data.contacts[0].contactPoint = closestPtWorld;
    data.contacts[0].penetration = sphere.radius - Math.sqrt(dist);
    return data;
  }
}