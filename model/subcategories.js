const mongoose = require('mongoose');
const subcategories = mongoose.Schema({
    name: {type:String},
    category: {type:String},
    index: {type:Number, default:1},
});
module.exports = mongoose.model("subcategories",subcategories);