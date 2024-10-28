const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var commentsSchema = new Schema({
  post_id:{
    type:String,
    require: true,
    },
    post_title:{
      type:String,
      require:true,
    },
    post_slug:{
      type:String,
      require:true,
    },
    comment:{
    type:String,
    require: true,
    },
    name: {
    type: String,
    require: true,
    },
    email:{
      type:String,
      require:true,
    },
    website: {
    type:String,
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
var comments= connection.model("comment", commentsSchema);
module.exports = comments;
