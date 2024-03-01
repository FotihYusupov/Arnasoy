const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  }
}, {
  timestamps: true,
},);

const Client = mongoose.model('client', ClientSchema);

module.exports = Client;
