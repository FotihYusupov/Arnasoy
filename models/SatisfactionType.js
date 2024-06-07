const mongoose = require('mongoose');

const SatisfactionSchemaSchema = new mongoose.Schema({
  type: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sum: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
}, {
  timestamps: true,
},);

const SatisfactionType = mongoose.model('satisfactionType', SatisfactionSchemaSchema);

module.exports = SatisfactionType;
