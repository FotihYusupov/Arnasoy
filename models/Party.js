const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  client: {
    type: mongoose.Types.ObjectId,
    ref: "client",
  },
  logistic: {
    type: mongoose.Types.ObjectId,
    ref: "client",
  },
  invoice: {
    type: String,
  },
  invoiceDate: {
    type: String,
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
    type: String,
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
    ref: "users",
  },
  saled: {
    type: Boolean,
    default: false
  },
  totalSum: {
    type: Number,
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
}, {
  timestamps: true,
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
