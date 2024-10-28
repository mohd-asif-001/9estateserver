const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Feature = require("../../models/features");

//get Categories
router.get('/admin/getactivefeature', async (req, res, next) => {
  try {
    const data = await Feature.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})
router.get('/activeFeaturesUrl', async (req, res, next) => {

  try {
    const data = await Feature.find({status:'Yes'});
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})
router.get('/features', async (req, res, next) => {

  try {
    const data = await Feature.find()
    const total_feature = await Feature.countDocuments();

    res.send({
      total: total_feature,
      feature: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getfeaturessearch", async (req, res, next) => {
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
      const featureCollection = await Feature.find({
        $or: [
          { features: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Feature.countDocuments({
        $or: [
          { features: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: featureCollection,
      });
    } else {
      const featureCollection = await Feature.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Feature.countDocuments();
      res.send({
        total: total_pages,
        data: featureCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Categories by ID
router.get('/features/:id', async (req, res, next) => {

  try {
    const data = await Feature.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create feature
router.post("/features", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      features,
      icon,
      status,
      created_at,
      updated_at
    } = req.body;
    
    const feature = new Feature({
      features,
      icon,
      status,
      created_at,
      updated_at
    });
    const addfeature = await feature.save();
    res.send(addfeature);
  } catch (error) {
    next(error);
  }
});
//Update feature
router.patch("/features/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Feature.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete feature
router.delete("/features/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Feature.findOne({ _id: id });
    if (find) {
      const deleted = await Feature.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

