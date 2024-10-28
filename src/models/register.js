const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var registerSchema = new Schema({
  company_id: {
    type: String,
  },
  userType: {
    type: String,
    required: true,
  },
  username: {
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
  receiveNewsletter: {
    type: String,
  },
  // picture: {
  //   type: String,
  //   required: true,
  // },
  join_dt: {
    type: Date,
    required: true,
    default: Date.now
  },
  update_dt: {
    type: Date,
    required: true,
    default: Date.now
  },
  approve_status: {
    type: Number,
    default: 0,
    required: true}
});
var Register = connection.model("Register", registerSchema);
module.exports = Register;
