const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Mycities = require("../../models/cities");

//get City
router.get('/admin/getallCity', async (req, res, next) => {

  try {
    const data = await Mycities.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})
router.get('/mycities', async (req, res, next) => {

  try {
    const data = await Mycities.find()
    const total_cities = await Mycities.countDocuments();
    res.send({
      total: total_cities,
      cities: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getMycitiessearch", async (req, res, next) => {
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
      const cityCollection = await Mycities.find({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Mycities.countDocuments({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: cityCollection,
      });
    } else {
      const cityCollection = await Mycities.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Mycities.countDocuments();
      res.send({
        total: total_pages,
        data: cityCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get City by ID
router.get('/mycities/:id', async (req, res, next) => {

  try {
    const data = await Mycities.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create City
router.post("/mycities", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      cityname,
      created_at,
      updated_at,
      status,
    } = req.body;
    const cities = new Mycities({
      cityname,
      created_at,
      updated_at,
      status,
    });
    const addCity = await cities.save();
    res.send(addCity);
  } catch (error) {
    next(error);
  }
});
//Update City
router.patch("/mycities/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Mycities.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete City
router.delete("/mycities/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Mycities.findOne({ _id: id });
    if (find) {
      const deleted = await Mycities.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

