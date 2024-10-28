const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const OurVision = require("../../models/our_vision");

router.get('/ourvision', async (req, res, next) => {
  try {
    const data = await OurVision.find()
    const total_data= await OurVision.countDocuments();
    res.send({
    total: total_data,
    Ourvisions: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getOurvisionsearch", async (req, res, next) => {
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
      const ourvisionCollection = await OurVision.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await OurVision.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: ourvisionCollection,
      });
    } else {
      const ourvisionCollection = await OurVision.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await OurVision.countDocuments();
      res.send({
        total: total_pages,
        data: ourvisionCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});

//Create Ourvision
router.post("/ourvision", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
        icon_name,
        title,
        description,
        created_at,
        updated_at,
        status,
    } = req.body;
    const ourvisions = new OurVision({
        icon_name,
        title,
        description,
        created_at,
        updated_at,
        status,
    });
    const addourvision = await ourvisions.save();
    res.send(addourvision);
  } catch (error) {
    next(error);
  }
});
//Update Ourvision
router.patch("/ourvision/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await OurVision.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Ourvision
router.delete("/ourvision/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await OurVision.findOne({ _id: id });
    if (find) {
      const deleted = await OurVision.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

