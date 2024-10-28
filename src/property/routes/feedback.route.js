const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const axios = require('axios');
const Feedback = require("../../models/feedback");

async function postFeedbackDatamail(data) {	
	console.log('main data', data.email);	
	var nm = data.name;	
		
	var new_nm = nm.replaceAll(' ', '_');	
	const url = 'https://9estate.com/mail/sendmail/feedback.php?email='+data.email+'&name_new='+new_nm+'&encoded_email='+data.path_url; // Replace with your PHP server URL and endpoint	
	try {	
	  const response = await axios.post(url, data);	
	  console.log('Post request successful!', response.data);	
	  // Handle the response from the PHP server	
	} catch (error) {	
	  console.error('Error occurred:', error);	
	  // Handle the error	
	}	
}
async function postFeedbackDatamailToAdmin(data) {	
	console.log('main data', data.email);	
	var nm = data.name;	
		
	var new_nm = nm.replaceAll(' ', '_');	
	const url = 'https://9estate.com/mail/sendmail/feedback_email_admin.php?email='+data.email+'&name_new='+new_nm+'&encoded_email='+data.path_url; // Replace with your PHP server URL and endpoint	
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
router.get('/feedback', async (req, res, next) => {

  try {
    const data = await Feedback.find({trash:0})
    const total_feedback = await Feedback.countDocuments({trash:0});
    res.send({
      total: total_feedback,
    Feedback: data,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get("/getfeedbacksearch", async (req, res, next) => {
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
      const feedbackCollection = await Feedback.find({$and: [{trash:0},
              {$or: [
                  { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
                ],
              },
          ],
        }).skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Feedback.countDocuments({$and: [{trash:0},
            {$or: [
                { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
              ],
            },
        ],
      });
      res.send({
        total: total_pages,
        data: feedbackCollection,
      });
    } else {
      const feedbackCollection = await Feedback.find({trash:0})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Feedback.countDocuments({trash:0});
      res.send({
        total: total_pages,
        data: feedbackCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Feedback by ID
router.get('/feedback/:id', async (req, res, next) => {

  try {
    const data = await Feedback.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//subscription save
//Create tag
router.post("/feedback", async (req, res, next) => {
  const data = {
    name: req.body.email,
    email: req.body.email,
    path_url:'https://9estate.com'
  };
  postFeedbackDatamail(data);
  postFeedbackDatamailToAdmin(data);
  try {
    console.log(req.body);
    const {
        email,
        message,
        created_at,
    } = req.body;
    const myfeedback = new Feedback({
        email,
        message,
        created_at,
    });
    const addfeedback = await myfeedback.save();
    res.send(addfeedback);
  } catch (error) {
    next(error);
  }
});
//Update tag
router.patch("/feedback/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Feedback.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete tag
router.delete("/feedback/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Feedback.findOne({ _id: id });
    if (find) {
      const deleted = await Feedback.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
//Export Feedback
router.get('/feedbackExport', async (req, res, next) => {
  try {
    const data = await Feedback.find().select("email message -_id");
    const total_feedback = await Feedback.countDocuments();
    res.send({
      total: total_feedback,
    data: data,
    });
  }
  catch (error) {
    next(error)
  }
});

//get all Trashed Feedback
router.get('/trash_feedback', async (req, res, next) => {
  try {
      const data = await Feedback.find({trash:1})
      const total_Feedbacks = await Feedback.countDocuments({trash:1});
      res.send({
      total: total_Feedbacks,
      Feedback: data,
      });
    }
    catch (error) {
    next(error)
    }
  })
  
  router.delete("/trash_feedback/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Feedback.findOne({ _id: id });
    if (find) {
      const update = {'trash':1};
      const id = req.params.id;
      const option = { new: true };
      const deleted = await Feedback.findByIdAndUpdate(id, update, option);
     
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});

//Get search trash Feedback
router.get("/getfeedbacksearch_trash", async (req, res, next) => {
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
      const feedbackCollection = await Feedback.find({$and: [{trash:1},
              {$or: [
                  { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
                ],
              },
          ],
        }).skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Feedback.countDocuments({$and: [{trash:1},
        {$or: [
            { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        },
    ],
  });
      res.send({
        total: total_pages,
        data: feedbackCollection,
      });
    } else {
      const feedbackCollection = await Feedback.find({trash:1})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Feedback.countDocuments({trash:1});
      res.send({
        total: total_pages,
        data: feedbackCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;