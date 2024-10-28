const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var ourVisionSchema = new Schema({
  icon_name: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
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
var OurVision = connection.model("ourvision", ourVisionSchema);
module.exports = OurVision;
