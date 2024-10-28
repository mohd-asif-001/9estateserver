require('dotenv').config();
const express = require("express");
const router = express.Router();
const Rating = require("../../models/rating");	
"use strict";	

 // Get Rating By User Id and Agent Id 
 router.get('/getRatingsByUserIdAndAgentId', async (req, res, next) => {
  try {
    var user_id = String(req.query.user_id);
    var agent_id = String(req.query.agent_id);
    const data = await Rating.find({ user_id : user_id,agent_id:agent_id});
    res.send({
      data: data
    });
  }
  catch (error) {
    next(error)
  }
});
router.post("/rating_by_userid_agentid", async (req, res, next) => {
 
  try {
    var user_id = String(req.body.user_id);
    var agent_id = String(req.body.agent_id);
    const data = await Rating.find({ user_id : user_id,agent_id:agent_id});
    res.send({
      data: data
    });
  }
  catch (error) {
    next(error)
  }

});
//Create rating
router.post("/saveAgentRating", async (req, res, next) => {
  try {
    const Ratingsave = new Rating({
        user_id:req.body.user_id,
        agent_id:req.body.agent_id,
        rating:req.body.rating,
        review_msg:req.body.review_msg
    });
    const addRating = await Ratingsave.save();
    res.send(addRating);
  } catch (error) {
    next(error);
  }
});
// Get Avg Rating 
router.post('/getAvgRatingByAgentId', async (req, res, next) => {
  try {
    var agent_id = String(req.body.agent_id);
    const data = await Rating.aggregate([
      {
        $match: { agent_id:agent_id},
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
    ]);
    res.send({
      data: data
    });
  }
  catch (error) {
    next(error)
  }
});
module.exports = router;