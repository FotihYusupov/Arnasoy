const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema(
  {
    salary: {
      type: Number,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    month: {
      type: String,
      required: true,
    },
    paidDate: {
      type: Number,
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

const Salary = mongoose.model("salary", SalarySchema);

module.exports = Salary;
