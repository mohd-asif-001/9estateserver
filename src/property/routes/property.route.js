const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Properties = require("../../models/property");
const agentPlan = require("../../models/agent_plans");
const axios = require('axios');
const e = require("express");
const FormData = require('form-data');
var node_cryptojs = require('node-cryptojs-aes');
const fs = require("fs");
var sightengine = require('sightengine')('784214450', 'B6M9NVuxQDa2bJNL6AAV');
//get Property
router.get('/properties', async (req, res, next) => {
  try {
    const data = await Properties.find({status:0, trash:0})
    const total_properties= await Properties.countDocuments({status:0, trash:0});
    res.send({
      total: total_properties,
      properties: data,
    });
  }
  catch (error) {
    next(error)
  }
});
//get Property Filter
/*router.get('/decodeTms', async (req, res, next) => {

  const key = 'j2CGC9YWJh1fVAQbYLr4kjmuTcbonSB3EWnoXPSEKB4='
   const iv = 'SSGAPIInitVector'
   
   const cipher = node_cryptojs.AES.encrypt('asdfsdafdsafdsaf', CryptoJS.enc.Utf8.parse(key), {
       iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV 
       padding: CryptoJS.pad.Pkcs7,
       mode: CryptoJS.mode.CBC
   })
   var res= cipher.toString();
   console.log(res);

});*/
//get only agent  Property by date last one year
router.get('/propertiesagentByDate/:id', async (req, res, next) => {
	const agent_id = String(req.params.id);
try {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date 12 months ago from the current date
  const twelveMonthsAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 11
  );

  // Create an aggregation pipeline to group and count properties by month
  const pipeline = [
    {
      $match: {
        agentId: agent_id,
        created_at: {
          $gte: twelveMonthsAgo,
          $lte: currentDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$created_at" },
          month: { $month: "$created_at" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            {
              $substr: [
                {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ["$_id.month", 1] },
                        then: "Jan",
                      },
                      {
                        case: { $eq: ["$_id.month", 2] },
                        then: "Feb",
                      },
                      {
                        case: { $eq: ["$_id.month", 3] },
                        then: "Mar",
                      },
                      {
                        case: { $eq: ["$_id.month", 4] },
                        then: "Apr",
                      },
                      {
                        case: { $eq: ["$_id.month", 5] },
                        then: "May",
                      },
                      {
                        case: { $eq: ["$_id.month", 6] },
                        then: "Jun",
                      },
                      {
                        case: { $eq: ["$_id.month", 7] },
                        then: "Jul",
                      },
                      {
                        case: { $eq: ["$_id.month", 8] },
                        then: "Aug",
                      },
                      {
                        case: { $eq: ["$_id.month", 9] },
                        then: "Sep",
                      },
                      {
                        case: { $eq: ["$_id.month", 10] },
                        then: "Oct",
                      },
                      {
                        case: { $eq: ["$_id.month", 11] },
                        then: "Nov",
                      },
                      {
                        case: { $eq: ["$_id.month", 12] },
                        then: "Dec",
                      },
                    ],
                    default: "",
                  },
                },
                0,
                3,
              ],
            },
            " ",
            {
              $substr: [
                {
                  $year: {
                    $dateFromParts: {
                      year: "$_id.year",
                      month: "$_id.month",
                      day: 1,
                    },
                  },
                },
                0,
                4,
              ],
            },
          ],
        },
        count: 1,
      },
    },
    { $sort: { month: 1 } },
  ];

  // Execute the aggregation query
  const result = await Properties.aggregate(pipeline);

  // Create an object with month as key and property count as value
  const propertyCountByMonth = {};

  // Initialize the object with zeros for all 12 months
  const currentMonth = new Date(twelveMonthsAgo);
  for (let i = 0; i < 12; i++) {
    const formattedMonth = currentMonth.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
    propertyCountByMonth[formattedMonth] = 0;
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  // Update the object with actual property counts
  result.forEach((item) => {
    propertyCountByMonth[item.month] = item.count;
  });

  console.log('confuse kr diya ->', propertyCountByMonth);
  res.send({
    total: propertyCountByMonth
  });
} catch (err) {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
}

});
router.get('/getFilterproperties/:lat/:long', async (req, res, next) => {
  try {

    const data = await Properties.find({status:0, trash:0}).sort({featured:-1, created_at: -1}).skip(0).limit(9);
    const total_properties = await Properties.countDocuments({status:0, trash:0});
    console.log('default home prop', {
      total: total_properties,
      properties: data,
    });
	  res.send({
      total: total_properties,
      properties: data,
    });


   /* const latitude = req.params.lat;
    const longitude = req.params.long;
    const distance = 1000; //km
    const unitValue = 1000;
    const data = await Properties.find({
      loc: {
          $near: {
              $maxDistance: parseFloat(distance)*parseFloat(unitValue), // distance in meters
              $geometry: {
                  type: 'Point',
                  coordinates: [parseFloat(latitude), parseFloat(longitude)]
              }
          }
      }
  });
    const total_properties= await Properties.countDocuments();
    res.send({
      total: total_properties,
      properties: data,
    });*/
  }
  catch (error) {
    next(error)
  }
});
//get trash prop for admin
router.get('/trash_properties_for_admin', async (req, res, next) => {
 
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
      const accountsCollection = await Properties.find(
        {$and: [{trash:1},
              {$or: [
                { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
                { propertyType: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
              ],
            },
          ],
        })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties.countDocuments({$and: [{trash:1},
        {$or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          { propertyType: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      },
    ],
  });
      res.send({
        total: total_pages,
        properties: accountsCollection,
      });
    } else {
      const accountCollection = await Properties.find({trash:1})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties.countDocuments({trash:1});
      res.send({
        total: total_pages,
        properties: accountCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Properties for admin
router.get('/properties_for_admin', async (req, res, next) => {
 
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
      const accountsCollection = await Properties.find(
        {$and: [{trash:0},
              {$or: [
                { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
                { propertyType: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
              ],
            },
          ],
        })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties.countDocuments({$and: [{trash:0},
        {$or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          { propertyType: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      },
    ],
  });
      res.send({
        total: total_pages,
        properties: accountsCollection,
      });
    } else {
      const accountCollection = await Properties.find({trash:0})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties.countDocuments({trash:0});
      res.send({
        total: total_pages,
        properties: accountCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//start property page filter
router.post("/filterPropertySearchUrl", async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
 

  //.sort(sort_cond)
  console.log('sort data ->', req.body.sorting);
  var sort_dt = '';
  if(req.body.sorting==undefined){
    sort_dt = 'created_at';
  }else{

    sort_dt = req.body.sorting;
  }

  var sorting = req.body.sorting;
  let sort_cond = '';
  if(sorting=='Price (Low to High)'){
    sort_cond = {featured:-1, priceDollar: 1};
  }else if(sorting=='Newest'){
    sort_cond = {featured:-1, created_at: -1};
  }else if(sorting=='Oldest'){
    sort_cond = {featured:-1, created_at:1};
  }else if(sorting=='Price (High to Low)'){
    sort_cond = {featured:-1, priceDollar: -1};
  }else{
    sort_cond = {featured:-1, created_at: -1};
  }



  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
 
  
  myobj = {};
  
  myobj.trash = 0;
  myobj.status = 0;
  if(req.body.prop_status!=''){
    myobj.propertyStatus = { $regex: req.body.prop_status.trim(), $options: 'i' };
  }
  if(req.body.prop_propertyType!=''){
    myobj.propertyType = { $regex:req.body.prop_propertyType.trim(), $options: 'i' };
  }
  if(req.body.price_from!=''){
    if(req.body.price_to!=''){
      myobj.priceDollar = {$gte: parseInt(req.body.price_from), $lte: parseInt(req.body.price_to)};
    }else{
      myobj.priceDollar = {$gte: parseInt(req.body.price_from)};
    }
  }else if(req.body.price_to!=''){
    if(req.body.price_from!=''){
      myobj.priceDollar = { $gte: parseInt(req.body.price_from), $lte: parseInt(req.body.price_to)};
    }else{
      myobj.priceDollar = { $lte: parseInt(req.body.price_to)};
    }
  }
  if(req.body.area_from!=''){
    if(req.body.area_to!=''){
      myobj.area = {$gte:parseInt(req.body.area_from), $lte:parseInt(req.body.area_to)};
    }else{
      myobj.area = {$gte:parseInt(req.body.area_from)};
    }
  }else if(req.body.area_to!=''){
    if(req.body.area_from!=''){
      myobj.area = { $gte:parseInt(req.body.area_from), $lte:parseInt(req.body.area_to)};
    }else{
      myobj.area = {$lte:parseInt(req.body.area_to)};
    }
  }
  if(req.body.bedrooms_from!=''){

    if(req.body.bedrooms_to!=''){
      myobj.bedrooms = {$gte:parseInt(req.body.bedrooms_from), $lte:parseInt(req.body.bedrooms_to)};
    }else{
      myobj.bedrooms = {$gte:parseInt(req.body.bedrooms_from)};
    }
  }else if(req.body.bedrooms_to!=''){
    if(req.body.bedrooms_from!=''){
      myobj.bedrooms = { $gte:parseInt(req.body.bedrooms_from), $lte:parseInt(req.body.bedrooms_to)};
    }else{
      myobj.bedrooms = { $lte:parseInt(req.body.bedrooms_to)};
    }
  }
  if(req.body.fetaures_all!=''){
    myobj.features = {$regex:req.body.fetaures_all, $options:'i'};
  }

    if(req.body.prop_lat!='' && req.body.prop_long!=''){
          const latitude = req.body.prop_lat;
          const longitude = req.body.prop_long;
          const distance = 1000; //km
          const unitValue = 1000;
          const data_main = await Properties.find(
            {$and: [
                  {
                  loc: {
                      $near: {
                          $maxDistance: parseFloat(distance)*parseFloat(unitValue), // distance in meters
                          $geometry: {
                              type: 'Point',
                              coordinates: [parseFloat(longitude), parseFloat(latitude)]
                          }
                      }
                  }
              },
              myobj
        ]}).sort(sort_cond).skip(startIndex).limit(limit);


        const countFilteredProperties = await Properties.find(
          {$and: [
                {
                loc: {
                    $near: {
                        $maxDistance: parseFloat(distance)*parseFloat(unitValue), // distance in meters
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)]
                        }
                    }
                }
            },
            myobj
      ]}).count();
        res.send({
          total: countFilteredProperties,
          properties: data_main
        });
    }else{
      const data = await Properties.find(
        {$and: [myobj]}).sort(sort_cond).skip(startIndex).limit(limit);;
      const countFilteredProperties = await Properties.countDocuments(
        {$and: [myobj]});
        res.send({
        total: countFilteredProperties,
        properties: data
      });
    }  
});
//Agent Page Filter
router.post("/filterAgentSearchUrl", async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
 

  //.sort(sort_cond)
  //console.log('sort data ->', req.body.sorting);
  var sort_dt = '';
  if(req.body.sorting==undefined){
    sort_dt = 'created_at';
  }else{
    sort_dt = req.body.sorting;
  }

  var sorting = req.body.sorting;
  let sort_cond = '';
  if(sorting=='Price (Low to High)'){
    sort_cond = {featured:-1, priceDollar: 1};
  }else if(sorting=='Newest'){
    sort_cond = {featured:-1, created_at: -1};
  }else if(sorting=='Oldest'){
    sort_cond = {featured:-1, created_at:1};
  }else if(sorting=='Price (High to Low)'){
    sort_cond = {featured:-1, priceDollar: -1};
  }else{
    sort_cond = {featured:-1, created_at: -1};
  }
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  myobj = {};
  myobj.agentId = req.body.agentId;
  myobj.trash = 0;
  myobj.status = 0;
  if(req.body.prop_status!=''){
    myobj.propertyStatus = { $regex: req.body.prop_status.trim(), $options: 'i' };
  }
  if(req.body.prop_propertyType!=''){
    myobj.propertyType = { $regex:req.body.prop_propertyType.trim(), $options: 'i' };
  }
  if(req.body.price_from!=''){
    if(req.body.price_to!=''){
      myobj.priceDollar = {$gte: parseInt(req.body.price_from), $lte: parseInt(req.body.price_to)};
    }else{
      myobj.priceDollar = {$gte: parseInt(req.body.price_from)};
    }
  }else if(req.body.price_to!=''){
    if(req.body.price_from!=''){

      myobj.priceDollar = { $gte: parseInt(req.body.price_from), $lte: parseInt(req.body.price_to)};
    }else{
      myobj.priceDollar = { $lte: parseInt(req.body.price_to)};
    }
  }
  if(req.body.area_from!=''){
    if(req.body.area_to!=''){
      myobj.area = {$gte:parseInt(req.body.area_from), $lte:parseInt(req.body.area_to)};
    }else{
      myobj.area = {$gte:parseInt(req.body.area_from)};
    }
  }else if(req.body.area_to!=''){
    if(req.body.area_from!=''){
      myobj.area = { $gte:parseInt(req.body.area_from), $lte:parseInt(req.body.area_to)};
    }else{
      myobj.area = {$lte:parseInt(req.body.area_to)};
    }
  }
  if(req.body.bedrooms_from!=''){

    if(req.body.bedrooms_to!=''){
      myobj.bedrooms = {$gte:parseInt(req.body.bedrooms_from), $lte:parseInt(req.body.bedrooms_to)};
    }else{
      myobj.bedrooms = {$gte:parseInt(req.body.bedrooms_from)};
    }
  }else if(req.body.bedrooms_to!=''){
    if(req.body.bedrooms_from!=''){
      myobj.bedrooms = { $gte:parseInt(req.body.bedrooms_from), $lte:parseInt(req.body.bedrooms_to)};
    }else{
      myobj.bedrooms = { $lte:parseInt(req.body.bedrooms_to)};
    }
  }
  if(req.body.fetaures_all!=''){
    myobj.features = {$regex:req.body.fetaures_all, $options:'i'};
  }

  //console.log('sara data ->', myobj);

    if(req.body.prop_lat!='' && req.body.prop_long!=''){
          const latitude = req.body.prop_lat;
          const longitude = req.body.prop_long;
          const distance = 1000; //km
          const unitValue = 1000;

          const data_main = await Properties.find(
            {$and: [
                  {
                  loc: {
                      $near: {
                          $maxDistance: parseFloat(distance)*parseFloat(unitValue), // distance in meters
                          $geometry: {
                              type: 'Point',
                              coordinates: [parseFloat(longitude), parseFloat(latitude)]
                          }
                      }
                  }
              },
              myobj
        ]}).sort(sort_cond).skip(startIndex).limit(limit);

        const countFilteredProperties = await Properties.find(
          {$and: [
                {
                loc: {
                    $near: {
                        $maxDistance: parseFloat(distance)*parseFloat(unitValue), // distance in meters
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)]
                        }
                    }
                }
            },
            myobj
      ]}).count();
         res.send({
          total: countFilteredProperties,
          properties: data_main
        });
    }else{
        const data = await Properties.find(
        {$and: [myobj]}).sort(sort_cond).skip(startIndex).limit(limit);
        const countFilteredProperties = await Properties.countDocuments(
          {$and: [myobj]});
         res.send({
          total: countFilteredProperties,
          properties: data
        });
    }
});
//stop property page filter
router.post("/filterHomeSearchUrl", async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
 

  //.sort(sort_cond)
  //console.log('sort data ->', req.body.sorting);
  var sort_dt = '';
  if(req.body.sorting==undefined){
    sort_dt = 'created_at';
  }else{
    sort_dt = req.body.sorting;
  }

  var sorting = req.body.sorting;

  let sort_cond = '';
  if(sorting=='Price (Low to High)'){
    sort_cond = {priceDollar: 1};
  }else if(sorting=='Newest'){
    sort_cond = {created_at: -1};
  }else if(sorting=='Oldest'){
    sort_cond = {created_at:1};
  }else if(sorting=='Price (High to Low)'){
    sort_cond = {priceDollar: -1};
  }else{
    sort_cond = {featured:-1, created_at: -1};
  }
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  myobj = {};
  myobj.trash = 0;
  myobj.status = 0;
  if(req.body.prop_status!=''){
    myobj.propertyStatus = { $regex: req.body.prop_status.trim(), $options: 'i' };
  }
  if(req.body.prop_propertyType!=''){
    myobj.propertyType = { $regex:req.body.prop_propertyType.trim(), $options: 'i' };
  }
  if(req.body.price_from!=''){
    if(req.body.price_to!=''){
      myobj.priceDollar = {$gte: parseInt(req.body.price_from), $lte: parseInt(req.body.price_to)};
    }else{
      myobj.priceDollar = {$gte: parseInt(req.body.price_from)};
    }
  }else if(req.body.price_to!=''){
    if(req.body.price_from!=''){
      myobj.priceDollar = { $gte: parseInt(req.body.price_from), $lte: parseInt(req.body.price_to)};
    }else{
      myobj.priceDollar = { $lte: parseInt(req.body.price_to)};
    }
  }
  if(req.body.area_from!=''){
    if(req.body.area_to!=''){
      myobj.area = {$gte:parseInt(req.body.area_from), $lte:parseInt(req.body.area_to)};
    }else{
      myobj.area = {$gte:parseInt(req.body.area_from)};
    }
  }else if(req.body.area_to!=''){
    if(req.body.area_from!=''){
      myobj.area = { $gte:parseInt(req.body.area_from), $lte:parseInt(req.body.area_to)};
    }else{
      myobj.area = {$lte:parseInt(req.body.area_to)};
    }
  }
  if(req.body.bedrooms_from!=''){

    if(req.body.bedrooms_to!=''){
      myobj.bedrooms = {$gte:parseInt(req.body.bedrooms_from), $lte:parseInt(req.body.bedrooms_to)};
    }else{
      myobj.bedrooms = {$gte:parseInt(req.body.bedrooms_from)};
    }
  }else if(req.body.bedrooms_to!=''){
    if(req.body.bedrooms_from!=''){
      myobj.bedrooms = { $gte:parseInt(req.body.bedrooms_from), $lte:parseInt(req.body.bedrooms_to)};
    }else{
      myobj.bedrooms = { $lte:parseInt(req.body.bedrooms_to)};
    }
  }
  if(req.body.fetaures_all!=''){
    myobj.features = {$regex:req.body.fetaures_all, $options:'i'};
  }
  if(req.body.prop_lat!='' && req.body.prop_long!=''){
          const latitude = req.body.prop_lat;
          const longitude = req.body.prop_long;
          const distance = 1000; //km
          const unitValue = 1000;

          const data_main = await Properties.find(
            {$and: [
                  {
                  loc: {
                      $near: {
                          $maxDistance: parseFloat(distance)*parseFloat(unitValue), // distance in meters
                          $geometry: {
                              type: 'Point',
                              coordinates: [parseFloat(longitude), parseFloat(latitude)]
                          }
                      }
                  }
              },
              myobj
        ]}).sort(sort_cond).skip(startIndex).limit(limit);

        const countFilteredProperties = await Properties.find(
          {$and: [
                {
                loc: {
                    $near: {
                        $maxDistance: parseFloat(distance)*parseFloat(unitValue), // distance in meters
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)]
                        }
                    }
                }
            },
            myobj
      ]}).count();
         res.send({
          total: countFilteredProperties,
          properties: data_main
        });
    }else{
        const data = await Properties.find(
        {$and: [myobj]}).sort(sort_cond).skip(startIndex).limit(limit);
        const countFilteredProperties = await Properties.countDocuments(
          {$and: [myobj]});
         res.send({
          total: countFilteredProperties,
          properties: data
        });
    }
});
router.get('/properties_with_pag', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data = await Properties.find({status:0, trash:0}).sort({featured:-1, created_at:-1}).skip(startIndex).limit(limit);
    const total_properties= await Properties.countDocuments({status:0, trash:0});
    res.send({
      total: total_properties,
      properties: data,
    });
  }
  catch (error) {
    next(error)
  }
});
//Agent page with search and sort
router.get('/properties_with_pag_sort_Agent', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sorting = req.query.sorting.trim();
  
  try {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
	 const total_properties= await Properties.countDocuments({status:0, trash:0, agentId:req.query.agentId});
  
     if(sorting=='Price (Low to High)'){
     
      
      const data = await Properties.find({status:0, trash:0, agentId:req.query.agentId}).sort({priceDollar: 1}).skip(startIndex).limit(limit);
	  res.send({
      total: total_properties,
      properties: data,
    });
    
    }else if(sorting=='Newest'){
     
      const data = await Properties.find({status:0, trash:0, agentId:req.query.agentId}).sort({featured:-1, created_at: -1}).skip(startIndex).limit(limit);
	  res.send({
      total: total_properties,
      properties: data,
    });
    
    }else if(sorting=='Oldest'){
    
     
      const data = await Properties.find({status:0, trash:0, agentId:req.query.agentId}).sort({created_at: 1}).skip(startIndex).limit(limit);
	  res.send({
      total: total_properties,
      properties: data,
    });
    
    }else if(sorting=='Price (High to Low)'){
     
      const data = await Properties.find({status:0, trash:0, agentId:req.query.agentId}).sort({priceDollar: -1}).skip(startIndex).limit(limit);
	  res.send({
      total: total_properties,
      properties: data,
    });
    
    }else{
     
      const data = await Properties.find({status:0, trash:0, agentId:req.query.agentId}).skip(startIndex).limit(limit);
	  res.send({
      total: total_properties,
      properties: data,
    });
    }
    
    
    
  }
  catch (error) {
    next(error)
  }
});
//page with sort
router.get('/properties_with_pag_sort', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sorting = req.query.sorting.trim();
  
  try {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
	 const total_properties= await Properties.countDocuments({status:0, trash:0});
  
     if(sorting=='Price (Low to High)'){
     
      
      const data = await Properties.find({status:0, trash:0}).sort({priceDollar: 1}).skip(startIndex).limit(limit);
	  res.send({
      total: total_properties,
      properties: data,
    });
    
    }else if(sorting=='Newest'){
     
      const data = await Properties.find({status:0, trash:0}).sort({featured:-1, created_at: -1}).skip(startIndex).limit(limit);
	  res.send({
      total: total_properties,
      properties: data,
    });
    
    }else if(sorting=='Oldest'){
    
     
      const data = await Properties.find({status:0, trash:0}).sort({created_at: 1}).skip(startIndex).limit(limit);
	  res.send({
      total: total_properties,
      properties: data,
    });
    
    }else if(sorting=='Price (High to Low)'){
     
      const data = await Properties.find({status:0, trash:0}).sort({priceDollar: -1}).skip(startIndex).limit(limit);
	  res.send({
      total: total_properties,
      properties: data,
    });
    
    }else{
     
      const data = await Properties.find({status:0, trash:0}).skip(startIndex).limit(limit);
	  res.send({
      total: total_properties,
      properties: data,
    });
    }
    
    
    
  }
  catch (error) {
    next(error)
  }
});
//get Property By Slug
router.get("/property_by_slug/:slug", async (req, res, next) => {
  try {
    const data = await Properties.find({slug:req.params.slug})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
});
//unset featured property for agent id
router.get("/unsetfeaturedproperty/:id/:agentId", async (req, res, next) => {
  try {
      const data = await Properties.find({_id: req.params.id})
      if (data[0].featured==1) {
        const update = {'featured':0};
        const id = req.params.id;
        const option = { new: true };
        const updatedDetails = await Properties.findByIdAndUpdate(id, update, option);
        res.send({ data:updatedDetails, message_type:'success', message:'Property is removed from Featured successfully.'});
      }else{
        res.send({ data:0, message_type:'error', message:'Property is already removed from Featured.'});
      }
  }
  catch (error) {
    next(error)
  }
});
//set featured property for agent id
router.get("/setfeaturedproperty/:id/:agentId", async (req, res, next) => {
  try {
   
    const data_agenttPlan = await agentPlan.find({agent_id:req.params.agentId, status:'Yes'});
  
   if(data_agenttPlan.length==0){
   
      const data_agenttPlan_new = await agentPlan.find({agent_id:req.params.agentId, status:'No'});
      if(data_agenttPlan_new[0].number_of_featured_posts){
        if(data_agenttPlan_new[0].number_of_featured_posts>0){
        
          if(parseInt(data_agenttPlan_new[0].number_of_featured_posts)>parseInt(data_agenttPlan_new[0].number_of_published_featured_posts)){
           
            var featured_posts = data_agenttPlan_new[0].number_of_published_featured_posts;
            var featured_posts_count = parseInt(featured_posts)+1;
            const data = await Properties.find({_id: req.params.id});
            if (data[0].featured==0) {
              var date = new Date(); // Now
              date.setDate(date.getDate() + parseInt(data_agenttPlan_new[0].featured_expiry_days)); // Set now + 30 days as the new date
              const update = {'featured':1, 'featured_expiry_date':date};
              const id = req.params.id;
              const option = { new: true };
              const updatedDetails = await Properties.findByIdAndUpdate(id, update, option);
              const update1 = {'number_of_published_featured_posts':featured_posts_count};
              const id1 = data_agenttPlan_new[0]._id;
              const option1 = { new: true };
              const updateSAgentPlan = await agentPlan.findByIdAndUpdate(id1, update1, option1);
              res.send({ data:updatedDetails, message_type:'success', message:'Property set featured successfully.'});
            }else{
              res.send({ data:0, message_type:'error', message:'Property is already Featured.'});
            }
          }else{
            res.send({ data:0, message_type:'error', message:'You cannot set Featured more properties. Please upgrade plan.'});
          }
        }else{
          res.send({ data:0, message_type:'error', message:'You cannot set Featured property. Please upgrade plan.'});
        }
      }else{
        
        console.log('angent data nahi h', data_agenttPlan_new);
      }


   }else{

    if(data_agenttPlan[0].number_of_featured_posts){
      if(data_agenttPlan[0].number_of_featured_posts>0){
      
        if(parseInt(data_agenttPlan[0].number_of_featured_posts)>parseInt(data_agenttPlan[0].number_of_published_featured_posts)){
         
          var featured_posts = data_agenttPlan[0].number_of_published_featured_posts;
          var featured_posts_count = parseInt(featured_posts)+1;
          const data = await Properties.find({_id: req.params.id});
          if (data[0].featured==0) {
            var date = new Date(); // Now
            date.setDate(date.getDate() + parseInt(data_agenttPlan[0].featured_expiry_days)); // Set now + 30 days as the new date
            const update = {'featured':1, 'featured_expiry_date':date};
            const id = req.params.id;
            const option = { new: true };
            const updatedDetails = await Properties.findByIdAndUpdate(id, update, option);
            const update1 = {'number_of_published_featured_posts':featured_posts_count};
            const id1 = data_agenttPlan[0]._id;
            const option1 = { new: true };
            const updateSAgentPlan = await agentPlan.findByIdAndUpdate(id1, update1, option1);
            res.send({ data:updatedDetails, message_type:'success', message:'Property set featured successfully.'});
          }else{
            res.send({ data:0, message_type:'error', message:'Property is already Featured.'});
          }
        }else{
          res.send({ data:0, message_type:'error', message:'You cannot set Featured more properties. Please upgrade plan.'});
        }
      }else{
        res.send({ data:0, message_type:'error', message:'You cannot set Featured property. Please upgrade plan.'});
      }
    }else{
      
      console.log('angent data nahi h', data_agenttPlan);
    }

   }
   

    
  }
  catch (error) {
    next(error)
  }
});
//Update property 
router.post("/updateAgentProperty/:id", async (req, res, next) => {
  try {
    //const update = req.body;
    const denver = { type: 'Point', coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)] };
    const update ={
      agentId:req.body.agentId,
      plan_id:req.body.plan_id,
      cityId:req.body.cityId,
      neighborhoodId:req.body.neighborhoodId,
      streetId:req.body.streetId,
      title:req.body.title,
      desc:req.body.desc,
      priceDollar:req.body.priceDollar,
      priceEuro:req.body.priceEuro,
      propertyType:req.body.propertyType,
      propertyStatus:req.body.propertyStatus,
      location:req.body.location,
      city:req.body.city,
      zipcode:req.body.zipcode,
      neighborhood:req.body.neighborhood,
      street:req.body.street,
      bedrooms:Number(req.body.bedrooms),
      bathrooms:req.body.bathrooms,
      area:Number(req.body.area),
      yearBuilt:req.body.yearBuilt,
      features:req.body.features,
      features_icon:req.body.features_icon,
      facilities:req.body.facilities,
      facilities_icon:req.body.facilities_icon,
      videoname:req.body.videoname,
      videolink:req.body.videolink,
      gellary:req.body.gellary,
      lat:req.body.lat,
      lng:req.body.lng,
      loc:denver,
      updated_at:req.body.updated_at
    };
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Properties.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
async function handleMultipleFunctionCalls(dataArray) {
  try {
    let lastResponse;
    var error_img = 0;
    var error_img_msg = '';

    for (const data of dataArray) {
      error_img++;
       var url_img = 'https://9estate.com/assets/serverimg/'+data;	
      const response = await sightengine.check(['nudity','wad', 'tobacco', 'gambling', 'offensive']).set_url(url_img).then(function(res) {
       
        // if(res.alcohol!== 0.01 || res.drugs !== 0.01 || res.gambling.prob !== 0.01 || res.nudity.raw != 0.01 || res.offensive
        //   .prob != 0.01 || res.tobacco.prob !== 0.01 || res.weapon !== 0.01 ){
           
        //   error_img_msg = 'Warning: Uploaded explicit image violates content guidelines. Please remove immediately.';
        // }
        
        return res;

      }).catch(function(err) {
       return err;
      });

      console.log('image check response ->', response);
     
      lastResponse = response;
     
      console.log('mera response->', error_img_msg);
      if(error_img==dataArray.length){
        if(error_img_msg!=''){
          var indd = 0;
          dataArray.forEach(element => {
            const path = "../assets/serverimg/"+element;	
            //var path = "../src/assets/serverimg/"+element;
            
            fs.unlink(path, (err) => {
              indd++;
                if(indd==dataArray.length){
                  return error_img_msg;
                }
              if (err) {
                console.error(err);
                return error_img_msg;
              }
            });
          });
        }else{
          return error_img_msg;
        }
      }
    }
    
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

router.post("/checkSensetiveImg", async(req, res, next)=>{	
  var dataArr = req.body.img_url;	
  console.log('img data', dataArr);	
  var arr_img_on = dataArr.split(',');	
  //var response = await handleMultipleFunctionCalls(arr_img_on);	
 //var arr_img = ['https://9estate.com/assets/drug.jpg', 'https://9estate.com/assets/nd.jpg', 'https://9estate.com/assets/smoke.jpg'];	
 //var arr_img = ['https://9estate.com/assets/serverimg/16783568292-medium.jpg'];	
  var response = await handleMultipleFunctionCalls(arr_img_on);	
  console.log('res -', response);	
  if(response!=''){	
    res.send({ data: 'success' });	
  }else{	
    res.send({ data: 'error' });	
  }	
});
router.post("/checkSensetivePropTitle", async(req, res, next)=>{
  
  
    data = new FormData();
    data.append('text', req.body.title);
    data.append('lang', 'en');
    data.append('opt_countries', 'sg');
    data.append('mode', 'standard');
    data.append('api_user', '914276952');
    data.append('api_secret', 'YGVqkHtYMrVjL95SyjzG');
    axios({
      url: 'https://api.sightengine.com/1.0/text/check.json',
      method:'post',
      data: data,
      headers: data.getHeaders()
    })
    .then(function (response) {
      if(response.data.profanity.matches.length>0 || response.data.personal.matches.length>0 || response.data.link.matches.length>0){
        res.send({'data':'success'});
        console.log('Error: The submitted content violates our community guidelines and cannot be published. Please review and modify the content accordingly before resubmitting.');
      }else{
        res.send({'data':'error'});
      }
    })
    .catch(function (error) {
      if (error.response) console.log(error.response.data);
      else console.log(error.message);
    });
});
router.post("/checkSensetiveDesc", async(req, res, next)=>{
  data = new FormData();
  data.append('text', req.body.desc);
  data.append('lang', 'en');
  data.append('opt_countries', 'sg');
  data.append('mode', 'standard');
  data.append('api_user', '229516885');
  data.append('api_secret', 'wZh72XQB8mcgvrvUwDUw');
  axios({
    url: 'https://api.sightengine.com/1.0/text/check.json',
    method:'post',
    data: data,
    headers: data.getHeaders()
  })
  .then(function (response) {
    if(response.data.profanity.matches.length>0 || response.data.personal.matches.length>0 || response.data.link.matches.length>0){
      res.send({'data':'success'});
      console.log('Error: The submitted content violates our community guidelines and cannot be published. Please review and modify the content accordingly before resubmitting.');
    }else{
      res.send({'data':'error'});
    }
  })
  .catch(function (error) {
    if (error.response) console.log(error.response.data);
    else console.log(error.message);
  });
});
router.post("/save_proprt_new", async (req, res, next) => {
  //console.log(req.body);
  try {
    //console.log(req.body);




    /*const {
      agentId,
      plan_id,
      cityId,
      neighborhoodId,
      streetId,
      title,
      desc,
      priceDollar,
      priceEuro,
      propertyType,
      propertyStatus,
      location,
      city,
      zipcode,
      neighborhood,
      street,
      bedrooms,
      bathrooms,
      area,
      yearBuilt,
      features,
      features_icon,
      facilities,
      facilities_icon,
      videoname,
      videolink,
      gellary,
      lat,
      lng,
      featured,
      status,
      approve_status,
      uploded_by,
      uploded_by_name,
      slug,
      created_at,
      updated_at
    } = req.body;*/
    //const denver = {"type": "Point","coordinates": [parseFloat(req.body.lat), parseFloat(req.body.lng)]};

    const denver = { type: 'Point', coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)] };
    
    const properties = new Properties({
      agentId:req.body.agentId,
      plan_id:req.body.plan_id,
      cityId:req.body.cityId,
      neighborhoodId:req.body.neighborhoodId,
      streetId:req.body.streetId,
      title:req.body.title,
      desc:req.body.desc,
      priceDollar:req.body.priceDollar,
      priceEuro:req.body.priceEuro,
      propertyType:req.body.propertyType,
      propertyStatus:req.body.propertyStatus,
      location:req.body.location,
      city:req.body.city,
      zipcode:req.body.zipcode,
      neighborhood:req.body.neighborhood,
      street:req.body.street,
      bedrooms:Number(req.body.bedrooms),
      bathrooms:req.body.bathrooms,
      area:Number(req.body.area),
      yearBuilt:req.body.yearBuilt,
      features:req.body.features,
      features_icon:req.body.features_icon,
      facilities:req.body.facilities,
      facilities_icon:req.body.facilities_icon,
      videoname:req.body.videoname,
      videolink:req.body.videolink,
      gellary:req.body.gellary,
      lat:req.body.lat,
      lng:req.body.lng,
      loc:denver,
      featured:req.body.featured,
      status:req.body.status,
      approve_status:req.body.approve_status,
      uploded_by:req.body.uploded_by,
      uploded_by_name:req.body.uploded_by_name,
      slug:req.body.slug,
      created_at:req.body.created_at,
      updated_at:req.body.updated_at
    });
    const addProperty= await properties.save();
    res.send(addProperty);
  } catch (error) {
    next(error);
  }
});
router.get('/checkurl/:slug', async (req, res, next) => {
  try {
    const data = await Properties.find({slug:req.params.slug})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Get featured property
router.get('/properties/featured', async (req, res, next) => {
  try {
    const data = await Properties.find({featured : 1, status:0, trash:0});
    const total_properties= await Properties.countDocuments({featured : 1, status:0, trash:0});
    res.send({
      total: total_properties,
      properties: data,
    });
  }
  catch (error) {
    next(error)
  }
})

//get only agent  Property rent data
router.get('/propertiesagentrent', async (req, res, next) => {
  try {
    const propertyid = String(req.query.storage_data);
    const total_Rent_properties= await Properties.countDocuments({$and: [{status:0, trash:0,agentId:propertyid},
      {$or: [
        { propertyStatus: /for rent/ },
        { propertyStatus: /For Rent/ }
      ],
    },
  ],
});

    res.send({
      total: total_Rent_properties,
    });
  }
  catch (error) {
    next(error)
  }
});
/*router.get('/propertiesagentrent', async (req, res, next) => {
  try {
    const agent_id = String(req.query.storage_data);


    var last12Month = function() {
      var dates = [];
          d = new Date(),
          y = d.getFullYear(),
          m = d.getMonth();
      function padMonth(month){
          if(month<10){
              return '0'+month;
          } else {
              return month;
          }
      }
      if( m === 11 ) {
          for(var i=1; i<13; i++) {
   
              dates.push(y+"-"+ padMonth(i) +"-01");
          }
      } else {
          for(var i=m+1; i<m+13; i++) {
              if( (i%12) > m ) {
                  dates.push( (y-1) + "-" +  padMonth(i+1) + "-01" );
              } else {
                  dates.push( y + "-" + padMonth((i%12)+1) + "-01" );
              }
          }
      }
   
      return dates;
  }


    //const total_Rent_properties= await Properties.countDocuments({uploded_by_name:"1",agentId:propertyid,propertyStatus: /For Rent/});
   
    
    res.send({
      total: last12Month,
    });
  }
  catch (error) {
    next(error)
  }
});*/
//get only agent  Property sale data
router.get('/propertiesagentsale', async (req, res, next) => {
  try {
    const agent_id = String(req.query.storage_data);
    const total_Sale_properties= await Properties.countDocuments({$and: [{status:0, trash:0,agentId:agent_id},
      {$or: [
        { propertyStatus: /for sale/ },
        { propertyStatus: /For Sale/ }
      ],
    },
  ],
});
    res.send({
      total: total_Sale_properties,
    });
  }
  catch (error) {
    next(error)
  }
});
//get Active Property only agent
router.get('/activepropertiesagent', async (req, res, next) => {
  try {
    const propertyid = String(req.query.storage_data);
    const total_properties= await Properties.countDocuments({uploded_by_name:"1",agentId:propertyid, status:0, trash:0});
    res.send({
      total: total_properties,
    });
  }
  catch (error) {
    next(error)
  }
});
router.post('/propertiesagentnew/:id', async (req, res, next) => {
  
  try {
    const page = 0;
    const limit = parseInt(req.body.count) || 10;
    var sort_dt = '';
    if(req.body.sorting==undefined){
      sort_dt = 'created_at';
    }else{
      sort_dt = req.body.sorting;
    }

    var sorting = req.body.sorting;
    let sort_cond = '';
    if(sorting=='Price (Low to High)'){
      sort_cond = {priceDollar: 1};
    }else if(sorting=='Newest'){
      sort_cond = {created_at: -1};
    }else if(sorting=='Oldest'){
      sort_cond = {created_at:1};
    }else if(sorting=='Price (High to Low)'){
      sort_cond = {priceDollar: -1};
    }else{
      sort_cond = {featured:-1, created_at: -1};
    }
    const propertyid = String(req.params.id);

   

    const data = await Properties.find({agentId:propertyid, status:0, trash:0}).sort(sort_cond).skip(page).limit(limit);
    
    const total_properties= await Properties.countDocuments({agentId:propertyid, status:0, trash:0});
    res.send({
      total: total_properties,
      properties: data,
    });
  }
  catch (error) {
    next(error)
  }
});

//get only agent  Property
router.get('/propertiesagent', async (req, res, next) => {
  try {
    const propertyid = String(req.query.storage_data);
    const data = await Properties.find({agentId:propertyid, status:0, trash:0})
    const total_properties= await Properties.countDocuments({agentId:propertyid, status:0, trash:0});
    res.send({
      total: total_properties,
      properties: data,
    });
  }
  catch (error) {
    next(error)
  }
});
//  getPropertiesByAgentId
router.get('/propertiesagent/:id', async (req, res, next) => {
  try {
    const propertyid = String(req.params.id);
    console.log('aggent id', propertyid);
    const data = await Properties.find({agentId:propertyid, status:0, trash:0})
    const total_properties= await Properties.countDocuments({agentId:propertyid, status:0, trash:0});
    res.send({
      total: total_properties,
      properties: data,
    });
  }
  catch (error) {
    next(error)
  }
});
//  New agent property for rent
router.get('/newpropertiesagent/:id', async (req, res, next) => {
  try {
    const propertyid = String(req.params.id);
    const total_Rent_properties= await Properties.countDocuments({$and: [{agentId:propertyid},
      {$or: [
        { propertyStatus: /for rent/ },
        { propertyStatus: /For Rent/ }
      ],
    },
  ],
});
   
    res.send({
      total: total_Rent_properties,
    });
  }
  catch (error) {
    next(error)
  }
});
//  New agent property for sale
router.get('/newpropertiesagent_sale/:id', async (req, res, next) => {
  try {
    const propertyid = String(req.params.id);
    const total_Rent_properties= await Properties.countDocuments({$and: [{agentId:propertyid},
      {$or: [
        { propertyStatus: /for sale/ },
        { propertyStatus: /For Sale/ }
      ],
    },
  ],
});
   
    res.send({
      total: total_Rent_properties,
    });
  }
  catch (error) {
    next(error)
  }
});
router.get('/newpropertiesagent_sale_may/:id', async (req, res, next) => {
  try {
    const propertyid = String(req.params.id);
    const total_Rent_properties= await Properties.countDocuments({agentId:propertyid,propertyStatus: /For Sale/, created_at: { $gte: new Date(2023, 5, 1), $lt: new Date(2023, 5, 30)}});
   console.log('ok bro', total_Rent_properties);
    res.send({
      total: total_Rent_properties,
    });
  }
  catch (error) {
    next(error)
  }
});


// agent property search
router.get("/getpropertiesagentsearch", async (req, res, next) => {
  try {
    const propertyid = String(req.query.storage_data);
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
      const propertyCollection = await Properties.find({
        uploded_by_name:'1',agentId:propertyid,
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: propertyCollection,
      });
    } else {
      const propertyCollection = await Properties.find({uploded_by_name:'1',agentId:propertyid,})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties.countDocuments();
      res.send({
        total: total_pages,
        data: propertyCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
// Admin Property search
router.get("/getpropertiessearch", async (req, res, next) => {
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
      const propertyCollection = await Properties.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: propertyCollection,
      });
    } else {
      const propertyCollection = await Properties.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Properties.countDocuments();
      res.send({
        total: total_pages,
        data: propertyCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Property by ID
router.get('/properties/:id', async (req, res, next) => {
  try {
    const data = await Properties.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create Property
router.post("/save_proprt", async (req, res, next) => {
  console.log(req.body);
  try {
    console.log(req.body);
    const {
      agentId,
      plan_id,
      cityId,
      neighborhoodId,
      streetId,
      title,
      desc,
      priceDollar,
      priceEuro,
      propertyType,
      propertyStatus,
      location,
      city,
      zipcode,
      neighborhood,
      street,
      bedrooms,
      bathrooms,
      area,
      yearBuilt,
      features,
      videoname,
      videolink,
      gellary,
      lat,
      lng,
      featured,
      status,
      approve_status,
      uploded_by,
      uploded_by_name,
      created_at,
      updated_at
    } = req.body;
    const properties = new Properties({
      agentId,
      plan_id,
      cityId,
      neighborhoodId,
      streetId,
      title,
      desc,
      priceDollar,
      priceEuro,
      propertyType,
      propertyStatus,
      location,
      city,
      zipcode,
      neighborhood,
      street,
      bedrooms,
      bathrooms,
      area,
      yearBuilt,
      features,
      videoname,
      videolink,
      gellary,
      lat,
      lng,
      featured,
      status,
      approve_status,
      uploded_by,
      uploded_by_name,
      created_at,
      updated_at
    });
    const addProperty= await properties.save();
    res.send(addProperty);
  } catch (error) {
    next(error);
  }
});
router.post("/properties", async (req, res, next) => {
  console.log(req.body);
  try {
    console.log(req.body);
    const {
      agentId,
      cityId,
      neighborhoodId,
      streetId,
      title,
      desc,
      priceDollar,
      priceEuro,
      propertyType,
      propertyStatus,
      location,
      city,
      zipcode,
      neighborhood,
      street,
      bedrooms,
      bathrooms,
      area,
      yearBuilt,
      features,
      videoname,
      videolink,
      lat,
      lng,
      featured,
      status,
      approve_status,
      uploded_by,
      uploded_by_name,
      created_at,
      updated_at
    } = req.body;
    const properties = new Properties({
      agentId,
      cityId,
      neighborhoodId,
      streetId,
      title,
      desc,
      priceDollar,
      priceEuro,
      propertyType,
      propertyStatus,
      location,
      city,
      zipcode,
      neighborhood,
      street,
      bedrooms,
      bathrooms,
      area,
      yearBuilt,
      features,
      videoname,
      videolink,
      gellary,
      lat,
      lng,
      featured,
      status,
      approve_status,
      uploded_by,
      uploded_by_name,
      created_at,
      updated_at
    });
    const addProperty= await properties.save();
    res.send(addProperty);
  } catch (error) {
    next(error);
  }
});
//Update Property
router.patch("/properties/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Properties.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Property
router.delete("/properties/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Properties.findOne({ _id: id });
    if (find) {

      const update = {'trash':1};
      const id = req.params.id;
      const option = { new: true };
      const deleted = await Properties.findByIdAndUpdate(id, update, option);

      //const deleted = await Properties.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
router.delete("/propertiesDeletePermanent/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Properties.findOne({ _id: id });
    if (find) {
      const deleted = await Properties.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
//get property by property_id
// router.delete("/properties/:id", async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const find = await Properties.findOne({ _id: id });
//     if (find) {
//       const deleted = await Properties.findByIdAndDelete({ _id: id });
//       res.send(deleted);
//     } else {
//       res.send("Id does not exist");
//     }
//   } catch (error) {
//    next(error)
//   }
// });
module.exports = router;