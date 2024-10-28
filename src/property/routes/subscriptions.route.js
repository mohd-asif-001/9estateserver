const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const axios = require('axios');
const Subscriptions = require("../../models/subscriptions");

async function subscriptionsDatamailToAdmin(data) {	
	console.log('main data', data.email);	
	const url = 'https://9estate.com/mail/sendmail/subscriptions_email.php?email='+data.email; // Replace with your PHP server URL and endpoint	
	try {	
	  const response = await axios.post(url, data);	
	  console.log('Post request successful!', response.data);	
	  // Handle the response from the PHP server	
	} catch (error) {	
	  console.error('Error occurred:', error);	
	  // Handle the error	
	}	
}
async function subscriptionsDatamailToUser(data) {	
	console.log('main data', data.email);	
	const url = 'https://9estate.com/mail/sendmail/subscriptions_email_user_thankyou.php?email='+data.email; // Replace with your PHP server URL and endpoint	
	try {	
	  const response = await axios.post(url, data);	
	  console.log('Post request successful!', response.data);	
	  // Handle the response from the PHP server	
	} catch (error) {	
	  console.error('Error occurred:', error);	
	  // Handle the error	
	}	
}
//Create Subscriptions
router.post("/savesubscription", async (req, res, next) => {
  const data = {
    email: req.body.email
  };
  subscriptionsDatamailToAdmin(data);
  subscriptionsDatamailToUser(data);
  try {
    console.log(req.body);
    const {
        email
    } = req.body;
    const mySubscriptions = new Subscriptions({
        email
    });
    const addmySubscriptions = await mySubscriptions.save();
    res.send(addmySubscriptions);
  } catch (error) {
    next(error);
  }
});
router.get('/subscriptions', async (req, res, next) => {

  try {
    const data = await Subscriptions.find({'trash':0})
    const total_subscriptions = await Subscriptions.countDocuments({'trash':0});
    res.send({
      total: total_subscriptions,
      Feedback: data,
    });
  }
  catch (error) {
    next(error)
  }
});
router.get('/subscriptionsExport', async (req, res, next) => {

  try {
    const data = await Subscriptions.find().select("email -_id");
    const total_subscriptions = await Subscriptions.countDocuments();
    res.send({
      total: total_subscriptions,
    data: data,
    });
  }
  catch (error) {
    next(error)
  }
});
router.get("/getsubscriptionsearch", async (req, res, next) => {
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
      const subscriptionCollection = await Subscriptions.find({
        $or: [
          { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Subscriptions.countDocuments({
        $or: [
          { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: subscriptionCollection,
      });
    } else {
      const subscriptionCollection = await Subscriptions.find({'trash':0})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Subscriptions.countDocuments({'trash':0});
      res.send({
        total: total_pages,
        data: subscriptionCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});

//get subscription by ID
router.get('/subscriptions/:id', async (req, res, next) => {

  try {
    const data = await Subscriptions.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Update subscription
router.patch("/subscriptions/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Subscriptions.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete subscription
router.delete("/subscriptions/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Subscriptions.findOne({ _id: id });
    if (find) {
      const deleted = await Subscriptions.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
//get all Trashed Subscriptions
router.get('/trash_subscriptions', async (req, res, next) => {
  try {
      const data = await Subscriptions.find({trash:1})
      const total_Subscriptions = await Subscriptions.countDocuments({trash:1});
      res.send({
      total: total_Subscriptions,
      subscriptions: data,
      });
    }
    catch (error) {
    next(error)
    }
  })
  
  router.delete("/trash_subscriptions/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Subscriptions.findOne({ _id: id });
    if (find) {
      const update = {'trash':1};
      const id = req.params.id;
      const option = { new: true };
      const deleted = await Subscriptions.findByIdAndUpdate(id, update, option);
     
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});

//Get search trash Subscriptions
router.get("/getsubscriptionssearch_trash", async (req, res, next) => {
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
      const contactCollection = await Subscriptions.find({$and: [{trash:1},
        {$or: [
            { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Subscriptions.countDocuments({$and: [{trash:1},
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
      const contactCollection = await Subscriptions.find({trash:1})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_Subscriptions = await Subscriptions.countDocuments({trash:1});
      res.send({
        total: total_Subscriptions,
        data: contactCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;

