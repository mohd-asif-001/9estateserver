const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Countries = require("../../models/countries");

//get Categories
router.get('/mycountries', async (req, res, next) => {

  try {
    const data = await Countries.find()
    const total_countries= await Countries.countDocuments();

    res.send({
      total: total_countries,
      countries: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getmycountriessearch", async (req, res, next) => {
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
      const countriesCollection = await Countries.find({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Countries.countDocuments({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: countriesCollection,
      });
    } else {
      const countriesCollection = await Countries.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Countries.countDocuments();
      res.send({
        total: total_pages,
        data: countriesCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Categories by ID
router.get('/mycountries/:id', async (req, res, next) => {

  try {
    const data = await Countries.find({_id:req.params.id})
    res.send({ data: data })



  }
  catch (error) {
    next(error)
  }
})
//Create Category
router.post("/mycountries", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      title,
      other_details
    } = req.body;
    
    const countries = new countries({
      title,
      other_details
    });
    const addcountries= await Countries.save();
    res.send(addcountries);
  } catch (error) {
    next(error);
  }
});
//Update Category
router.patch("/mycountries/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };

    const updatedDetails = await Countries.findByIdAndUpdate(id, update, option);

    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Category
router.delete("/mycountries/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Countries.findOne({ _id: id });
    if (find) {
      const deleted = await Countries.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;
