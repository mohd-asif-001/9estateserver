const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var facilitiesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  icon: {
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
var Facility = connection.model("Facility", facilitiesSchema);
module.exports = Facility;
