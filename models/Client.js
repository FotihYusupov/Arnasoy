const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    pateBirth: {
      type: Date,
    },
    companyName: {
      type: String,
    },
    address: {
      type: String,
    },
    mailAddress: {
      type: String,
    },
    bank: {
      type: String,
    },
    mfo: {
      type: String,
    },
    oked: {
      type: String,
    },
    inn: {
      type: String,
    },
    bank_account: {
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

const Client = mongoose.model("client", ClientSchema);

module.exports = Client;
