const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var citySchema = new Schema({
  cityname: {
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
var Cities = connection.model("Cities", citySchema);
module.exports = Cities;
