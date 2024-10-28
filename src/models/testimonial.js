const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var testimonialSchema = new Schema({
  testimonial_img:{
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  description: {
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
var Testimonial = connection.model("Testimonial", testimonialSchema);
module.exports = Testimonial;