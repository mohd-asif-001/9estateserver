require('dotenv').config();
const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Notifications = require("../../models/notifications");
//Show notifications by user id
router.get('/notificationsByUser/:id', async (req, res, next) => {
  try {
    const data = await Notifications.find({reciever_id:req.params.id,status:"0"})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Show notifications by enq id
router.get('/notificationsByEnquiryId/:id', async (req, res, next) => {
  try {
    const data = await Notifications.find({rel_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Show notifications by user id and enq_type enquiry
router.get('/notificationsByUserEnqType/:id', async (req, res, next) => {
  try {
    const data = await Notifications.find({reciever_id:req.params.id,status:"0", rel_type:"enquiry"})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Show notifications by user id and enq_type fav
router.get('/notificationsByUserFavType/:id', async (req, res, next) => {
  try {
    const data = await Notifications.find({reciever_id:req.params.id,status:"0", rel_type:"fav"})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Show notifications by user id and enq_type and enq_id
router.get('/notificationsByUserFavType/:id/:enq_id', async (req, res, next) => {
  try {
    const data = await Notifications.find({reciever_id:req.params.id, rel_id:req.params.enq_id,status:"0", rel_type:"enquiry"})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//update Notifications By Id
router.patch("/notifications/:id", async (req, res, next) => {
  try {
    const update = req.body;
    
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Notifications.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Create notifications
router.post("/notifications", async (req, res, next) => {
  try {
    const {
      reciever_id,
      rel_id,
      rel_type
    } = req.body;
    const saveNotifications = new Notifications({
      reciever_id,
      rel_id,
      rel_type
    });
    const notification = await saveNotifications.save();
    res.send(notification);
  } catch (error) {
    next(error);
  }
});
module.exports = router;