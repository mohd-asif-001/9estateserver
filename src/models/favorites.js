const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const connection= require("../../db/connection");

var favoritesSchema= new Schema({
    user_id:{
        type: String,
        required:true
    },
    property_id:{
        type: String,
        required: true
    },
    property_title:{
        type: String,
        required: true
    },
    status:{
        type: Number,
        default: 1,
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
      }
});
var Favorites =connection.model("Favorites", favoritesSchema);
module.exports = Favorites;
