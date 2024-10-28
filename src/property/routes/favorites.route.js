const express = require("express");
const createError = require("http-errors");
const { findById } = require("../../models/favorites");
const router = express.Router();
const Favorites = require("../../models/favorites");


//get item by user id
router.get('/favorites', async (req, res, next) => {
    try {
        var currentuser_id = String(req.query.lgn_id);
      const data = await Favorites.find({user_id:currentuser_id,status:"1"})
      const total_favorites = await Favorites.countDocuments({user_id:currentuser_id,status:"1"});
    
      res.send({
        total: total_favorites,
        favorites: data,
      });
    }
    catch (error) {
      next(error)
    }
  })
  router.get("/getfavoritessearch", async (req, res, next) => {
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
        const favoritesCollection = await Favorites.find({status:"1",
          $or: [
            { property_title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          ],
        })
          .skip(skips)
          .limit(limit)
          .sort(sortObject);
        const total_pages = await Favorites.countDocuments({
          $or: [
            { property_title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
          ],
        });
        res.send({
          total: total_pages,
          data: favoritesCollection,
        });
      } else {
        const favoritesCollection = await Favorites.find({status:"1"})
          .skip(skips)
          .limit(limit)
          .sort(sortObject);
        const total_pages = await Favorites.countDocuments();
        res.send({
          total: total_pages,
          data: favoritesCollection,
        });
      }
    } catch (error) {
      next(error);
    }
  });
   router.post("/getfavouritesBypropAndUser", async (req, res, next) => {
    try {
      var Loguser_id = String(req.body.user_id);
      var property_id_is = String(req.body.property_id);
      const result = await Favorites.find({user_id:Loguser_id,property_id:property_id_is});
      console.log('fev data->', result);
      res.send({data:result});
    } catch (error) {
      next(error);
    }
  });
  //get favorites by ID
  router.get('/favorites/:id', async (req, res, next) => {
  
    try {
      const data = await Favorites.find({_id:req.params.id})
      res.send({ data: data })
  
    }
    catch (error) {
      next(error)
    }
  })
  //Create fav
   router.post("/favorites", async (req, res, next) => {

    try {
      var Loguser_id = String(req.body.user_id);
      var property_id_is = String(req.body.property_id);
      const result = await Favorites.find({user_id:Loguser_id,property_id:property_id_is});
     if(result instanceof Array && result.length>0){
        
          if(result[0].status=="0"){
          
          const status = 1;
          const option = { new: true };
          const updatedDetails = await Favorites.findByIdAndUpdate(result[0]._id, {status:status}, option);
          res.send(updatedDetails);
          }else{
            
            const status = 0;
          const option = {  };
          const updatedDetails = await Favorites.findByIdAndUpdate(result[0]._id, {status:status}, option);
          // res.send(updatedDetails);
          }
      }else{
        
    const {
        user_id,
        property_id,
        property_title,
        property_slug
      } = req.body;
      const savefavorites = new Favorites({
        user_id,
        property_id,
        property_title,
        property_slug
      });
      const addfavorites = await savefavorites.save();
      res.send(addfavorites);
      }
      
    } catch (error) {
      next(error);
    }
  });
  //Update tag
  router.patch("/favorites/:id", async (req, res, next) => {
    try {
      const update = req.body;
      const id = req.params.id;
      const option = { new: true };
      const updatedDetails = await Favorites.findByIdAndUpdate(id, update, option);
      res.send(updatedDetails);
    } catch (error) {
      next(error);
    }
  });
  //Delete tag
  router.delete("/favorites/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const find = await Favorites.findOne({ _id: id });
      if (find) {
        const deleted = await Favorites.findByIdAndDelete({ _id: id });
        res.send(deleted);
      } else {
        res.send("Id does not exist");
      }
    } catch (error) {
     next(error)
    }
  });
  module.exports = router;
  
  

