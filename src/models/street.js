const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var StreetSchema = new Schema({
  cityid: {
    type: String,
    required: true,
  },
  zipcodeid: {
    type: String,
  },
  neighborhood: {
    type: String,
  },
  streetname: {
    type: String,
    required: true,
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
var Street = connection.model("Street", StreetSchema);
module.exports = Street;
