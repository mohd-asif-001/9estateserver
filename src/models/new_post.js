const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var newPostSchema = new Schema({
  post_title: {
    type: String,
    require: true,
  },
  post_content: {
    type: String,
    require: true,
  },
  metatitle: {
    type: String,
    require: true,
  },
  metadescription: {
    type: String,
    require: true,
  },
  focuskeyword: {
    type: String,
    require: true,
  },
  post_category: {
    type: String,
    require: true,
  },
  post_tag: {
    type: String,
    require: true,
  },
  post_image: {
    type: String,
    require: true,
  },
  img_alt:{
    type: String,
    require:true
  },
  slug: {
    type: String,
  },
  authorName:{
    type: String
  },
  authordescription:{
    type: String
  },
  authorProfile_img:{
    type:String
  },
  status: {
    type: Number,
    default: 0,
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
  },
});
var newPost = connection.model("newpost", newPostSchema);
module.exports = newPost;
