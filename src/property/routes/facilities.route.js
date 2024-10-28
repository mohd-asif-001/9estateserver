const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Facility = require("../../models/facilities");

//get Categories
router.get('/admin/getactivefacilities', async (req, res, next) => {
  try {
    const data = await Facility.find({status:'Yes'});
    res.send(data);
  }
  catch (error) {
    next(error)
  }
});

router.get('/myfacility', async (req, res, next) => {

  try {
    const data = await Facility.find()
    const total_facility = await Facility.countDocuments();

    res.send({
      total: total_facility,
      facility: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getmyfacilitysearch", async (req, res, next) => {
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
      const facilityCollection = await Facility.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Facility.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: facilityCollection,
      });
    } else {
      const facilityCollection = await Facility.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Facility.countDocuments();
      res.send({
        total: total_pages,
        data: facilityCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Categories by ID
router.get('/myfacility/:id', async (req, res, next) => {

  try {
    const data = await Facility.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create Category
router.post("/myfacility", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      title,
      icon,
      status,
      created_at,
      updated_at
    } = req.body;
    
    const facility = new Facility({
      title,
      icon,
      status,
      created_at,
      updated_at
    });
    const addfacility = await facility.save();
    res.send(addfacility);
  } catch (error) {
    next(error);
  }
});
//Update Category
router.patch("/myfacility/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Facility.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Category
router.delete("/myfacility/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Facility.findOne({ _id: id });
    if (find) {
      const deleted = await Facility.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

