const mongoose = require('mongoose');

const balanceHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users"
  },
  current: {
    type: Number,
    required: true
  },
  next: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
  },
  type: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
  },
  comment: {
    type: String,
  },
  historyType: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
});

const BalanceHistory = mongoose.model('balanceHistory', balanceHistorySchema);

module.exports = BalanceHistory;
