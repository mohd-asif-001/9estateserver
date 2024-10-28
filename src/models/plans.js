const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var planSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  number_of_posts: {
    type: String,
  },
  plan_role: {
    type: String,
  },
  number_of_featured: {
    type: String,
  },
  number_of_featured_days: {
    type: String,
  },
  plan_validity_days: {
    type: String,
  },
  validity_month: {
    type: String,
  },
  price: {
    type: String,
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
var Plan = connection.model("Plan", planSchema);
module.exports = Plan;
