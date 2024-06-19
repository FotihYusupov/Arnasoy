const { Schema, model, default: mongoose } = require("mongoose");

const DeptHistorySchema = new Schema({
  client: {
    type: mongoose.Types.ObjectId,
    ref: 'clients',
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: Number,
    required: true
  },
  invoice: {
    type: String,
    required: true,
  },
  invoiceDate: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  }
}, {
  timestamps: true
});

const DeptHistory = model("deptHistory", DeptHistorySchema);

module.exports = DeptHistory;
