const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Categories = require("../../models/categories");

//get Categories
router.get('/categories', async (req, res, next) => {

  try {
    const data = await Categories.find()
    const total_categories = await Categories.countDocuments();

    res.send({
      total: total_categories,
      categories: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getCategorysearch", async (req, res, next) => {
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
      const categoryCollection = await Categories.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Categories.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: categoryCollection,
      });
    } else {
      const categoryCollection = await Categories.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Categories.countDocuments();
      res.send({
        total: total_pages,
        data: categoryCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Categories by ID
router.get('/categories/:id', async (req, res, next) => {
  try {
    const data = await Categories.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create Category
router.post("/categories", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      title,
      description,
      status,
    } = req.body;
    
    const categories = new Categories({
      title,
      description,
      status,
    });
    const addCategory = await categories.save();
    res.send(addCategory);
  } catch (error) {
    next(error);
  }
});
//Update Category
router.patch("/categories/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Categories.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Category
router.delete("/categories/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Categories.findOne({ _id: id });
    if (find) {
      const deleted = await Categories.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;
