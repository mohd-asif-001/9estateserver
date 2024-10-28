const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var subscriptionSchema = new Schema({
  email: {
    type: String,
    required: true, 
    unique : true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  trash:{
    type: Number,
    default: 0
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now
  },
});
var Subscriptions= connection.model("Subscriptions", subscriptionSchema);
module.exports = Subscriptions;
