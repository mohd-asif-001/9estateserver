const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var agentplanSchema = new Schema({
  title: {
    type: String,
  },
  agent_id: {
    type: String,
    require: true,
  },
  coupon_code: {
    type: String,
  },
  plan_id: {
    type: String,
    require: true,
  },
  order_transaction_id: {
    type: String
  },
  number_of_posts: {
    type: String,
    require: true,
  },
  number_of_published_posts: {
    type: String,
  },
  number_of_featured_posts: {
    type: String,
  },
  number_of_published_featured_posts: {
    type: String,
  },
  plan_validity_days: {
    type: String,
  },
  plan_expiry_date: {
    type: Date,
  },
  featured_expiry_days: {
    type: String,
  },
  status: {
    type: String,
    require: true,
  },
  price: {
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
  }
});
var agentPlan = connection.model("agent_plans", agentplanSchema);
module.exports = agentPlan;
