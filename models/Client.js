const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    type: {
      type: Number,
    },
    clientType: {
      type: Number
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category"
    },
    group: {
      type: mongoose.Types.ObjectId,
      ref: "group"
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
    bankAccount: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
    },
    indebtedness: { // bizning clientdan qarzidorligimiz
      type: Number,
      default: 0
    },
    dateBirth: {
      type: Number,
    },
    bot: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
    },
    chatId: {
      type: Number
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
