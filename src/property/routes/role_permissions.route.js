require('dotenv').config();
const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const RolePermissons = require("../../models/role_permissions");
const axios = require('axios');	

//get Account
router.get('/userpermissions', async (req, res, next) => {
  try {
    const data = await RolePermissons.find({role:"1"})
    const total_accounts = await RolePermissons.countDocuments({role:"1"});
    res.send({
      total: total_accounts,
      accounts: data, 
    });
  }
  catch (error) {
    next(error)
  }
})

//get Account by ID
router.get('/userpermissions/:id', async (req, res, next) => {

  try {
    const data = await RolePermissons.find({_id:req.params.id,role:"1"});
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Update Account
/*router.patch("/userpermissions/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await RolePermissons.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});*/
//Delete Account
router.delete("/userpermissions/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await RolePermissons.findOne({ _id: id });
    if (find) {
      const deleted = await RolePermissons.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }

});
//get permissions by userID
router.get('/userpermissionssection', async (req, res, next) => {
  try {
    console.log({user_id:req.query.user_id, permissions_section:req.query.section});
    const data = await RolePermissons.find({user_id:req.query.user_id, permissions_section:req.query.section})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
});
router.get('/userpermissions/:user_id', async (req, res, next) => {
  try {
    const data = await RolePermissons.find({user_id:req.params.user_id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
});

router.get('/getUserPermission/:user_id', async (req, res, next) => {
  try {
    const data = await RolePermissons.find({user_id:req.params.user_id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
});
//Create Account
router.post("/userpermissions", async (req, res, next) => {
  var parse_data = req.body.permissionsdata;
  try {
    const prop_permissions_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'properties',
      permission_view:parse_data.property_view,
      permission_add:parse_data.property_add,
      permission_edit:parse_data.property_edit,
      permission_trash:parse_data.property_trash,
      permission_delete:parse_data.property_delete,
    });
    const prop_permissions_data = await prop_permissions_save.save();

    const master_permissions_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'master_forms',
      permission_view:parse_data.master_forms_view,
      master_forms_add:parse_data.master_forms_add,
      permission_add:parse_data.master_forms_edit,
      permission_trash:parse_data.master_forms_trash,
      permission_delete:parse_data.master_forms_delete
    });
    const master_permissions_data = await master_permissions_save.save();

    const users_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'users',
      permission_view:parse_data.users_view,
      permission_add:parse_data.users_add,
      permission_edit:parse_data.users_edit,
      permission_trash:parse_data.users_trash,
      permission_delete:parse_data.users_delete,
    });
    const users_data = await users_save.save();

    const enquiries_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'enquiries',
      permission_view:parse_data.enquiries_view,
      permission_add:parse_data.enquiries_add,
      permission_edit:parse_data.enquiries_edit,
      permission_trash:parse_data.enquiries_trash,
      permission_delete:parse_data.enquiries_delete,
    });
    const enquiries_data = await enquiries_save.save();

    const contact_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'contact',
      permission_view:parse_data.contact_view,
      permission_add:parse_data.contact_add,
      permission_edit:parse_data.contact_edit,
      permission_trash:parse_data.contact_trash,
      permission_delete:parse_data.contact_delete,
    });
    const contact_data = await contact_save.save();

    const feedback_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'feedback',
      permission_view:parse_data.feedback_view,
      permission_add:parse_data.feedback_add,
      permission_edit:parse_data.feedback_edit,
      permission_trash:parse_data.feedback_trash,
      permission_delete:parse_data.feedback_delete,
    });
    const feedback_data = await feedback_save.save();

    const subscriptions_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'subscriptions',
      permission_view:parse_data.subscriptions_view,
      permission_add:parse_data.subscriptions_add,
      permission_edit:parse_data.subscriptions_edit,
      permission_trash:parse_data.subscriptions_trash,
      permission_delete:parse_data.subscriptions_delete,
    });
    const subscriptions_data = await subscriptions_save.save();


    const testimonial_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'testimonial',
      permission_view:parse_data.testimonial_view,
      permission_add:parse_data.testimonial_add,
      permission_edit:parse_data.testimonial_edit,
      permission_trash:parse_data.testimonial_trash,
      permission_delete:parse_data.testimonial_delete,
    });
    const testimonial_data = await testimonial_save.save();

    const setting_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'setting',
      permission_view:parse_data.setting_view,
      permission_add:parse_data.setting_add,
      permission_edit:parse_data.setting_edit,
      permission_trash:parse_data.setting_trash,
      permission_delete:parse_data.setting_delete,
    });
    const setting_data = await setting_save.save();


    const blog_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'blog',
      permission_view:parse_data.blog_view,
      permission_add:parse_data.blog_add,
      permission_edit:parse_data.blog_edit,
      permission_trash:parse_data.blog_trash,
      permission_delete:parse_data.blog_delete,
    });
    const blog_data = await blog_save.save();


    const cms_save = new RolePermissons({
      user_id:req.body.user_id,
      role:'subadmin',
      permissions_section:'cms',
      permission_view:parse_data.cms_view,
      permission_add:parse_data.cms_add,
      permission_edit:parse_data.cms_edit,
      permission_trash:parse_data.cms_trash,
      permission_delete:parse_data.cms_delete,
    });
    const cms_data = await cms_save.save();
    res.send(cms_data);
  } catch (error) {
    next(error);
  }
});
//Update permissions
router.patch("/userpermissions/:id", async (req, res, next) => {
  var parse_data = req.body.permissionsdata;
  console.log('updating data');
  try {
    /*const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    
    const updatedDetails = await RolePermissons.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);*/


     /* const filter = { name: 'Luke Skywalker' };
      const update = { rank: 'Jedi Knight' };
      const opts = { new: true };

      let doc = await Character.findOneAndUpdate(filter, update, opts);*/

      const prop_permissions_json ={
        permission_view:parse_data.property_view,
        permission_add:parse_data.property_add,
        permission_edit:parse_data.property_edit,
        permission_trash:parse_data.property_trash,
        permission_delete:parse_data.property_delete
      };
      let doc = await RolePermissons.updateMany(
        { $and: [{ user_id:req.body.user_id }, { permissions_section:'properties' }] }, // Match documents where field1 and field2 match the given values
        { $set: prop_permissions_json } // Update the specified fields
      );

      const master_permissions_json ={
        permission_view:parse_data.master_forms_view,
        master_forms_add:parse_data.master_forms_add,
        permission_edit:parse_data.master_forms_edit,
        permission_trash:parse_data.master_forms_trash,
        permission_delete:parse_data.master_forms_delete
      };
      let doc2 = await RolePermissons.updateMany(
        { $and: [{ user_id:req.body.user_id }, { permissions_section:'master_forms' }] }, // Match documents where field1 and field2 match the given values
        { $set: master_permissions_json } // Update the specified fields
      );

      const users_json ={
          permission_view:parse_data.users_view,
          permission_add:parse_data.users_add,
          permission_edit:parse_data.users_edit,
          permission_trash:parse_data.users_trash,
          permission_delete:parse_data.users_delete
      };
      let doc3 = await RolePermissons.updateMany(
        { $and: [{ user_id:req.body.user_id }, { permissions_section:'users' }] }, // Match documents where field1 and field2 match the given values
        { $set: users_json } // Update the specified fields
      );

      const enquiries_json ={
        permission_view:parse_data.enquiries_view,
        permission_add:parse_data.enquiries_add,
        permission_edit:parse_data.enquiries_edit,
        permission_trash:parse_data.enquiries_trash,
        permission_delete:parse_data.enquiries_delete,
    };
    let doc4 = await RolePermissons.updateMany(
      { $and: [{ user_id:req.body.user_id }, { permissions_section:'enquiries' }] }, // Match documents where field1 and field2 match the given values
      { $set: enquiries_json } // Update the specified fields
    );

    const contact_json ={
        permission_view:parse_data.contact_view,
        permission_add:parse_data.contact_add,
        permission_edit:parse_data.contact_edit,
        permission_trash:parse_data.contact_trash,
        permission_delete:parse_data.contact_delete,
    };
    let doc5 = await RolePermissons.updateMany(
      { $and: [{ user_id:req.body.user_id }, { permissions_section:'contact' }] }, // Match documents where field1 and field2 match the given values
      { $set: contact_json } // Update the specified fields
    );

    const feedback_json ={
      permission_view:parse_data.feedback_view,
      permission_add:parse_data.feedback_add,
      permission_edit:parse_data.feedback_edit,
      permission_trash:parse_data.feedback_trash,
      permission_delete:parse_data.feedback_delete,
    };
    let doc6 = await RolePermissons.updateMany(
      { $and: [{ user_id:req.body.user_id }, { permissions_section:'feedback' }] }, // Match documents where field1 and field2 match the given values
      { $set: feedback_json } // Update the specified fields
    );

    const subscriptions_json ={
      permission_view:parse_data.subscriptions_view,
      permission_add:parse_data.subscriptions_add,
      permission_edit:parse_data.subscriptions_edit,
      permission_trash:parse_data.subscriptions_trash,
      permission_delete:parse_data.subscriptions_delete,
    };
    let doc7 = await RolePermissons.updateMany(
      { $and: [{ user_id:req.body.user_id }, { permissions_section:'subscriptions' }] }, // Match documents where field1 and field2 match the given values
      { $set: subscriptions_json } // Update the specified fields
    );


    const testimonial_json ={
      permission_view:parse_data.testimonial_view,
      permission_add:parse_data.testimonial_add,
      permission_edit:parse_data.testimonial_edit,
      permission_trash:parse_data.testimonial_trash,
      permission_delete:parse_data.testimonial_delete,
    };
    let doc8 = await RolePermissons.updateMany(
      { $and: [{ user_id:req.body.user_id }, { permissions_section:'testimonial' }] }, // Match documents where field1 and field2 match the given values
      { $set: testimonial_json } // Update the specified fields
    );

    const setting_json ={
      permission_view:parse_data.setting_view,
      permission_add:parse_data.setting_add,
      permission_edit:parse_data.setting_edit,
      permission_trash:parse_data.setting_trash,
      permission_delete:parse_data.setting_delete,
    };
    let doc9 = await RolePermissons.updateMany(
      { $and: [{ user_id:req.body.user_id }, { permissions_section:'setting' }] }, // Match documents where field1 and field2 match the given values
      { $set: setting_json } // Update the specified fields
    );

    const blog_json ={
      permission_view:parse_data.blog_view,
      permission_add:parse_data.blog_add,
      permission_edit:parse_data.blog_edit,
      permission_trash:parse_data.blog_trash,
      permission_delete:parse_data.blog_delete,
    };
    let doc10 = await RolePermissons.updateMany(
      { $and: [{ user_id:req.body.user_id }, { permissions_section:'blog' }] }, // Match documents where field1 and field2 match the given values
      { $set: blog_json } // Update the specified fields
    );

    const cms_json ={
      permission_view:parse_data.cms_view,
      permission_add:parse_data.cms_add,
      permission_edit:parse_data.cms_edit,
      permission_trash:parse_data.cms_trash,
      permission_delete:parse_data.cms_delete,
    };
    let doc11 = await RolePermissons.updateMany(
      { $and: [{ user_id:req.body.user_id }, { permissions_section:'cms' }] }, // Match documents where field1 and field2 match the given values
      { $set: cms_json } // Update the specified fields
    );

    res.send(doc11);

  } catch (error) {
    next(error);
  }
});

module.exports = router;