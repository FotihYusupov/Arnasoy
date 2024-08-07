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
    mouth: {
      type: String,
      required: true,
    },
    paidDate: {
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

const Salary = mongoose.model("salary", SalarySchema);

module.exports = Salary;
