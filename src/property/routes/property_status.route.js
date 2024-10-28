const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Properties_status = require("../../models/property_status");

//get PropertiesStatus
router.get('/admin/getpropertystatus', async (req, res, next) => {

  try {
    const data = await Properties_status.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})

router.get('/mypropertystatus', async (req, res, next) => {

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
      const accountsCollection = await Properties_status.find({$or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties_status.countDocuments({$or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      });
      res.send({
        total: total_pages,
        Properties_status: accountsCollection,
      });
    } else {
      const accountCollection = await Properties_status.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties_status.countDocuments();
      res.send({
        total: total_pages,
        Properties_status: accountCollection,
      });
    }
  } catch (error) {
    next(error);
  }
})
router.get('/getActivePropertystatus', async (req, res, next) => {
  try {
    const colName = 'Yes';
    const total_Properties_status = await Properties_status.find({
      $or: [
        { status: { $regex: new RegExp("^" + colName, "i") } },
      ],
    })
    // const total_Properties_status = await Properties_status.countDocuments();
    res.send({
      total: total_Properties_status,
       Properties_status: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getmypropertystatussearch", async (req, res, next) => {
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
      const mypropertystatusCollection = await Properties_status.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties_status.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: mypropertystatusCollection,
      });
    } else {
      const mypropertystatusCollection = await Properties_status.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties_status.countDocuments();
      res.send({
        total: total_pages,
        data: mypropertystatusCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get PropertiesStatus by ID
router.get('/mypropertystatus/:id', async (req, res, next) => {

  try {
    const data = await Properties_status.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create Category
router.post("/mypropertystatus", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      title,
      status,
      created_at,
      updated_at
    } = req.body;
    
    const properties_status = new Properties_status({
      title,
      status,
      created_at,
      updated_at
    });
    const addProperties_status = await properties_status.save();
    res.send(addProperties_status);
  } catch (error) {
    next(error);
  }
});
//Update Category
router.patch("/mypropertystatus/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Properties_status.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Category
router.delete("/mypropertystatus/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Properties_status.findOne({ _id: id });
    if (find) {
      const deleted = await Properties_status.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

