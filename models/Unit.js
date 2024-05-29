const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    shortName: {
      type: String,
      required: true,
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

const Units = mongoose.model("Units", UnitSchema);

module.exports = Units;
