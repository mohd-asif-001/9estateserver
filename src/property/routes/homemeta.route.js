const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Homemetas = require("../../models/homemeta");

//get City
router.get('/admin/homemetas', async (req, res, next) => {

  try {
    const data = await Homemetas.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})
router.get('/homemetas', async (req, res, next) => {

  try {
    const data = await Homemetas.find()
    const total_homemetadatas = await Homemetas.countDocuments();
    res.send({
      total: total_homemetadatas,
      homemetadatas: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/gethomemetassearch", async (req, res, next) => {
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
      const homeCollection = await Homemetas.find({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Homemetas.countDocuments({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: homeCollection,
      });
    } else {
      const homeCollection = await Homemetas.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Homemetas.countDocuments();
      res.send({
        total: total_pages,
        data: homeCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get City by ID
router.get('/homemetas/:id', async (req, res, next) => {

  try {
    const data = await Homemetas.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create City
router.post("/homemetas", async (req, res, next) => {
  try {
    const {
      metatitle,
      metadescription,
      focuskeyword,
      headtagscript,
      created_at,
      updated_at,
    } = req.body;
    const homemetadatas = new Homemetas({
      metatitle,
      metadescription,
      focuskeyword,
      headtagscript,
      created_at,
      updated_at,
    });
    const addhomemeta = await homemetadatas.save();
    res.send(addhomemeta);
  } catch (error) {
    next(error);
  }
});
//Update City
router.patch("/homemetas/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Homemetas.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete City
router.delete("/homemetas/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Homemetas.findOne({ _id: id });
    if (find) {
      const deleted = await Homemetas.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

