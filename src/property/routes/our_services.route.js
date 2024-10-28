const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const OurService = require("../../models/our_services");

router.get('/ourservice', async (req, res, next) => {
  try {
    const data = await OurService.find()
    const total_data= await OurService.countDocuments();
    res.send({
    total: total_data,
    Ourservices: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getOurservicesearch", async (req, res, next) => {
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
      const ourserviceCollection = await OurService.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await OurService.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: ourserviceCollection,
      });
    } else {
      const ourserviceCollection = await OurService.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await OurService.countDocuments();
      res.send({
        total: total_pages,
        data: ourserviceCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});

//Create Ourservices
router.post("/ourservice", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
        icon_name,
        description,
        created_at,
        updated_at,
        status,
    } = req.body;
    const ourservices= new OurService({
        icon_name,
        description,
        created_at,
        updated_at,
        status,
    });
    const addourservices = await ourservices.save();
    res.send(addourservices);
  } catch (error) {
    next(error);
  }
});
//Update Ourservices
router.patch("/ourservice/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await OurService.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Ourservices
router.delete("/ourservice/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await OurService.findOne({ _id: id });
    if (find) {
      const deleted = await OurService.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

