const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var postTagsSchema = new Schema({
  tag:{
    type:String,
    require: true,
    },
    slug: {
    type: String,
    require: true,
    },
    description: {
    type: String,
    require: true,
    },
    status:{
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
var postTags= connection.model("posttags", postTagsSchema);
module.exports = postTags;
