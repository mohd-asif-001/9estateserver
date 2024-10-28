const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var enquiryreplySchema = new Schema({
  sender_id:{
    type:String,
  },
  enq_id:{
    type: String
  },
 sendTo:{
    type:String
  },
  sendFrom:{
    type:String
  },
  message: {
    type: String,
    required: true,
  },
  status: {
      type: String,
      required: true,
      default: 0
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
});
var EnquiryReply= connection.model("EnquiryReply", enquiryreplySchema);
module.exports = EnquiryReply;
