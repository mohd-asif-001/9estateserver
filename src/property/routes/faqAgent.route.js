const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Faq = require("../../models/faqAgent");

//get faq
router.get('/faq', async (req, res, next) => {

  try {
    const data = await Faq.find()
    const total_faq = await Faq.countDocuments();
    res.send({
      total: total_faq,
      faq: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getfaqsearch", async (req, res, next) => {
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
      const faqCollection = await Faq.find({
        $or: [
          { question: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Faq.countDocuments({
        $or: [
          { question: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: faqCollection,
      });
    } else {
      const faqCollection = await Faq.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Faq.countDocuments();
      res.send({
        total: total_pages,
        data: faqCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get faq by ID
router.get('/faq/:id', async (req, res, next) => {

  try {
    const data = await Faq.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create faq
router.post("/faq", async (req, res, next) => {
  try {
    const {
        question,
        answer,
        status,
        created_at,
        updated_at
    } = req.body;
    
    const myTag = new Faq({
        question,
        answer,
        status,
        created_at,
        updated_at
    });
    const addfaq = await myTag.save();
    res.send(addfaq);
  } catch (error) {
    next(error);
  }
});
//Update faq
router.patch("/faq/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Faq.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete faq
router.delete("/faq/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Faq.findOne({ _id: id });
    if (find) {
      const deleted = await Faq.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

