
const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const postTags = require("../../models/post-tag");

//get tag
router.get('/posttags', async (req, res, next) => {
    try {
        const data = await postTags.find().sort({ created_at: -1 });
        const total_post = await postTags.countDocuments();
        res.send({
        total: total_post,
        postTags: data,
        });
      }
      catch (error) {
      next(error)
      }
    })
    //get Tag By Slug
      router.get("/tag_by_slug/:slug", async (req, res, next) => {
      try {
      const data = await postTags.find({slug:req.params.slug})
      res.send({ data: data })
      }
      catch (error) {
      next(error)
      }
      });
      //get Tag By Id for update
      router.get("/tag_by_id/:slug", async (req, res, next) => {
        try {
        const data = await postTags.find({_id:req.params.slug})
        res.send({ data: data })
        }
        catch (error) {
        next(error)
        }
        });
        //get tag
  router.get('/getallTag', async (req, res, next) => {

    try {
      const data = await postTags.find().sort({ created_at: -1 });
      res.send(data);
    }
    catch (error) {
      next(error)
    }
  })

// route for pagination
router.get('/api/tagitems', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || parseInt(req.query.limit);
    const totalItems = await postTags.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    const items = await postTags
      .find({}).sort({ created_at: -1 })
      .limit(limit)
      .skip((currentPage - 1) * limit)
    res.status(200).json({
      items,
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage: limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving items');
  }
});

router.get("/getposttagssearch", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = String(req.query.searchdata);
    const skips = limit * offset;

    var sortObject = {};
    var sort_col = String(req.query.sort_col);
    var sort_order = String(req.query.sort_order);
    sortObject[sort_col] = sort_order;
    if (search!='') {
      const colName = search;
      const postCollection = await postTags.find({
        $or: [
          { tag: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await postTags.countDocuments({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: postCollection,
      });
    } else {
      const postCollection = await postTags.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await postTags.countDocuments();
      res.send({
        total: total_pages,
        data: postCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get postTags by ID
router.get('/posttags/:id', async (req, res, next) => {

  try {
    const data = await postTags.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create post
router.post("/posttags", async (req, res, next) => {
  try {
    const {
      tag,
      slug,
      description,
      status,
      created_at,
      updated_at,
    } = req.body;
    const mypost = new postTags({
      tag,
      slug,
      description,
      status,
      created_at,
      updated_at,
    });
    const addpost = await mypost.save();
    res.send(addpost);
  } catch (error) {
    next(error);
  }
});
//Update post
router.patch("/posttags/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await postTags.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete post
router.delete("/posttags/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await postTags.findOne({ _id: id });
    if (find) {
      const deleted = await postTags.findByIdAndDelete({ _id: id });
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
    const data = await postTags.find({slug:req.params.slug})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
module.exports = router;

