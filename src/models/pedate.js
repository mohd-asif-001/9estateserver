const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var pedateSchema = new Schema({
  rent: {
    type: Number,
    required: true,
  },
  sale: {
    type: Number,
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
var Pedate = connection.model("Pedate", pedateSchema);
module.exports = Pedate;
