const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const agentPlan = require("../../models/agent_plans");
const Properties = require("../../models/property");
var cron = require('node-cron');
cron.schedule('0 0 * * *', () => {
  console.log('running a task every day at 12:59:00 pm');

  var start = new Date();
    start.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23,59,59,999);
    Properties.updateMany({featured_expiry_date: {$gte: start, $lt: end}, featured:1}, 
      {featured:0}, function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Updated featured expired today : ", docs);
      }
  });
  agentPlan.updateMany({plan_expiry_date: {$gte: start, $lt: end}, status:'Yes'}, 
        {status:"No"}, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Updated Plan expired today : ", docs);
        }
    });

});
router.get('/expirePlanAndFeatured', async (req, res, next) => {
  try {
    var start = new Date();
    start.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23,59,59,999);
    Properties.updateMany({featured_expiry_date: {$gte: start, $lt: end}, featured:1}, 
      {featured:0}, function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Updated ok : ", docs);
      }
  });
    //const plan_data = await agentPlan.find({plan_expiry_date: {$gte: start, $lt: end}, status:'Yes'});
    agentPlan.updateMany({plan_expiry_date: {$gte: start, $lt: end}, status:'Yes'}, 
        {status:"No"}, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Updated Docs : ", docs);
        }
    });
  }
  catch (error) {
    next(error)
  }
});
//get PropertiesStatus
router.get('/admin/getAgentplan/:agent_id', async (req, res, next) => {
  try {
    const data = await agentPlan.find({agent_id:req.params.agent_id, status:'Yes'});
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})
router.get('/getallplansofagenet', async (req, res, next) => {
  try {
    const lgnId= String(req.query.login_agentId);
    const data = await agentPlan.find({agent_id:lgnId})
    const total_Enquiry = await agentPlan.countDocuments({agent_id:lgnId});
    res.send({
      total: total_Enquiry,
      Enquiry: data,
    });
    }
        catch (error) {
        next(error)
        }
  })

router.get('/agentplan', async (req, res, next) => {

  try {
    const data = await agentPlan.find()
    const total_Plans = await agentPlan.countDocuments();
    res.send({
      total: total_Plans,
       plans: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get('/getActiveagentplan/:agent_id', async (req, res, next) => {
  try {
    const colName = 'Yes';
    const total_Plan = await agentPlan.find({
      $or: [
        { status: { $regex: new RegExp("^" + colName, "i") } },
      ],
	  agent_id:req.params.agent_id
    })
    // const total_Properties_status = await Properties_status.countDocuments();
    res.send({
      total: total_Plan,
       Properties_status: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getmyagentplansearch", async (req, res, next) => {
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
      const myPlanCollection = await agentPlan.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await agentPlan.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: myPlanCollection,
      });
    } else {
      const myPlanCollection = await agentPlan.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await agentPlan.countDocuments();
      res.send({
        total: total_pages,
        data: myPlanCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get PropertiesStatus by ID
router.get('/agentplan/:id', async (req, res, next) => {

  try {
    const data = await agentPlan.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})


//Create Agentplan
router.post("/agentplan", async (req, res, next) => {
  try {
    var date = new Date(); // Now
    date.setDate(date.getDate() + parseInt(req.body.plan_validity_days)); // Set now + 30 days as the new date
   
    const agentplan = new agentPlan({
      title:req.body.title,
      agent_id:req.body.agent_id,
      coupon_code:req.body.coupon_code,
      plan_id:req.body.plan_id,
      number_of_posts:req.body.number_of_posts,
      number_of_published_posts:req.body.number_of_published_posts,
      number_of_featured_posts:req.body.number_of_featured_posts,
      number_of_published_featured_posts:req.body.number_of_published_featured_posts,
      number_of_featured_days:req.body.number_of_featured_days,
      status:req.body.status,
      price:req.body.price,
      plan_validity_days:req.body.plan_validity_days,
      featured_expiry_days:req.body.featured_expiry_days,
      plan_expiry_date:date,
      created_at:req.body.created_at,
      updated_at:req.body.updated_at
    });
    console.log('ha beta ->', {
      title:req.body.title,
      agent_id:req.body.agent_id,
      coupon_code:req.body.coupon_code,
      plan_id:req.body.plan_id,
      number_of_posts:req.body.number_of_posts,
      number_of_published_posts:req.body.number_of_published_posts,
      number_of_featured_posts:req.body.number_of_featured_posts,
      number_of_published_featured_posts:req.body.number_of_published_featured_posts,
      number_of_featured_days:req.body.number_of_featured_days,
      status:req.body.status,
      price:req.body.price,
      plan_validity_days:req.body.plan_validity_days,
      featured_expiry_days:req.body.featured_expiry_days,
      plan_expiry_date:date,
      created_at:req.body.created_at,
      updated_at:req.body.updated_at
    });
    const addPlan = await agentplan.save();
    res.send(addPlan);
  } catch (error) {
    next(error);
  }
});
//Create Agentplan with transaction id
router.post("/agentplanWithTransaction", async (req, res, next) => {
  
  try {
    var date = new Date(); // Now
    date.setDate(date.getDate() + parseInt(req.body.plan_validity_days)); // Set now + 30 days as the new date
   
    
    const agentplan = new agentPlan({
      title:req.body.title,
      agent_id:req.body.agent_id,
      coupon_code:req.body.coupon_code,
      plan_id:req.body.plan_id,
      order_transaction_id:req.body.order_transaction_id,
      number_of_posts:req.body.number_of_posts,
      number_of_published_posts:req.body.number_of_published_posts,
      number_of_featured_posts:req.body.number_of_featured_posts,
      number_of_published_featured_posts:req.body.number_of_published_featured_posts,
      plan_validity_days:req.body.plan_validity_days,
      featured_expiry_days:req.body.featured_expiry_days,
      plan_expiry_date:date,
      status:req.body.status,
      price:req.body.price,
      created_at:req.body.created_at,
      updated_at:req.body.updated_at
    });
    const addPlan = await agentplan.save();
    res.send(addPlan);
  } catch (error) {
    next(error);
  }
});
//Update Category
router.patch("/myagentplan/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await agentPlan.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Category
router.delete("/myagentplan/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await agentPlan.findOne({ _id: id });
    if (find) {
      const deleted = await agentPlan.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

