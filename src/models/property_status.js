const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var property_statusSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    require: true,
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
var Property_status = connection.model("Property_status", property_statusSchema);
module.exports = Property_status;
