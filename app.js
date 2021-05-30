var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// var express = require("express");
// var app = express();

var CartSchema = new Schema({
  name: String,
  price: String,
  quantity: String,
});

myproductcart = mongoose.model("cart", CartSchema);

var mongodb = "mongodb://localhost/mycart";
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// var mongodb = "mongodb://localhost/mycart";
// mongoose.connect(mongodb, {  });
// var db = mongoose.connection;
// db.on("error", console.error.bind());

app.listen(3000, function () {
  console.log("SERVER STARTED ON PORT NUMBER 3000");
});

app.get("/", function (req, res) {
  res.send("Shopping Cart");
});

// app.get("//:id", function (req, res) {
//   .find({
//     _id: req.params.id,
//   });
// });

app.put("/updateproduct/:id", function (req, res) {
  myproductcart.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: {
        quantity: req.body.quantity,
        price: req.body.price,
      },
    },
    { upsert: true },
    function (err, product) {
      console.log(product);
    }
  );
});

app.post("/create", function (req, res) {
  var add_product = new myproductcart();
  add_product.name = req.body.name;
  add_product.price = req.body.price;
  add_product.quantity = req.body.quantity;

  add_product.save(function (err, product) {
    if (err) throw err;
    res.send("Product Created");
  });
});

app.delete("/deleteproduct", function (req, res) {
  var product_name = req.body.name;
  myproductcart.findOneAndRemove(
    {
      name: product_name,
    },
    function (err, product) {
      console.log("Deleted Product: " + product);
    }
  );
});

// app.post("/", function (req, res) {
//   var add_product = new myproductcart();
//   add_product.name = req.body.name;

//   add_product.save(function (err, product) {
//     if (err) throw err;
//     res.send("");
//   });
// });

app.get("/searchproduct", function (req, res) {
  var product_name = req.body.name;
  myproductcart.find({
    name: product_name,
    function(err, product) {
      console.log("Searched Product: " + product);
    },
  });
});
