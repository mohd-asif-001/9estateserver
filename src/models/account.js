const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var accountSchema = new Schema({
  company_id: {
    type: String,
  },
  name: {
    type: String,
  },
  lname: {
    type: String,
  },
  mobile: {
    type: String,
  },
  slug: {
    type: String,
  },
  slug_url: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  profile_img: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  role_type: {
    type: String,
  },
    emailverify: {
    type: Number,
    required: true,
    default: 0
  },
  encoded_email: {
    type:String,
  },
  verification: {
    type:String,
    required: true,
    default: 0
  },
  join_dt: {
    type: Date,
    required: true,
    default: Date.now
  },
  organization:{
    type: String
  },
  facebook:{
    type: String
  },
  twitter:{
    type: String
  },
  linkedin:{
    type: String
  },
  instagram:{
    type: String
  },
  website:{
    type: String
  },
  update_dt: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
  },
});
var Account = connection.model("Account", accountSchema);
module.exports = Account;
