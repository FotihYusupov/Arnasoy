const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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

const Units = mongoose.model("unit", UnitSchema);

module.exports = Units;
