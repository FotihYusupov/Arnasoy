const mongoose = require("mongoose");

const PartyCostSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    party: {
      type: mongoose.Types.ObjectId,
      ref: "party",
    },
  },
  {
    timestamps: true,
  }
);

const PartyCost = mongoose.model("PartyCost", PartyCostSchema);

module.exports = PartyCost;
