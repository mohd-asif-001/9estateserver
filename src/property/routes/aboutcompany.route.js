const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Aboutcompany = require("../../models/about_company");


router.get('/aboutcompany', async (req, res, next) => {
  try {
    const data = await Aboutcompany.find()
    const total_data= await Aboutcompany.countDocuments();
    res.send({
      total: total_data,
      aboutcompanys: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getAboutcompanyssearch", async (req, res, next) => {
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
      const aboutcompanyCollection = await Aboutcompany.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Aboutcompany.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: aboutcompanyCollection,
      });
    } else {
      const aboutcompanyCollection = await Aboutcompany.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Aboutcompany.countDocuments();
      res.send({
        total: total_pages,
        data: aboutcompanyCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});

//Create Aboutcompanys
router.post("/aboutcompany", async (req, res, next) => {
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
    const aboutcompanys = new Aboutcompany({
        icon_name,
        title,
        description,
        created_at,
        updated_at,
        status,
    });
    const addaboutcompany = await aboutcompanys.save();
    res.send(addaboutcompany);
  } catch (error) {
    next(error);
  }
});
//Update Aboutcompanys
router.patch("/aboutcompany/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Aboutcompany.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Aboutcompanys
router.delete("/aboutcompany/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Aboutcompany.findOne({ _id: id });
    if (find) {
      const deleted = await Aboutcompany.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

