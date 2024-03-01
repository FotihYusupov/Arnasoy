const mongoose = require('mongoose');

const LogisticSchema = new mongoose.Schema({
  id: {
    type: Number,
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

const Logistic = mongoose.model('logistic', LogisticSchema);

module.exports = Logistic;
