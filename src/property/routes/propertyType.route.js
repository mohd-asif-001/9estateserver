require('dotenv').config();
const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Properties = require("../../models/property");
const PropertyType = require("../../models/propertyType");

"use strict";
const nodemailer = require("nodemailer");
async function main() {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: process.env.host,
    port: process.env.port,
    secure: process.env.secure,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });
  let info = await transporter.sendMail({
    from: 'sales@avitronmailer.ga',
    to: "fegoda6061@khaxan.com",
    subject: "Nodemailer test message ✔",
    text: "This is test message from nodemailer.",
    html: '<head><link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i" rel="stylesheet"><title></title></head><body><table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0px auto;"><tbody><tr><td class="fusionResponsiveCanvas" valign="top" style="width:100%;padding-top:15px;padding-bottom:15px;background-color:rgb(246,246,246);background-repeat:no-repeat;font-family:sans-serif;"><table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody><tr><td valign="top" style="width:100%;"><table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(25,118,210);"> <tbody><tr><td style="background-color:rgb(25,118,210);padding:7px 15px;border-color:transparent;border-width:0px;border-style:none;"><table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"><tbody><tr><th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"/></th><th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"><div data-aqa="block-image" style="overflow:hidden;"><table cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tbody><tr><td class="null" style="padding:0px 0px 20px;"><table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:auto;width:59%;"><tbody><tr><th style="display:block;border-color:transparent;border-style:none;border-width:0px;"><img src="https://i.imgur.com/HRvqyP2.png" class="fusionResponsiveImage" alt="" width="318" height="auto" style="display:block;width:318px;height:auto;margin:auto;background-color:transparent;"/></th></tr></tbody></table></td></tr></tbody></table></div></th><th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"><tbody><tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;"> <tbody> <tr> <td style="padding-top:10px;padding-bottom:10px;"> <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0px auto;width:100%;"> <tbody> <tr> <td style="mso-line-height-rule:exactly;font-size:0px;line-height:0px;border-bottom:1px solid rgb(136,136,136);"> &nbsp; </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <h2 style="mso-line-height-rule:exactly;line-height:30px;text-align:center;color:rgb(51,51,51);font-size:24px;font-family:sans-serif;margin-top:0px;margin-bottom:0px;"> <span style="color:rgb(0, 0, 0);font-size:30px;"> ThankYou</span> </h2> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> <strong style="font-size:14px;color:rgb(0, 0, 0);">Your New property Type is Added Successfully.</strong><span style="font-size:14px;color:rgb(0, 0, 0);">&nbsp;</span> </p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:3px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> <strong>Thanks & Regards</strong> </p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:0px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> Team 8<sup>th</sup>property </p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;"> <tbody> <tr> <td style="padding-top:10px;padding-bottom:10px;"> <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0px auto;width:100%;"> <tbody> <tr> <td style="mso-line-height-rule:exactly;font-size:0px;line-height:0px;border-bottom:1px solid rgb(136,136,136);"> &nbsp; </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(25,118,210);"> <tbody> <tr> <td style="background-color:rgb(25,118,210);padding:12px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:255px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> <strong style="font-size:20px;color:rgb(255, 255, 255);">Call Now : 234354456456</strong> </p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:255px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> <strong style="font-size:20px;color:rgb(255, 255, 255);">Call Now : 234354456456</strong> </p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body>', 
  });
  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
//get PropType with propCount
router.get('/getCatWithPropCount', async(req, res, next)=>{
    try {
      const firstModelData = await PropertyType.find({'status':'Yes'});
      let lasInd = firstModelData.length-1;
      let propTypeImg = [];
      let propTypeTitle = [];
      let propTypePropCount= [];
      for (let i = 0; i < firstModelData.length; i++) {
        const secondModelData = await Properties.countDocuments({ propertyType: { $regex: new RegExp("^" + firstModelData[i].title.toLowerCase().trim(), "i") },  status:0, trash:0});
        propTypeImg.push(firstModelData[i].propertyType_img);
        propTypeTitle.push(firstModelData[i].title);
        propTypePropCount.push(secondModelData);
        if(i==lasInd){
          res.send({
            propertyType: propTypeTitle,
            propertyTypeImg: propTypeImg,
            propertyTypeCount:propTypePropCount
          });
        }
      }
    } catch (err) {
      console.log({ error: 'An error occurred' });
      res.send({ error: 'An error occurred' });
    }
   

})

//get Categories
router.get('/admin/getactivepropertytype', async (req, res, next) => {

  try {
    const data = await PropertyType.find();
    res.send(data);
  }
  catch (error) {
    next(error)
  }
})

router.get('/mypropertytype', async (req, res, next) => {
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
      const accountsCollection = await PropertyType.find({$or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await PropertyType.countDocuments({$or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        propertytype: accountsCollection,
      });
    } else {
      const accountCollection = await PropertyType.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await PropertyType.countDocuments();
      res.send({
        total: total_pages,
        propertytype: accountCollection,
      });
    }
  } catch (error) {
    next(error);
  }

})
router.get('/checkUrlPropertyType/:slug', async (req, res, next) => {
  try {
    const data = await PropertyType.find({slug:req.params.slug})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
router.get("/getallpropertytype", async (req, res, next) => {
  try {
    const propertytype = await PropertyType.find();
    res.send(propertytype);
  } catch (error) {
    next(error);
  }
});
router.get("/getmypropertytypesearch", async (req, res, next) => {
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
      const mypropertytypeCollection = await PropertyType.find({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await PropertyType.countDocuments({
        $or: [
          { title: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: mypropertytypeCollection,
      });
    } else {
      const mypropertytypeCollection = await PropertyType.find()
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await PropertyType.countDocuments();
      res.send({
        total: total_pages,
        data: mypropertytypeCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Categories by ID
router.get('/mypropertytype/:id', async (req, res, next) => {

  try {
    const data = await PropertyType.find({_id:req.params.id})
    res.send({ data: data })

  }
  catch (error) {
    next(error)
  }
})
//Create Category
router.post("/mypropertytype", async (req, res, next) => {
  //main().catch(console.error);
  try {
    console.log(req.body);
    if(req.body.propertyType_img!=''){
      const propertyType = new PropertyType({
        propertyType_img:req.body.propertyType_img,
        title:req.body.title,
        slug:req.body.slug,
        status:req.body.status,
        created_at:req.body.created_at,
        updated_at:req.body.updated_at,
      });
      const addpropertytype = await propertyType.save();
      res.send(addpropertytype);
    }else{
      const propertyType = new PropertyType({
        title:req.body.title,
        slug:req.body.slug,
        status:req.body.status,
        created_at:req.body.created_at,
        updated_at:req.body.updated_at,
      });
      const addpropertytype = await propertyType.save();
      res.send(addpropertytype);
    }
    
  } catch (error) {
    next(error);
  }
});
//Update Category
router.patch("/mypropertytype/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    if(req.body.propertyType_img!=''){
      const updatedDetails = await PropertyType.findByIdAndUpdate(id, {propertyType_img:req.body.propertyType_img, title:req.body.title, status:req.body.status}, option);
      res.send(updatedDetails);
    }else{
      const updatedDetails = await PropertyType.findByIdAndUpdate(id, {title:req.body.title, status:req.body.status}, option);
      res.send(updatedDetails);
    }
  } catch (error) {
    next(error);
  }
});
//Delete Category
router.delete("/mypropertytype/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await PropertyType.findOne({ _id: id });
    if (find) {
      const deleted = await PropertyType.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;

