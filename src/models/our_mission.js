const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var ourMissionSchema = new Schema({

  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
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
var OurMission = connection.model("ourmission", ourMissionSchema);
module.exports = OurMission;
