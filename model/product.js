const mongoose = require("mongoose");

const product = mongoose.Schema({
  sub_category: { type: String },
  category: { type: String },
  name: { type: String },
  image: { type: String },
  description: { type: String },
  rating: { type: Number },
  price: { type: Number },
  featured: {type: Boolean},
  out_of_stock: { type: Boolean },
  index: { type: Number, default: 1 },
});
module.exports = mongoose.model("product", product);
