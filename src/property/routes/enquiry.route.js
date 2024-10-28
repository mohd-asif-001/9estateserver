require('dotenv').config();
const express = require("express");
const createError = require("http-errors");
const EnquiryReply = require("../../models/enquiryreply");
const router = express.Router();
const Enquiry = require("../../models/enquiry");
"use strict";
const axios = require('axios');
async function postproductcontactDatamail(data) {	
  var ptitle = data.property_title;
  var new_ptitle = ptitle.replaceAll(' ', '_');	
  var nm = data.name;	
  var new_nm = nm.replaceAll(' ', '_');	
  const url = 'https://9estate.com/mail/sendmail/property_contact_mail.php?email='+data.email+'&phone='+data.phone+'&name_new='+new_nm+'&encoded_email='+data.path_url+'&property_id='+data.property_id+'&new_ptitle='+new_ptitle; // Replace with your PHP server URL and endpoint	
  try {	
    const response = await axios.post(url, data);	
    console.log('Post request successful!', response.data);	
    // Handle the response from the PHP server	
  } catch (error) {	
    console.error('Error occurred:', error);	
    // Handle the error	
  }	
}

// Send email for enquiry


//get Categories
router.get('/enquiry', async (req, res, next) => {
    try {
      const userlgn = String(req.query.userid);
        const data = await Enquiry.find({userid:userlgn, trash:0})
        const total_Enquiry = await Enquiry.countDocuments({userid:userlgn, trash:0});
        res.send({
        total: total_Enquiry,
        Enquiry: data,
        });
      }
      catch (error) {
      next(error)
      }
    })
//get all Enquiries

router.get('/enquiryUserWithNotifications', async (req, res, next) => {

  
  try {
    const userlgn = String(req.query.login_agentId)
    console.log(userlgn);
    console.log('data');
    const data = await Enquiry.aggregate([
      {
        $match: {
          userid: userlgn,
          trash: 0
        }
      },
      {
        $lookup: {
          from: 'notifications',
          let: { enquiryIdAsString: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$rel_id', '$$enquiryIdAsString'] },
                    { $eq: ['$status', '0'] }
                  ]
                }
              }
            }
          ],
          as: 'notifications'
        }
      }
    ]);
    

      res.send({
      Enquiry: data,
      });
    }
    catch (error) {
    next(error)
    }
  })

// Send email for enquiry

router.get('/enquiryWithNotifications', async (req, res, next) => {

  
  try {
    const userlgn = String(req.query.login_agentId)
    console.log(userlgn);
    console.log('data');
    const data = await Enquiry.aggregate([
      {
        $match: {
          agentid: userlgn,
          trash: 0
        }
      },
      {
        $lookup: {
          from: 'notifications',
          let: { enquiryIdAsString: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$rel_id', '$$enquiryIdAsString'] },
                    { $eq: ['$status', '0'] }
                  ]
                }
              }
            }
          ],
          as: 'notifications'
        }
      }
    ]);
    

      res.send({
      Enquiry: data,
      });
    }
    catch (error) {
    next(error)
    }
  });
  router.get('/getEnquiryDetailsByEnqId/:id', async (req, res, next) => {

  try {
    const data = await Enquiry.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
});
  router.get('/totalUsersnwenquiry', async (req, res, next) => {
  try {
    const userid = String(req.query.userid);
    
    const data = await Enquiry.find({userid:userid, trash:0});
    const total_enquiry_by_id = await Enquiry.countDocuments({userid:userid, trash:0});
    res.send({
      AgentEnq: data,
      total: total_enquiry_by_id,
    });
  }
  catch (error) {
    next(error)
  }
});
router.get('/enquiries', async (req, res, next) => {
  try {
      const data = await Enquiry.find({trash:0})
      const total_Enquiry = await Enquiry.countDocuments({trash:0});
      res.send({
      total: total_Enquiry,
      Enquiry: data,
      });
    }
    catch (error) {
    next(error)
    }
  })
//get all Trashed Enquiries
router.get('/trash_enquiries', async (req, res, next) => {
  try {
      const data = await Enquiry.find({trash:1})
      const total_Enquiry = await Enquiry.countDocuments({trash:1});
      res.send({
      total: total_Enquiry,
      Enquiry: data,
      });
    }
    catch (error) {
    next(error)
    }
  })
//get Categories
router.get('/enquirybyid', async (req, res, next) => {
  try {
    const lgnId= String(req.query.login_agentId);
    const data = await Enquiry.find({agentid:lgnId})
    const total_Enquiry = await Enquiry.countDocuments({agentid:lgnId});
    res.send({
      total: total_Enquiry,
      Enquiry: data,
    });
    }
        catch (error) {
        next(error)
        }
  })
//Get all enquiry by agent id
router.get('/totalagentenquiry', async (req, res, next) => {
  try {
    const agent_id = String(req.query.storage_data);
    const data = await Enquiry.find({agentid:agent_id, trash:0});
    const total_enquiry_by_id = await Enquiry.countDocuments({agentid:agent_id, trash:0});
    res.send({
      AgentEnq: data,
      total: total_enquiry_by_id,
    });
  }
  catch (error) {
    next(error)
  }
});
//Enquiry export
router.get('/enquiryExport', async (req, res, next) => {
  try {
    const data = await Enquiry.find({trash:0}).select("name email phone property_title -_id");
    const total_enquiries = await Enquiry.countDocuments({trash:0});
    res.send({
      total: total_enquiries,
      data: data,
    });
  }
  catch (error) {
    next(error)
  }
});
//sender name 
router.get('/enquirysendername', async (req, res, next) => {
  try {
        const userid = req.query.userid;
        const find = await Enquiry.findOne({sender_id: userid});
        console.log("here is",find);
        res.send({
          sendername: find,
        });
  } catch (error) {
   next(error)
  }
});
router.get("/getenquirysearch", async (req, res, next) => {
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
      const enquiryCollection = await Enquiry.find({$and: [{trash:0},
        {$or: [
            { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
            { property_id: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Enquiry.countDocuments({$and: [{trash:0},
        {$or: [
            { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
            { property_id: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  });
  console.log('all pages -', total_pages);
      res.send({
        total: total_pages,
        data: enquiryCollection,
      });
    } else {
      const enquiryCollection = await Enquiry.find({trash:0})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Enquiry.countDocuments({trash:0});
      res.send({
        total: total_pages,
        data: enquiryCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
router.get("/getenquirysearchNormalUser", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = String(req.query.searchdata);
    const login_agentId = String(req.query.login_agentId);
    
    const skips = limit * offset;
   
    var sortObject = {};
    var sort_col = String(req.query.sort_col);
    var sort_order = String(req.query.sort_order);
    sortObject[sort_col] = sort_order;
    if (search) {
      const colName = search;
      const enquiryCollection = await Enquiry.find({$and: [{trash:0,userid:login_agentId},
        {$or: [
            { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
            { property_id: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Enquiry.countDocuments({$and: [{trash:0,userid:login_agentId},
        {$or: [
            { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
            { property_id: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  });
  console.log('all pages -', total_pages);
      res.send({
        total: total_pages,
        data: enquiryCollection,
      });
    } else {
      const enquiryCollection = await Enquiry.find({trash:0,userid:login_agentId})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Enquiry.countDocuments({trash:0,userid:login_agentId});
      res.send({
        total: total_pages,
        data: enquiryCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
router.get("/getenquirysearchAgent", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = String(req.query.searchdata);
    const login_agentId = String(req.query.login_agentId);
    
    const skips = limit * offset;
   
    var sortObject = {};
    var sort_col = String(req.query.sort_col);
    var sort_order = String(req.query.sort_order);
    sortObject[sort_col] = sort_order;
    if (search) {
      const colName = search;
      const enquiryCollection = await Enquiry.find({$and: [{trash:0,agentid:login_agentId},
        {$or: [
            { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
            { property_id: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Enquiry.countDocuments({$and: [{trash:0,agentid:login_agentId},
        {$or: [
            { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
            { property_id: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  });
  console.log('all pages -', total_pages);
      res.send({
        total: total_pages,
        data: enquiryCollection,
      });
    } else {
      const enquiryCollection = await Enquiry.find({trash:0,agentid:login_agentId})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Enquiry.countDocuments({trash:0,agentid:login_agentId});
      res.send({
        total: total_pages,
        data: enquiryCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Enquiry by ID
router.get('/enquiry/:id', async (req, res, next) => {

  try {
    const data = await Enquiry.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create tag
router.post("/enquiry_new", async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone:req.body.phone,
    property_id:req.body.property_id,
    property_title:req.body.property_title,
    path_url:'https://9estate.com'
  };
  postproductcontactDatamail(data);
  try {
    const {
        userid,
        agentid,
        property_id,
        property_title,
        name,
        email,
        phone,
        message,
        created_at,
        updated_at,
    } = req.body;
    const myEnquiry = new Enquiry({
      userid,
      agentid,
      property_id,
      property_title,
      name,
      email,
      phone,
      message,
      created_at,
      updated_at,
    });
    const addenquiry = await myEnquiry.save();

    const myEnquiryReply = new EnquiryReply({
      enq_id:addenquiry._id,
      sender_id:req.body.userid,
      sendFrom:req.body.name,
      message:req.body.message,
      status:"0"
    });
    const addmyEnquiryReply = await myEnquiryReply.save();

    //console.log('dt ->', addmyEnquiryReply);

    res.send(addenquiry);
  } catch (error) {
    next(error);
  }
});
router.post("/enquiry", async (req, res, next) => {
  try {
    const {
        userid,
        agentid,
        property_id,
        property_title,
        name,
        email,
        phone,
        message,
        created_at,
        updated_at,
    } = req.body;
    const myEnquiry = new Enquiry({
      userid,
      agentid,
      property_id,
      property_title,
      name,
      email,
      phone,
      message,
      created_at,
      updated_at,
    });
    const addenquiry = await myEnquiry.save();
    res.send(addenquiry);
  } catch (error) {
    next(error);
  }
});
//Update tag
router.patch("/enquiry/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Enquiry.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete tag
router.delete("/enquiry/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Enquiry.findOne({ _id: id });
    if (find) {
      const deleted = await Enquiry.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
router.delete("/trash_enquiry/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Enquiry.findOne({ _id: id });
    if (find) {
      const update = {'trash':1};
      const id = req.params.id;
      const option = { new: true };
      const deleted = await Enquiry.findByIdAndUpdate(id, update, option);
      //const deleted = await Properties.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
//Get search trash enquiries
router.get("/getenquirysearch_trash", async (req, res, next) => {
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
      const enquiryCollection = await Enquiry.find({$and: [{trash:1},
        {$or: [
            { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Enquiry.countDocuments({$and: [{trash:1},
        {$or: [
            { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  });
      res.send({
        total: total_pages,
        data: enquiryCollection,
      });
    } else {
      const enquiryCollection = await Enquiry.find({trash:1})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Enquiry.countDocuments({trash:1});
      res.send({
        total: total_pages,
        data: enquiryCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;