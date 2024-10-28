const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Street = require("../../models/street");
//get street
router.get('/admin/getactivestreet', async (req, res, next) => {
  try {
    const data = await Street.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})
router.get('/street', async (req, res, next) => {
  try {
    const data = await Street.find()
    const total_street = await Street.countDocuments();
    res.send({
      total: total_street,
     street: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getallstreet", async (req, res, next) => {
  try {
    const street = await Street.find();
    res.send(street);
  } catch (error) {
    next(error);
  }
});
router.get("/getstreetsearch", async (req, res, next) => {
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
      const streetCollection = await Street.find({
        $or: [
          { streetname: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Street.countDocuments({
        $or: [
          { streetname: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: streetCollection,
      });
    } else {
      const streetCollection = await Street.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Street.countDocuments();
      res.send({
        total: total_pages,
        data: streetCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Categories by ID
router.get('/street/:id', async (req, res, next) => {

  try {
    const data = await Street.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create Category
router.post("/street", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      cityid,
      zipcodeid,
      neighborhood,
      streetname,
      status,
      created_at,
      updated_at
    } = req.body;
    
    const street = new Street({
      cityid,
      zipcodeid,
      neighborhood,
      streetname,
      status,
      created_at,
      updated_at
    });
    const addstreet = await street.save();
    res.send(addstreet);
  } catch (error) {
    next(error);
  }
});
//Update Category
router.patch("/street/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Street.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Category
router.delete("/street/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Street.findOne({ _id: id });
    if (find) {
      const deleted = await Street.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

