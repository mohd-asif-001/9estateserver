const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var enquirySchema = new Schema({
  userid:{
    type:String,
  },
  agentid:{
    type:String,
  },
  property_id:{
    type: String
  },
  property_title:{
    type:String
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }, 
  phone: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    require: true,
  },
  trash:{
    type: Number,
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
var Enquiry= connection.model("Enquiry", enquirySchema);
module.exports = Enquiry;
