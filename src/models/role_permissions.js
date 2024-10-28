const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../../db/connection");
var rolePermissionSchema = new Schema({
  user_id: {
    type: String,
  },
  role: {
    type: String,
  },
  permissions_section: {
    type: String,
  },
  permission_view: {
    type: Boolean
  },
  permission_add: {
    type: Boolean
  },
  permission_edit: {
    type: Boolean
  },
  permission_trash: {
    type: Boolean
  },
  permission_delete: {
    type: Boolean
  },
  create_dt: {
    type: Date,
    required: true,
    default: Date.now
  },
  update_dt: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: Number,
    default: 1
  },
});
var RolePermissons = connection.model("role_permissions", rolePermissionSchema);
module.exports = RolePermissons;
