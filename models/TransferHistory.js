const mongoose = require('mongoose');

const TransferHistorySchema = new mongoose.Schema({
  oldWarehouse: {
    type: mongoose.Types.ObjectId,
    ref: "warehouse"
  },
  newWarehouse: {
    type: mongoose.Types.ObjectId,
    ref: "warehouse"
  },
  oldParty: {
    type: mongoose.Types.ObjectId,
    ref: "party",
  },
  newParty: {
    type: mongoose.Types.ObjectId,
    ref: "party",
  },
  amount: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users"
  },
  transportNumber: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const TransferHistory = mongoose.model('transferHistory', TransferHistorySchema);

module.exports = TransferHistory;
