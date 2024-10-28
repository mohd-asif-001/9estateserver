const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Neighborhood = require("../../models/neighborhood");

//get Neighborhoods
router.get('/admin/getallneighborhood', async (req, res, next) => {
  try {
    const data = await Neighborhood.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})
router.get('/Neighborhood', async (req, res, next) => {
  try {
    const data = await Neighborhood.find()
    const total_neighborhoods = await Neighborhood.countDocuments();
    res.send({
      total: total_neighborhoods,
      neighborhoods: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getNeighborhoodsearch", async (req, res, next) => {
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
      const cityCollection = await Neighborhood.find({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Neighborhood.countDocuments({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: cityCollection,
      });
    } else {
      const cityCollection = await Neighborhood.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Neighborhood.countDocuments();
      res.send({
        total: total_pages,
        data: cityCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Neighborhoods by ID
router.get('/Neighborhood/:id', async (req, res, next) => {

  try {
    const data = await Neighborhood.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create Neighborhoods
router.post("/Neighborhood", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      cityid,
      zipcodeid,
      neighborhood,
      created_at,
      updated_at,
      status,
    } = req.body;
    const neighborhoods = new Neighborhood({
      cityid,
      zipcodeid,
      neighborhood,
      created_at,
      updated_at,
      status,
    });
    const addNeighborhoods = await neighborhoods.save();
    res.send(addNeighborhoods);
  } catch (error) {
    next(error);
  }
});
//Update Neighborhoods
router.patch("/Neighborhood/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Neighborhood.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Neighborhoods
router.delete("/Neighborhood/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Neighborhood.findOne({ _id: id });
    if (find) {
      const deleted = await Neighborhood.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

