const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Contact = require("../../models/contact");
const axios = require('axios');
async function postcontactDatamail(data) {	
  var nm = data.name;	
  var new_nm = nm.replaceAll(' ', '_');	
  const url = 'https://9estate.com/mail/sendmail/contact_mail.php?email='+data.email+'&phone='+data.phone+'&name_new='+new_nm+'&encoded_email='+data.path_url; // Replace with your PHP server URL and endpoint	
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
router.get('/contact', async (req, res, next) => {

  try {
    const data = await Contact.find({trash:0})
    const total_Contact = await Contact.countDocuments({trash:0});
    res.send({
      total: total_Contact,
    Contact: data,
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
      const contactCollection = await Contact.find({$and: [{trash:1},
        {$or: [
            { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  }).skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Contact.countDocuments({$and: [{trash:1},
        {$or: [
            { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  });
      res.send({
        total: total_pages,
        data: contactCollection,
      });
    } else {
      const contactCollection = await Contact.find({trash:0})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Contact.countDocuments({trash:0});
      res.send({
        total: total_pages,
        data: contactCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Contact by ID
router.get('/contact/:id', async (req, res, next) => {

  try {
    const data = await Contact.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create new contact
router.post("/contact", async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone:req.body.phone,
    path_url:'https://9estate.com'
  };
  postcontactDatamail(data);
  try {
    //console.log(req.body);
    const {
        name,
        email,
        phone,
        message,
        created_at,
    } = req.body;
    const mycontact = new Contact({
      name,
      email,
      phone,
      message,
      created_at,
    });
    const addcontact = await mycontact.save();
    res.send(addcontact);
  } catch (error) {
    next(error);
  }
});
//contacts export
router.get('/contactsExport', async (req, res, next) => {
  try {
    const data = await Contact.find({trash:0}).select("name email phone message -_id");
    const total_contacts = await Contact.countDocuments({trash:0});
    res.send({
      total: total_contacts,
      data: data,
    });
  }
  catch (error) {
    next(error)
  }
});
//Update tag
router.patch("/contact/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Contact.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete tag
router.delete("/contact/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Contact.findOne({ _id: id });
    if (find) {
      const deleted = await Contact.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
//get all Trashed Contacts
router.get('/trash_contacts', async (req, res, next) => {
  try {
      const data = await Contact.find({trash:1})
      const total_Contacts = await Contact.countDocuments({trash:1});
      res.send({
      total: total_Contacts,
      Contact: data,
      });
    }
    catch (error) {
    next(error)
    }
  })
  
  router.delete("/trash_contact/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Contact.findOne({ _id: id });
    if (find) {
      const update = {'trash':1};
      const id = req.params.id;
      const option = { new: true };
      const deleted = await Contact.findByIdAndUpdate(id, update, option);
     
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});

//Get search trash Contacts
router.get("/getcontactsearch_trash", async (req, res, next) => {
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
      const contactCollection = await Contact.find({$and: [{trash:1},
        {$or: [
            { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Contact.countDocuments({$and: [{trash:1},
        {$or: [
            { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  });
      res.send({
        total: total_pages,
        data: contactCollection,
      });
    } else {
      const contactCollection = await Contact.find({trash:1})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Contact.countDocuments({trash:1});
      res.send({
        total: total_pages,
        data: contactCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;