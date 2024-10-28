const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const AgentContact = require("../../models/agentcontact");
const axios = require('axios');
async function agentDatamail(data) {	
  var nm = data.name;	
  var new_nm = nm.replaceAll(' ', '_');	
  var agentEmail= data.agentEmail;
  var agentName = data.agentName;
  var new_name = agentName.replaceAll(' ', '_');	
  const url = 'https://9estate.com/mail/sendmail/agent_contact_mail.php?email='+data.email+'&agentName='+new_name+'&phone='+data.phone+'&name_new='+new_nm+'&encoded_email='+data.path_url+'&agentEmail='+agentEmail; // Replace with your PHP server URL and endpoint	
  try {	
    const response = await axios.post(url, data);	
    console.log('Post request successful!', response.data);	
    // Handle the response from the PHP server	
  } catch (error) {	
    console.error('Error occurred:', error);	
    // Handle the error	
  }	
}
async function agentUserDatamail(data) {	
  var nm = data.name;	
  var new_nm = nm.replaceAll(' ', '_');	
  var agentEmail= data.agentEmail;
  var agentName = data.agentName;
  var new_name = agentName.replaceAll(' ', '_');	
  const url = 'https://9estate.com/mail/sendmail/agent_user_contact_mail.php?email='+data.email+'&agentName='+new_name+'&phone='+data.phone+'&name_new='+new_nm+'&encoded_email='+data.path_url+'&agentEmail='+agentEmail; // Replace with your PHP server URL and endpoint	
  try {	
    const response = await axios.post(url, data);	
    console.log('Post request successful!', response.data);	
    // Handle the response from the PHP server	
  } catch (error) {	
    console.error('Error occurred:', error);	
    // Handle the error	
  }	
}
//get Categories
router.get('/agentcontact', async (req, res, next) => {

  try {
    const agent_is=req.query.agentLgn;
    const data = await AgentContact.find({agentId:agent_is})
    const total_Contact = await AgentContact.countDocuments({agentId:agent_is});
    res.send({
      total: total_Contact,
    AgentContact: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getcontactsearch", async (req, res, next) => {
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
      const contactCollection = await AgentContact.find({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await AgentContact.countDocuments({
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: contactCollection,
      });
    } else {
      const contactCollection = await AgentContact.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await AgentContact.countDocuments();
      res.send({
        total: total_pages,
        data: contactCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get AgentContact by ID
router.get('/agentcontact/:id', async (req, res, next) => {

  try {
    const data = await AgentContact.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create tag
router.post("/agentcontact", async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone:req.body.phone,
    agentName:req.body.agentName,
    agentEmail:req.body.agentEmail,
    path_url:'https://9estate.com'
  };
  agentDatamail(data);
  agentUserDatamail(data);
  try {
    const {
        agentId,
        name,
        email,
        phone,
        message,
        contact_at,
    } = req.body;
    const mycontact = new AgentContact({
    agentId,
      name,
      email,
      phone,
      message,
      contact_at,
    });
    const addcontact = await mycontact.save();
    res.send(addcontact);
  } catch (error) {
    next(error);
  }
});
//Update tag
router.patch("/agentcontact/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await AgentContact.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete tag
router.delete("/agentcontact/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await AgentContact.findOne({ _id: id });
    if (find) {
      const deleted = await AgentContact.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

