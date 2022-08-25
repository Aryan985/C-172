var table = null
AFRAME.registerComponent("markerhandler", {
  init: async function () {

if(table==null){
  this.askTable()
}
    //get the dishes collection from firestore database
    var dishes = await this.getDishes();

    //markerFound event
    this.el.addEventListener("markerFound", () => {
      var markerId = this.el.id;      
      this.handleMarkerFound(dishes, markerId);
    });

    //markerLost event
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });

  },

  askTable:function(){
   swal({
    title:"Welcome to Dominos 2",
    content:{
      element:"input",
      attributes:{
        placeholder:"Enter your Table Number",
        type:"number",
        min:1,
      }
    },
    closeOnClickOutside:false,

   }) .then(value=>{
    table=value
   })
  },

  
  handleMarkerFound: function (dishes, markerId) {
    // Changing button div visibility
    if(table!==null){
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var ratingButton = document.getElementById("rating-button");
    var orderButtton = document.getElementById("order-button");
    var summaryButtton = document.getElementById("order-summary");
    var dish = dishes.filter(dish => dish.id === markerId)[0];
    // Handling Click Events
    ratingButton.addEventListener("click", function () {
      swal({
        icon: "warning",
        title: "Rate Dish",
        text: "Work In Progress"
      });
    });

    orderButtton.addEventListener("click", () => {
      this.handleOrder(table,dish)
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Thanks For Order !",
        text: "Your order will serve soon on your table!"
      });
    });

    // Changing Model scale to initial scale
    summaryButtton.addEventListener("click", () => {
        this.handleSummary(table,dish)
    })

    var model = document.querySelector(`#model-${dish.id}`);
    model.setAttribute("position", dish.model_geometry.position);
    model.setAttribute("rotation", dish.model_geometry.rotation);
    model.setAttribute("scale", dish.model_geometry.scale);

   
      model.setAttribute("visible",true)
      var plane = document.querySelector(`#plane-${dish.id}`);
      plane.setAttribute("visible",true)
      var title = document.querySelector(`#title-${dish.id}`);
      title.setAttribute("visible",true)
      var ingredients = document.querySelector(`#ingredients-${dish.id}`);
      ingredients.setAttribute("visible",true)
      var price = document.querySelector(`#price-${dish.id}`);
      price.setAttribute("visible",true)
    }
  },

  handleSummary:async function(table,dish){
    await  firebase
    .firestore()
    .collection("tables")
    .doc(table)
    .get()
    .then(doc => {
      details = doc.data();
  })
  swal({
    title:"ORDER SUMMARY",
    text:"Your total amount is: "+ details["current_order"][dish.id]
["subtotal"] ,
button:"Pay Now..."
 }). then(()=>{
  firebase
  .firestore()
  .collection("tables")
  .doc(table)
  .update({
    current_order:{}
  })
  swal({
    title:"PAYMENT SUMMARY",
    text:"Payment Successful"
  })
 })
  },

  handleOrder: function (table, dish) {
    // Reading current table order details
    firebase
      .firestore()
      .collection("tables")
      .doc(table)
      .get()
      .then(doc => {
        var details = doc.data();

        if (details["current_order"][dish.id]) {
          // Increasing Current Quantity
          details["current_order"][dish.id]["quantity"] += 1;

          //Calculating Subtotal of item
          var currentQuantity = details["current_order"][dish.id]["quantity"];

          details["current_order"][dish.id]["subtotal"] =
            currentQuantity * dish.price;
        } else {
          details["current_order"][dish.id] = {
            item: dish.dish_name,
            price: dish.price,
            quantity: 1,
            subtotal: dish.price * 1
          };
        }

        //Updating db
        firebase
          .firestore()
          .collection("tables")
          .doc(doc.id)
          .update(details);
      });
  },
  
  handleMarkerLost: function () {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },
  //get the dishes collection from firestore database
  getDishes: async function () {
    return await firebase
      .firestore()
      .collection("dishes")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  }
});
