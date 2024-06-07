const mongoose = require('mongoose');

const SatisfactionSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  type: {
    type: mongoose.Types.ObjectId,
    ref: "satisfactionType",
    required: true,
  },
  comment: {
    type: String,
  },
  price: {
    type: String,
  },
  parties: {
    type: mongoose.Types.ObjectId,
    ref: "party"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
  }
}, {
  timestamps: true,
},);

const Satisfaction = mongoose.model('satisfaction', SatisfactionSchema);

module.exports = Satisfaction;
