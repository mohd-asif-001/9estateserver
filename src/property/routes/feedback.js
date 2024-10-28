const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var feedbackSchema = new Schema({
  email: {
    type: String,
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
});
var Feedback= connection.model("Feedback", feedbackSchema);
module.exports = Feedback;
