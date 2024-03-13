const mongoose = require("mongoose");

const DeptSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    sum: {
      type: Number,
    },
    saleds: {
      type: mongoose.Types.ObjectId,
      ref: "saleds",
    },
    clients: {
      type: mongoose.Types.ObjectId,
      ref: "clients"
    },
    paid: {
      type: Boolean,
      default: false,
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

const Dept = mongoose.model("dept", DeptSchema);

module.exports = Dept;
