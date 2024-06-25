const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
    },
    login: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    arriveDate: {
      type: Date,
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "role",
      required: true,
    },
    dateBirth: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    passportSeries: {
      type: String,
    },
    issuedBy: {
      type: String,
    },
    inps: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
    username: {
      type: String,
      default: null,
    },
    chatId: {
      type: Number,
    },
    bot: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0
    },
    cashBalance: {
      type: Number,
      default: 0
    },
    cardBalance: {
      type: Number,
      default: 0
    },
    salary: {
      type: Number,
      default: 0,
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

const Users = mongoose.model("users", UserSchema);

module.exports = Users;
