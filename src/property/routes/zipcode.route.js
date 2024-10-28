const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Zipcode = require("../../models/zipcode");
//get zipcode
router.get('/admin/getactivezipcode', async (req, res, next) => {
  try {
    const data = await Zipcode.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})
router.get('/zipcode', async (req, res, next) => {
  try {
    const data = await Zipcode.find()
    const total_zipcode = await Zipcode.countDocuments();
    res.send({
      total: total_zipcode,
      zipcode: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getallzipcode", async (req, res, next) => {
  try {
    const zipcode = await Zipcode.find();
    res.send(zipcode);
  } catch (error) {
    next(error);
  }
});
router.get("/getzipcodesearch", async (req, res, next) => {
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
      const zipcodeCollection = await Zipcode.find({
        $or: [
          { zipcode: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Zipcode.countDocuments({
        $or: [
          { zipcode: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: zipcodeCollection,
      });
    } else {
      const zipcodeCollection = await Zipcode.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Zipcode.countDocuments();
      res.send({
        total: total_pages,
        data: zipcodeCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get zipcode by ID
router.get('/zipcode/:id', async (req, res, next) => {

  try {
    const data = await Zipcode.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create zipcode
router.post("/zipcode", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
        cityid,
        zipcode,
        status,
        created_at,
        updated_at
    } = req.body;
    const zipcodes = new Zipcode({
        cityid,
        zipcode,
        status,
        created_at,
        updated_at
    });
    const addzipcode = await zipcodes.save();
    res.send(addzipcode);
  } catch (error) {
    next(error);
  }
});
//Update zipcode
router.patch("/zipcode/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Zipcode.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete zipcode
router.delete("/zipcode/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Zipcode.findOne({ _id: id });
    if (find) {
      const deleted = await Zipcode.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

