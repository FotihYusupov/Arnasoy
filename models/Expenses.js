const mongoose = require("mongoose");

const ExpensesSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    type: {
      type: mongoose.Types.ObjectId,
      ref: "satisfactionType",
      required: true,
    },
    expComment: {
      type: String,
    },
    sum: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "users",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Expenses = mongoose.model("expenses", ExpensesSchema);

module.exports = Expenses;
