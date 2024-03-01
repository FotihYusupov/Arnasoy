const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  role: {
    type: String,
  },
  reports: {
    type: Array,
  },
  products: {
    type: Array,
  },
  money: {
    type: Array,
  },
  settings: {
    type: Array,
  },
  deletedAt: {
    type: Date,
    default: null, 
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

const Role = mongoose.model('role', RoleSchema);

module.exports = Role;
