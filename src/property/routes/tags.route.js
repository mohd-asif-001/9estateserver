const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Tags = require("../../models/tags");

//get tag
router.get('/mytags', async (req, res, next) => {

  try {
    const data = await Tags.find()
    const total_tags = await Tags.countDocuments();
    res.send({
      total: total_tags,
      tags: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getmytagssearch", async (req, res, next) => {
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
      const mytagsCollection = await Tags.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Tags.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: mytagsCollection,
      });
    } else {
      const mytagsCollection = await Tags.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Tags.countDocuments();
      res.send({
        total: total_pages,
        data: mytagsCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get tags by ID
router.get('/mytags/:id', async (req, res, next) => {

  try {
    const data = await Tags.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create tag
router.post("/mytags", async (req, res, next) => {
  try {
    const {
      title,
      slug,
      status,
      created_at,
      updated_at
    } = req.body;
    const myTag = new Tags({
      title,
      slug,
      status,
      created_at,
      updated_at
    });
    const addtag = await myTag.save();
    res.send(addtag);
  } catch (error) {
    next(error);
  }
});
//Update tag
router.patch("/mytags/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Tags.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete tag
router.delete("/mytags/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Tags.findOne({ _id: id });
    if (find) {
      const deleted = await Tags.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

