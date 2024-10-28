const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var agentContactSchema= new Schema({
    agentId:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    phone:{
        type:Number,
        required: true
    },
    message:{
        type: String,
    },
    contact_at: {
        type: Date,
        required: true,
        default: Date.now
      },
})
var agentContact =connection.model("agentcontact",agentContactSchema);
module.exports=agentContact;