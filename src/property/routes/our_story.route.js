const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const OurStory = require("../../models/our_story");

router.get('/ourstory', async (req, res, next) => {
  try {
    const data = await OurStory.find()
    const total_data= await OurStory.countDocuments();
    res.send({
    total: total_data,
    Ourstorys: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getOurstorysearch", async (req, res, next) => {
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
      const ourstoryCollection = await OurStory.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await OurStory.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: ourstoryCollection,
      });
    } else {
      const ourstoryCollection = await OurStory.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await OurStory.countDocuments();
      res.send({
        total: total_pages,
        data: ourstoryCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});

//Create Ourstory
router.post("/ourstory", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
        title,
        description,
        created_at,
        updated_at,
        status,
    } = req.body;
    const ourstorys= new OurStory({
        title,
        description,
        created_at,
        updated_at,
        status,
    });
    const addourstory = await ourstorys.save();
    res.send(addourstory);
  } catch (error) {
    next(error);
  }
});
//Update Ourstory
router.patch("/ourstory/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await OurStory.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Ourstory
router.delete("/ourstory/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await OurStory.findOne({ _id: id });
    if (find) {
      const deleted = await OurStory.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

