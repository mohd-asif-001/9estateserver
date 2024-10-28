const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var SetsmtpSchema = new Schema({
    edriver: {
    type: String,
    required: true,
  },
  host: {
    type: String,
    required: true,
  }, 
  port: {
    type: Number,
    required: true,
  }, 
  emailencryption: {
    type: String,
    required: true,
  }, 
  email: {
    type: String,
    required: true,
  }, 
  password: {
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
var Setsmtp = connection.model("Setsmtp", SetsmtpSchema);
module.exports = Setsmtp;
