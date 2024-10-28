const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var contactSchema = new Schema({
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
  contact_at: {
    type: Date,
    required: true,
    default: Date.now
  },
 
});
var Contact= connection.model("Contact", contactSchema);
module.exports = Contact;
