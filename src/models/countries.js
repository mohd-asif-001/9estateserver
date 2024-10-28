const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var countriesSchema = new Schema({
    agentId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    require: true,
  },
  currency: {
    type: String,
    required: true,
  },
  currencySignature: {
    type: String,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
    default: 0.0,
  },
  latitude: {
    type: Number,
    required: true,
    default: 0.0,
  },
  picture: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  displayOnFront: {
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
var Countries = connection.model("Countries", countriesSchema);
module.exports = Countries;