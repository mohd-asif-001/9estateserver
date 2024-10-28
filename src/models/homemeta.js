const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var homemetaSchema = new Schema({
  metatitle: {
    type: String,
    required: true,
  },
  metadescription: {
    type: String,
    required: true,
  },
  focuskeyword: {
    type: String,
    required: true,
  },
  headtagscript: {
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
  },
});
var homeMeta = connection.model("Homemeta", homemetaSchema);
module.exports = homeMeta;
