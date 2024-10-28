const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var postRightbarSchema = new Schema({

  image: {
    type: String,
  },
  linkurl: {
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
var PostRightbar = connection.model("postRightbar", postRightbarSchema);
module.exports = PostRightbar;
