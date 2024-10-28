const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var ZipcodeSchema = new Schema({
  cityid: {
    type: String,
  },
  zipcode: {
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
var Zipcode = connection.model("Zipcode", ZipcodeSchema);
module.exports = Zipcode;
