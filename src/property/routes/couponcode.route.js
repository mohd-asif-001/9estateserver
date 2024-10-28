const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const couponCode = require("../../models/coupon_code");

//get PropertiesStatus
router.get('/admin/getcouponCode', async (req, res, next) => {

  try {
    const data = await couponCode.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})

router.get('/mycouponCode', async (req, res, next) => {

  try {
    const data = await couponCode.find()
    const total_couponCode = await couponCode.countDocuments();
    res.send({
      total: total_couponCode,
       plans: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get('/getActivecouponCode', async (req, res, next) => {
  try {
    const colName = 'Yes';
    const total_couponCode = await couponCode.find({
      $or: [
        { status: { $regex: new RegExp("^" + colName, "i") } },
      ],
    })
    // const total_Properties_status = await Properties_status.countDocuments();
    res.send({
      total: total_couponCode,
       Properties_status: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getmycouponCodesearch", async (req, res, next) => {
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
      const mycouponCodeCollection = await couponCode.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await couponCode.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: mycouponCodeCollection,
      });
    } else {
      const mycouponCodeCollection = await couponCode.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await couponCode.countDocuments();
      res.send({
        total: total_pages,
        data: mycouponCodeCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get PropertiesStatus by ID
router.get('/couponCode/:id', async (req, res, next) => {

  try {
    const data = await couponCode.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
router.get('/checkcouponCode/:coupon', async (req, res, next) => {

  try {
    const data = await couponCode.find({coupon_code:req.params.coupon})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create Category
router.post("/couponCode", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      coupon_code,
      discount_type,
      discount_amount,
      status,
      created_at,
      updated_at
    } = req.body;
    
    const plan = new couponCode({
        coupon_code,
        discount_type,
        discount_amount,
        status,
        created_at,
        updated_at
    });
    const addcouponCode = await plan.save();
    res.send(addcouponCode);
  } catch (error) {
    next(error);
  }
});
//Update Category
router.patch("/mycouponCode/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await couponCode.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Category
router.delete("/mycouponCode/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await couponCode.findOne({ _id: id });
    if (find) {
      const deleted = await couponCode.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
//Expire Coupon Code
router.delete("/expireCouponCode", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await couponCode.findOne({ _id: id });
    if (find) {
      const deleted = await couponCode.findByIdAndUpdate({ _id: id });
      res.send(deleted);
    } else {
      res.send("Coupon code is not exists");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

