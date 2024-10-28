
const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const comments = require("../../models/comments");

//get comment
router.get('/comments', async (req, res, next) => {
    try {
        const data = await comments.find().sort({created_at: -1 })
        const total_post = await comments.countDocuments();
        res.send({
        total: total_post,
        comments: data,
        });
      }
      catch (error) {
      next(error)
      }
    })
    //Get data by id
    router.get("/comments_by_id/:id", async (req, res, next) => {
    try {
    const data = await comments.find({post_id: req.params.id,status:1}).sort({created_at: -1 })
    res.send(data)
    }
    catch (error) {
    next(error)
    }
    });
    //get Tag By Slug

router.get("/getcommentssearch", async (req, res, next) => {
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
      const postCollection = await comments.find({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await comments.countDocuments({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: postCollection,
      });
    } else {
      const postCollection = await comments.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await comments.countDocuments();
      res.send({
        total: total_pages,
        data: postCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get comments by ID
router.get('/comments/:id', async (req, res, next) => {

  try {
    const data = await comments.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create post
router.post("/comments", async (req, res, next) => {
  try {
    const {
      post_id,
      post_title,
      post_slug,
      comment,
      name,
      email,
      website,
      status,
      created_at,
      updated_at,
    } = req.body;
    const mycomments = new comments({
      post_id,
      post_title,
      post_slug,
      comment,
      name,
      email,
      website,
      status,
      created_at,
      updated_at,
    });
    const addcomments = await mycomments.save();
    res.send(addcomments);
  } catch (error) {
    next(error);
  }
});
//Update post
router.patch("/comments/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await comments.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete post
router.delete("/comments/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await comments.findOne({ _id: id });
    if (find) {
      const deleted = await comments.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
router.get('/check_tagslug/:slug', async (req, res, next) => {
  try {
    const data = await comments.find({slug:req.params.slug})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
module.exports = router;

