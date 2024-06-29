const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  role: {
    type: String,
    required: true
  },
  access: {
    type: Array,
    require: true
  }
});

const Role = mongoose.model('role', RoleSchema);

module.exports = Role;
