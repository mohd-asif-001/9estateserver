const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var neighborhoodSchema = new Schema({
    cityid:{
        type:String
    },
    zipcodeid:{
        type : String
    },
    neighborhood: {
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
  },
  status: {
    type: String,
    required: true,
  },
});
var Neighborhood = connection.model("Neighborhood", neighborhoodSchema);
module.exports = Neighborhood;
