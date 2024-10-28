const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var couponcodeSchema = new Schema({
  coupon_code: {
    type: String,
    required: true,
  },
  discount_type: {
    type: String,
    require: true,
  },
  discount_amount: {
    type: String,
    require: true,
  },
  valid_til: {
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
var couponCode = connection.model("coupon_code", couponcodeSchema);
module.exports = couponCode;
