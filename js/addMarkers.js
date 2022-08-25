AFRAME.registerComponent("create-markers", {
  
init:async function(){
  var scene=document.querySelector("#main-scene")
  var dishes = await this.getDishes()
    dishes.map(dish => {
      var marker = document.createElement("a-marker");   
      marker.setAttribute("id", dish.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", dish.marker_pattern_url);

      //set the markerhandler component
      marker.setAttribute("markerhandler", {});
      scene.appendChild(marker);

      // Adding 3D model to scene
      var model = document.createElement("a-entity");    
     
      model.setAttribute("id", `model-${dish.id}`);
      model.setAttribute("position", dish.model_geometry.position);
      model.setAttribute("scale", dish.model_geometry.scale);
      model.setAttribute("gltf-model", `url(${dish.model_url})`);
      model.setAttribute("visible",false)
      marker.appendChild(model);
// "math" + model
// `math${model}`
      
      var plane = document.createElement("a-plane");    
     
    plane.setAttribute("id", `plane-${dish.id}`);
      plane.setAttribute("position", { x: 1, y: 0, z: 0});
      plane.setAttribute("rotation", { x: -90, y: 0, z: 0});
      plane.setAttribute("width",1);
      plane.setAttribute("height",2 );
      plane.setAttribute("visible",false)
      marker.appendChild(plane);

      var title = document.createElement("a-entity");    
     
      title.setAttribute("id", `title-${dish.id}`);
      title.setAttribute("position", { x: 0, y: 0.8, z: 0});
      title.setAttribute("rotation", { x: 0, y: 0, z: 0});
      title.setAttribute("visible",false)
      title.setAttribute("text",{ color: "black",
      width: 1.8,
      height: 1,
      align: "center",value:dish.dish_name});

      plane.appendChild(title); 

      var ingredients = document.createElement("a-entity");    
     
      ingredients.setAttribute("id", `ingredients-${dish.id}`);
      ingredients.setAttribute("position", { x: 0, y: 0.2, z: 0});
      ingredients.setAttribute("rotation", { x: 0, y: 0, z: 0});
      ingredients.setAttribute("visible",false)
      ingredients.setAttribute("text",{ color: "black",
      width: 1.8,
      align: "center",value:dish.ingredients.join("\n\n")});
      
      plane.appendChild(ingredients); 

      var price = document.createElement("a-entity");    
     
      price.setAttribute("id", `price-${dish.id}`);
      price.setAttribute("position", { x: 0, y: -0.2, z: 0});
      price.setAttribute("rotation", { x: 0, y: 0, z: 0});
      price.setAttribute("text",{ color: "black",
      width: 1.8,
      align: "center",value:"Rs"+dish.price});
      price.setAttribute("visible",false)
      plane.appendChild(price);       
  })
},
getDishes:async function(){
  return await firebase.firestore().collection("dishes").get()
  .then(info=>{
    return info.docs.map(doc=>doc.data())
  })
}
  
  });
