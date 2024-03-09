const mongoose = require('mongoose');

const SatisfactionSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  comment: {
    type: String,
  },
  price: {
    type: String,
  }
}, {
  timestamps: true,
},);

const Satisfaction = mongoose.model('satisfaction', SatisfactionSchema);

module.exports = Satisfaction;
