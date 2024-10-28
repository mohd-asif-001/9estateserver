const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var qluckydrawSchema = new Schema({
  company_id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  property_com: {
    type: String,
    required: true,
  },
  agentId: {
    type: String,
    required: true,
  },
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
  status: {
    type: String,
  },
});
var QuickluckydrawSchema = connection.model("luckydraw", qluckydrawSchema);
module.exports = QuickluckydrawSchema;
