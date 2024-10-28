const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const OurClient = require("../../models/our_clients");

router.get('/ourclient', async (req, res, next) => {
  try {
    const data = await OurClient.find()
    const total_data= await OurClient.countDocuments();
    res.send({
    total: total_data,
    Ourclients: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getOurclientsearch", async (req, res, next) => {
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
      const ourclientCollection = await OurClient.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await OurClient.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: ourclientCollection,
      });
    } else {
      const ourclientCollection = await OurClient.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await OurClient.countDocuments();
      res.send({
        total: total_pages,
        data: ourclientCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});

//Create Ourclients
router.post("/ourclient", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
        title,
        sub_title,
        alt_name,
        image,
        created_at,
        updated_at,
        status,
    } = req.body;
    const ourclients= new OurClient({
        title,
        sub_title,
        alt_name,
        image,
        created_at,
        updated_at,
        status,
    });
    const addourclient = await ourclients.save();
    res.send(addourclient);
  } catch (error) {
    next(error);
  }
});
//Update Ourclients
router.patch("/ourclient/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await OurClient.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Ourclients
router.delete("/ourclient/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await OurClient.findOne({ _id: id });
    if (find) {
      const deleted = await OurClient.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

