const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const postCategory = require("../../models/post-category");

//get Categories
router.get('/postcategorys', async (req, res, next) => {
  try {
    const data = await postCategory.find().sort({ created_at: -1 });
    const total_post = await postCategory.countDocuments();
    res.send({
      total: total_post,
      postCategory: data,
    });
  }
  catch (error) {
    next(error)
  }
});

// route for pagination
router.get('/api/categoryitems', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || parseInt(req.query.limit);
    const totalItems = await postCategory.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    const items = await postCategory
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

//get data for dropdown
router.get('/p_categories', async (req, res, next) => {
  try {
    const data = await postCategory.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
});
//Get data by slug
router.get("/category_by_slug/:slug", async (req, res, next) => {
  try {
    const data = await postCategory.find({ slug: req.params.slug })
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
});
//Get data by id
router.get("/category_by_id/:slug", async (req, res, next) => {
  try {
    const data = await postCategory.find({ _id: req.params.slug })
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
});
//get Cotegary
router.get('/getallCategory', async (req, res, next) => {

  try {
    const data = await postCategory.find().sort({ created_at: -1 });
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})


router.get("/getpostcategoryssearch", async (req, res, next) => {
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
      const postCollection = await postCategory.find({
        $or: [
          { category: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await postCategory.countDocuments({
        $or: [
          { category: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: postCollection,
      });
    } else {
      const postCollection = await postCategory.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await postCategory.countDocuments();
      res.send({
        total: total_pages,
        data: postCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get postCategory by ID
router.get('/postcategorys/:id', async (req, res, next) => {

  try {
    const data = await postCategory.find({ _id: req.params.id })
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create post
router.post("/postcategorys", async (req, res, next) => {
  try {
    const {
      category,
      slug,
      parent_category,
      description,
      status,
      created_at,
      updated_at,
    } = req.body;
    const mypost = new postCategory({
      category,
      slug,
      parent_category,
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
router.patch("/postcategorys/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await postCategory.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete post
router.delete("/postcategorys/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await postCategory.findOne({ _id: id });
    if (find) {
      const deleted = await postCategory.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
    next(error)
  }
});
router.get('/checkslug/:slug', async (req, res, next) => {
  try {
    const data = await postCategory.find({ slug: req.params.slug })
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
module.exports = router;

