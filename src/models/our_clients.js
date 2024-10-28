const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var ourClientSchema = new Schema({

  title: {
    type: String,
  },
  sub_title:{
    type: String,
  },
  alt_name:{
    type: String
  },
  image: {
    type: String,
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
var OurClient = connection.model("ourclient", ourClientSchema);
module.exports = OurClient;
