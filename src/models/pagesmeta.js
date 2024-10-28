const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var pagemetaSchema = new Schema({
    pageurl: {
        type: String,
        required: true,
    },
    pagemeta: {
        type: String,
        required: true,
    },
    pagedescription: {
        type: String,
        required: true,
    },
    pagekeyword: {
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
var PageMeta = connection.model("pagemeta", pagemetaSchema);
module.exports = PageMeta;