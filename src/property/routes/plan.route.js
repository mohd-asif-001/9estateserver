const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Plan = require("../../models/plans");

//get PropertiesStatus
router.get('/admin/getplan', async (req, res, next) => {

  try {
    const data = await Plan.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})
router.get('/getPlanByRole/:role_id', async (req, res, next) => {

  try {
    const data = await Plan.find({'plan_role':req.params.role_id});
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})
router.get('/myplan', async (req, res, next) => {

  try {
    
    const data = await Plan.find()
    const total_Plans = await Plan.countDocuments();
    res.send({
      total: total_Plans,
       plans: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get('/getActivePlan', async (req, res, next) => {
  try {
    const colName = 'Yes';
    const total_Plan = await Plan.find({
      $or: [
        { status: { $regex: new RegExp("^" + colName, "i") } },
      ],
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
router.get("/getmyplansearch", async (req, res, next) => {
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
      const myPlanCollection = await Plan.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Plan.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: myPlanCollection,
      });
    } else {
      const myPlanCollection = await Plan.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Plan.countDocuments();
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
router.get('/plan/:id', async (req, res, next) => {
  try {
    const data = await Plan.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create Category
router.post("/plan", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      title,
      number_of_posts,
      plan_role,
      number_of_featured,
      number_of_featured_days,
      plan_validity_days,
      price,
      status,
      created_at,
      updated_at
    } = req.body;
    
    const plan = new Plan({
      title,
      number_of_posts,
      plan_role,
      number_of_featured,
      number_of_featured_days,
      plan_validity_days,
      price,
      status,
      created_at,
      updated_at
    });
    const addPlan = await plan.save();
    res.send(addPlan);
  } catch (error) {
    next(error);
  }
});
//Update Category
router.patch("/myplan/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Plan.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Category
router.delete("/myplan/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Plan.findOne({ _id: id });
    if (find) {
      const deleted = await Plan.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;