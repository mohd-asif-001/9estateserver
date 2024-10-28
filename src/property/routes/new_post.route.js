const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const addPost = require("../../models/new_post");

//get post
router.get('/posts', async (req, res, next) => {
  try {
    const data = await addPost.find().sort({ created_at: -1 })
    const total_post = await addPost.countDocuments();
    res.send({
      total: total_post,
      addPost: data,
    });
  }
  catch (error) {
    next(error)
  }
})
//get latest posts
router.get('/latestpostshome', async (req, res, next) => {
  try {
    const data = await addPost.find().sort({ created_at: -1 }).limit(4);
    const total_post = await addPost.countDocuments();
    res.send({
      total: total_post,
      data: data,
    });
  }
  catch (error) {
    next(error)
  }
})
// Get category count 
router.get('/total_category_posts', async (req, res, next) => {
  try {
    var c_data= req.query.categories;
    const total_count=await addPost.countDocuments({ post_category: { $regex: new RegExp(c_data) }});
    res.send({
      total: total_count,
    });
  }
  catch (error) {
    next(error)
  }
})
router.get('/total_tag_posts', async (req, res, next) => {
  try {
    var c_data= req.query.tag;
    const total_count=await addPost.countDocuments({ post_tag: { $regex: new RegExp(c_data) }});
    res.send({
      total: total_count,
    });
  }
  catch (error) {
    next(error)
  }
})
//Get data by slug
router.get("/post_by_slug/:slug", async (req, res, next) => {
  try {
    const data = await addPost.find({ slug: req.params.slug })
    res.send(data)
  }
  catch (error) {
    next(error)
  }
});

//Get data by id
router.get("/post_by_id/:slug", async (req, res, next) => {
  try {
    const data = await addPost.find({ _id: req.params.slug })
    res.send(data)
  }
  catch (error) {
    next(error)
  }
});

//get releted blog
router.get('/posts/slug/:slug', (req, res) => {
  const slug = req.params.slug;
  // Fetch related posts from MongoDB based on the category
  addPost.find({ slug: slug })
    .sort({ createdAt: -1 })
    .exec((err, slugpost) => {
      if (err) {
        console.error('Error retrieving related posts from MongoDB', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(slugpost);
      }
    });
});

router.get('/recentposts', (req, res) => {
  // Fetch the five most recent posts from MongoDB
  addPost.find()
    .sort({ created_at: -1 })
    .limit(5)
    .exec((err, recentposts) => {
      if (err) {
        console.error('Error retrieving posts from MongoDB', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(recentposts);
      }
    });
});
// postcard New api with pagination start
router.get('/api/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const items = await addPost.find({}).sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit);
    res.status(200).json({
      items
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// postcard New api with pagination End


// route for backed pagination
router.get('/api/allbackendpost', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || parseInt(req.query.limit);
    const totalItems = await addPost.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    const items = await addPost
      .find({}).sort({ created_at: -1 })
      .limit(limit)
      .skip((currentPage - 1) * limit)
    res.status(200).json({
      items,
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage: limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving items');
  }
});


router.get("/getpostsearch", async (req, res, next) => {
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
      const postCollection = await addPost.find({
        $or: [
          { post_title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await addPost.countDocuments({
        $or: [
          { post_title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: postCollection,
      });
    } else {
      const postCollection = await addPost.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await addPost.countDocuments();
      res.send({
        total: total_pages,
        data: postCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get addPost by ID
router.get('/posts/:id', async (req, res, next) => {

  try {
    const data = await addPost.find({ _id: req.params.id })
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create post
router.post("/posts", async (req, res, next) => {
  try {
    const {
      post_title,
      post_content,
      metatitle,
      metadescription,
      focuskeyword,
      post_category,
      post_tag,
      post_image,
      img_alt,
      slug,
      authorName,
      authordescription,
      authorProfile_img,
      status,
      created_at,
      updated_at,
    } = req.body;
    const mypost = new addPost({
      post_title,
      post_content,
      metatitle,
      metadescription,
      focuskeyword,
      post_category,
      post_tag,
      post_image,
      img_alt,
      slug,
      authorName,
      authordescription,
      authorProfile_img,
      status,
      created_at,
      updated_at,
    });
    const addpost = await mypost.save();
    res.send(addpost);
  } catch (error) {
    next(error);
  }
});
//Update post
router.patch("/posts/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await addPost.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete post
router.delete("/posts/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await addPost.findOne({ _id: id });
    if (find) {
      const deleted = await addPost.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
    next(error)
  }
});
router.get('/checkblogurl/:slug', async (req, res, next) => {
  console.log(req.params.slug);
  try {
    const data = await addPost.find({ slug: req.params.slug })
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Check slug url
router.get('/checkslugurl/:slug', async (req, res, next) => {
  console.log(req.params.slug);
  try {
    const data = await addPost.find({ slug: req.params.slug })
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//related post by category
router.get('/posts/category/:category', (req, res) => {
  const category = req.params.category;
  addPost.find({ post_category: category })
    .sort({ created_at: -1 }).limit(3)
    .exec((err, reletedposts) => {
      if (err) {
        console.error('Error retrieving related posts from MongoDB', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(reletedposts);
      }
    });
});
// next and previous data API
router.get('/data/:id/next', async (req, res) => {
  try {
    const currentData = await addPost.findById(req.params.id);
    const nextData = await addPost.findOne({ _id: { $gt: currentData._id } }).sort({ _id: 1 });
    res.json(nextData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/data/:id/previous', async (req, res) => {
  try {
    const currentData = await addPost.findById(req.params.id);
    const previousData = await addPost.findOne({ _id: { $lt: currentData._id } }).sort({ _id: -1 });
    res.json(previousData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
