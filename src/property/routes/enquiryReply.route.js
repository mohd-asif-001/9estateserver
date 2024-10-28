require('dotenv').config();
const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Notifications = require("../../models/notifications");
const EnquiryReply = require("../../models/enquiryreply");

//Show enquiry with url id
router.get('/enquiryurlmatch', async (req, res, next) => {
  try {
        const enq_id = req.query.enq_id;
        const find = await EnquiryReply.findOne({ enq_id: enq_id });
        const data = await EnquiryReply.find({ enq_id: enq_id })
        const total_Enquiry = await EnquiryReply.countDocuments({ enq_id: enq_id });
        res.send({
          total: total_Enquiry,
          EnquiryReply: data,
        });
  } catch (error) {
   next(error)
  }
});

//get enquiryreply
router.get('/EnquiryReply', async (req, res, next) => {
  try {
    const data = await EnquiryReply.find()
    const total_Enquiry = await EnquiryReply.countDocuments();
    res.send({
      total: total_Enquiry,
      EnquiryReply: data,
    });                                                                       
  }
  catch (error) {
    next(error)
  }
})                                                  
//get enquiryreply length
router.get('/EnquiryReplyStatus', async (req, res, next) => {
  try {
    const loginId = req.query.loginId;
    const data = await EnquiryReply.find({sender_id:loginId,status:"0"})
    const total_Enquiry = await EnquiryReply.countDocuments({sender_id:loginId,status:"0"});
    res.send({
        total: total_Enquiry,
        EnquiryReply: data,
    });
  }
  catch (error) {
    next(error)
  }
})//get enquiryreply and update status
router.get('/EnquiryReplyStatusupdate', async (req, res, next) => {
  try {
    const loginId = req.query.loginId;
    const enquiry_id = req.query.enquiry_id;
    const option =  { multi: true};
    const updatedDetails = await EnquiryReply.updateMany({sender_id:loginId,enq_id:enquiry_id,status:0},{$set:{status
      :1}}, option);
  }
  catch (error) {
    next(error)
  }
}) 
//Get all EnquiryReply by agent id
router.get('/totalEnquiryReply', async (req, res, next) => {
  try {
    const agent_id = String(req.query.storage_data);
    const total_enquiry_by_id = await EnquiryReply.countDocuments({agentId:agent_id});
    res.send({
      total: total_enquiry_by_id,
    });
  }
  catch (error) {
    next(error)
  }
});

router.get("/getEnquiryReplyearch", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = String(req.query.searchdata);
    const skips = limit * offset;
   
    var sortObject = {};
    var sort_col = String(req.query.sort_col);
    var sort_order = String(req.query.sort_order);
    sortObject[sort_col] = sort_order;
    if (search) {
      const colName = search;
      const enquiryCollection = await EnquiryReply.find({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await EnquiryReply.countDocuments({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: enquiryCollection,
      });
    } else {
      const enquiryCollection = await EnquiryReply.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await EnquiryReply.countDocuments();
      res.send({
        total: total_pages,
        data: enquiryCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get EnquiryReply by ID
router.get('/EnquiryReply/:id', async (req, res, next) => {
  try {
    const data = await EnquiryReply.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Createenquiryreply
router.post("/EnquiryReply", async (req, res, next) => {
  try {
    const {
        sender_id,
        enq_id,
        sendTo,
        sendFrom,
        message
    } = req.body;
    const myEnquiryreply = new EnquiryReply({
      sender_id,
      enq_id,
      sendTo,
      sendFrom,
      message
    });
    const addenquiryreply = await myEnquiryreply.save();
    res.send(addenquiryreply);
  } catch (error) {
    next(error);
  }
});
//Createenquiryreply
router.post("/EnquiryReplyNoti", async (req, res, next) => {
  try {
    const id = req.body.notification_id;
    const option = { new: true };
    const updatedDetails = await Notifications.findByIdAndUpdate(id, {reciever_id:req.body.sendto_id, status:0}, option);
    
    const {
        sender_id,
        enq_id,
        sendTo,
        sendFrom,
        message
    } = req.body;
    const myEnquiryreply = new EnquiryReply({
      sender_id,
      enq_id,
      sendTo,
      sendFrom,
      message
    });
    const addenquiryreply = await myEnquiryreply.save();
    res.send(addenquiryreply);
  } catch (error) {
    next(error);
  }
});
//Update enquiryreply
router.patch("/EnquiryReply/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await EnquiryReply.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete enquiryreply
router.delete("/EnquiryReply/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await EnquiryReply.findOne({ _id: id });
    if (find) {
      const deleted = await EnquiryReply.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

