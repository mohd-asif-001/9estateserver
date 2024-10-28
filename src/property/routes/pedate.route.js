const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Pedate = require("../../models/pedate");

//get pedate
router.get('/pedate', async (req, res, next) => {
  try {
    const data = await Pedate.find()
    const total_pedate = await Pedate.countDocuments();
    res.send({
      total: total_pedate,
      pedate: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getpedatesearch", async (req, res, next) => {
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
      const pedateCollection = await Pedate.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Pedate.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: pedateCollection,
      });
    } else {
      const pedateCollection = await Pedate.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Pedate.countDocuments();
      res.send({
        total: total_pages,
        data: pedateCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get pedate by ID
router.get('/pedate/:id', async (req, res, next) => {
  try {
    const data = await Pedate.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create pedate
router.post("/pedate", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      rent,
      sale,
      created_at,
      updated_at
    } = req.body;
    const pedate = new Pedate({
      rent,
      sale,
      created_at,
      updated_at
    });
    const addpedate = await pedate.save();
    res.send(addpedate);
  } catch (error) {
    next(error);
  }
});
//Update pedate
router.patch("/pedate/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Pedate.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete pedate
router.delete("/pedate/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Pedate.findOne({ _id: id });
    if (find) {
      const deleted = await Pedate.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

