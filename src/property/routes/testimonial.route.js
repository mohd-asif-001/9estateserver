const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Testimonial = require("../../models/testimonial");

//get testimonial
router.get('/testimonial', async (req, res, next) => {

  try {
    const data = await Testimonial.find()
    const total_testimonials = await Testimonial.countDocuments();
    res.send({
      total: total_testimonials,
      testimonials: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/gettestimonialsearch", async (req, res, next) => {
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
      const testimonialCollection = await Testimonial.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Testimonial.countDocuments({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: testimonialCollection,
      });
    } else {
      const testimonialCollection = await Testimonial.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Testimonial.countDocuments();
      res.send({
        total: total_pages,
        data: testimonialCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get testimonials by ID
router.get('/testimonial/:id', async (req, res, next) => {

  try {
    const data = await Testimonial.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create testimonial
router.post("/testimonial", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      testimonial_img,
      name,
      designation,
      description,
      status,
      created_at,
      updated_at
    } = req.body;
    const myTestimonial = new Testimonial({
      testimonial_img,
      name,
      designation,
      description,
      status,
      created_at,
      updated_at
    });
    const addtestimonial = await myTestimonial.save();
    res.send(addtestimonial);
  } catch (error) {
    next(error);
  }
});
//Update testimonial
router.patch("/testimonial/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Testimonial.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete testimonial
router.delete("/testimonial/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Testimonial.findOne({ _id: id });
    if (find) {
      const deleted = await Testimonial.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

