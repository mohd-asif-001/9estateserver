const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var propertyTypeSchema = new Schema({
  propertyType_img:{
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  }, 
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now
  }
});
var PropertyType = connection.model("PropertyType", propertyTypeSchema);
module.exports = PropertyType;
