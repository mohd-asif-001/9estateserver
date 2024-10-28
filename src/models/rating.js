const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var ratingSchema = new Schema({
  user_id: {
    type: String,
  },
  agent_id: {
    type: String,
  },
  rating: {
    type: Number,
  },
  review_msg: {
    type: String,
  },
  status: {
    type: String,
    default:1
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
var Rating = connection.model("Rating", ratingSchema);
module.exports = Rating;
