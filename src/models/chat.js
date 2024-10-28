const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var chatSchema = new Schema({
    sender: String,
    receiver: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
});
var Chat = connection.model("Chat", chatSchema);
module.exports = Chat;
