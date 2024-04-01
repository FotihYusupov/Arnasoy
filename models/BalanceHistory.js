const mongoose = require('mongoose');

const balanceHistorySchema = new mongoose.Schema({
  client: {
    type: mongoose.Types.ObjectId,
    ref: "clients"
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users"
  },
  invoice: {
    type: String,
  },
  invoiceDate: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  type: {
    type: Number,
  },
  currency: {
    type: String,
  },
  comment: {
    type: String,
  }
});

const BalanceHistory = mongoose.model('balanceHistory', balanceHistorySchema);

module.exports = BalanceHistory;
