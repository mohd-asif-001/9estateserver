const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const PostRightbar = require("../../models/post_right_bar");

router.get('/postrightbar', async (req, res, next) => {
  try {
    const data = await PostRightbar.find()
    const total_data= await PostRightbar.countDocuments();
    res.send({
    total: total_data,
    Postrightbar: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getPostrightbarearch", async (req, res, next) => {
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
      const postrightbarCollection = await PostRightbar.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await PostRightbar.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: postrightbarCollection,
      });
    } else {
      const postrightbarCollection = await PostRightbar.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await PostRightbar.countDocuments();
      res.send({
        total: total_pages,
        data: postrightbarCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});

//Create Ourmission
router.post("/postrightbar", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
        image,
        linkurl,
        created_at,
        updated_at,
        status,
    } = req.body;
    const postrightbars= new PostRightbar({
        image,
        linkurl,
        created_at,
        updated_at,
        status,
    });
    const addpostrightbar = await postrightbars.save();
    res.send(addpostrightbar);
  } catch (error) {
    next(error);
  }
});
//Update Ourmission
router.patch("/postrightbar/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await PostRightbar.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Ourmission
router.delete("/postrightbar/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await PostRightbar.findOne({ _id: id });
    if (find) {
      const deleted = await PostRightbar.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

