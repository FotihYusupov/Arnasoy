const { Schema, model, default: mongoose } = require("mongoose");

const DeptHistorySchema = new Schema({
  client: {
    type: mongoose.Types.ObjectId,
    ref: 'client',
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transferExpense: {
    type: Number,
  },
  paymentType: {
    type: Number,
    required: true
  },
  invoice: {
    type: String,
    required: true,
  },
  invNum: {
    type: Number,
  },
  invoiceDate: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  createdDate: {
    type: Number,
  }
}, {
  timestamps: true
});

const DeptHistory = model("deptHistory", DeptHistorySchema);

module.exports = DeptHistory;
