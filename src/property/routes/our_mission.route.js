const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const OurMission = require("../../models/our_mission");

router.get('/ourmission', async (req, res, next) => {
  try {
    const data = await OurMission.find()
    const total_data= await OurMission.countDocuments();
    res.send({
    total: total_data,
    Ourmissions: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getOurmissionsearch", async (req, res, next) => {
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
      const ourmissionCollection = await OurMission.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await OurMission.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: ourmissionCollection,
      });
    } else {
      const ourmissionCollection = await OurMission.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await OurMission.countDocuments();
      res.send({
        total: total_pages,
        data: ourmissionCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});

//Create Ourmission
router.post("/ourmission", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
        title,
        description,
        image,
        created_at,
        updated_at,
        status,
    } = req.body;
    const ourmissions= new OurMission({
        title,
        description,
        image,
        created_at,
        updated_at,
        status,
    });
    const addourmission = await ourmissions.save();
    res.send(addourmission);
  } catch (error) {
    next(error);
  }
});
//Update Ourmission
router.patch("/ourmission/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await OurMission.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Ourmission
router.delete("/ourmission/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await OurMission.findOne({ _id: id });
    if (find) {
      const deleted = await OurMission.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

