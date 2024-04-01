const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  client: {
    type: mongoose.Types.ObjectId,
    ref: "client",
  },
  invoice: {
    type: String,
  },
  invoiceDate: {
    type: Date,
  },
  status: {
    type: Number,
  },
  statusHistory: [
    {
      status: {
        type: Number,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  departureDate: {
    type: Date,
  },
  transportNumber: {
    type: String,
  },
  comment: {
    type: String,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
  warehouse: {
    type: mongoose.Types.ObjectId,
    ref: "warehouse",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  saled: {
    type: Boolean,
    default: false
  },
  totalSum: {
    type: Number,
    required: true
  },
  products: [{
    type: mongoose.Types.ObjectId,
    ref: "product"
  }],
  paymentType: {
    type: Number,
    required: true,
    default: 1,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

PartySchema.pre("save", function (next) {
  if (this.isNew || this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date(),
    });
  }
  next();
});

const Party = mongoose.model("party", PartySchema);

module.exports = Party;
