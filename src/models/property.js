const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");

var propertySchema = new Schema({
  agentId: {
    type: String,
  },
  plan_id: {
    type: String,
  },
  cityId: {
    type: String,
  },
  neighborhoodId: {
    type: String,
  },
  streetId: {
    type: String
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  desc: {
    type: String,
    require: true,
  },
  priceDollar: {
    type: Number,
  },
  priceEuro: {
    type: String,
  },
  propertyType: {
    type: String,
    require: true,
  },
  propertyStatus: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  city: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  neighborhood: {
    type: String,
  },
  street: {
    type: String,
  },
  bedrooms: {
    type: Number,
  },
  bathrooms: {
    type: String,
  },
  area: {
    type: Number,
  },
  yearBuilt: {
    type: String,
  },
  features: {
    type: String
  },
  features_icon: {
    type: String
  },
  facilities: {
    type: String
  },
  facilities_icon: {
    type: String
  },
  videoname: {
    type: String,
  },
  videolink: {
    type: String,
  },
  gellary: {
    type: String,
  },
  lat: {
    type: String,
  },
  featured:{
    type:Number,
    default: 0,
  },
  lng: {
    type: String,
  },
  loc: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
     // index: { type: '2dsphere', sparse: true }
  },
  status:{
    type: Number,
    default: 0,
    required: true,
  },
  trash:{
    type: Number,
    default: 0
  },
  approve_status: {
    type: Number,
    default: 0,
    required: true,
  },
  uploded_by_name:
  {
    type: String,
    required: true,
  },
  uploded_by: {
    type: Number,
    default: 0,
    required: true,
  },
  featured_expiry_date: {
    type: Date
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
//propertySchema.index({loc:"2dsphere"});
var Properties = connection.model("Properties", propertySchema);
module.exports = Properties;