const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var notificationSchema = new Schema({
  reciever_id:{
    type:String,
    required: true,
    default: 0
  },
  rel_id:{
    type: String
  },
 rel_type:{
    type:String
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
var Notifications= connection.model("notifications",notificationSchema);
module.exports = Notifications;