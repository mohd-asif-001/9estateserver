const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var ourServicesSchema = new Schema({
    icon_name: {
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
    var OurService = connection.model("ourservice", ourServicesSchema);
    module.exports = OurService;
