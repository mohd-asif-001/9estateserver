require('dotenv').config();
const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Register = require("../../models/register");
const bcrypt = require("bcrypt");



//get Register
router.get('/register', async (req, res, next) => {
  try {
    const data = await Register.find()
    const total_register = await Register.countDocuments();
    res.send({
      total: total_register,
      register: data,
    });
  }
  catch (error) {
    next(error)
  }
})
// //get admin details
// router.get('/register/:adminid',(req, res,next)=>{
//   console.log(req.params.adminid)

// })
router.post("/checkadminlogin", async (req, res, next) => {
  try {
    const uname = String(req.body.uname);
    const password = String(req.body.password);
    const find = await Register.findOne({ uname:String(req.body.uname), role:"0" });
    if (find === null) {
      res.send({status:0});
    } else {
      const trueUser = await bcrypt.compare(password, find.password);
      if(trueUser==false){
          res.send({status:0});
      }else{
          res.send({
          id: find._id,
          userId: find.uname,
          role: find.role,
          status:1
        });
      }
    }
  } catch (error) {
    
    next(error);
  }
})
router.post("/checkagentlogin", async (req, res, next) => {
  try {
    const uname = String(req.body.uname);
    const password = String(req.body.password);
    const find = await Register.findOne({ uname:String(req.body.uname), role:"1"});
    if (find === null) {
      res.send({status:0});
    } else {
      const trueUser = await bcrypt.compare(password, find.password);
      if(trueUser==false){
          res.send({status:0});
      }else{
          res.send({
          id: find._id,
          userId: find.uname,
          role: find.role,
          status:1
        });
      }
    }
  } catch (error) {
    
    next(error);
  }
})
router.get("/getregisterssearch", async (req, res, next) => {
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
      const registersCollection = await Register.find({
        $or: [
          { username: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Register.countDocuments({
        $or: [
          { username: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: registersCollection,
      });
    } else {
      const registerCollection = await Register.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Register.countDocuments();
      res.send({
        total: total_pages,
        data: registerCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Register by ID
router.get('/register/:id', async (req, res, next) => {

  try {
    const data = await Register.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create Register
router.post("/register", async (req, res, next) => {
  try {
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(req.body.password, salt);
    const registersave = new Register({
        company_id:req.body.company_id,
        username:req.body.username,
        email:req.body.email,
        receiveNewsletter:req.body.receiveNewsletter,
        passsword:req.body.passsword,
        password:newpassword,
        userType:req.body.userType,
        join_dt:req.body.join_dt,
        approve_status:req.body.approve_status,
        update_dt:req.body.update_dt,
    });
    const addregister = await registersave.save();
    res.send(addregister);
  } catch (error) {
    next(error);
  }
});
//Update Register
router.patch("/register/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Register.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Register
router.delete("/register/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Register.findOne({ _id: id });
    if (find) {
      const deleted = await Register.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

