const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var ourStorySchema = new Schema({

  title: {
    type: String,
  },
  description: {
    type: String,
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
  status: {
    type: String,
    required: true,
  },
});
var OurStory = connection.model("ourstory", ourStorySchema);
module.exports = OurStory;
