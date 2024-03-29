const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    amount: {
      type: Number,
    },
    parties: {
      type: mongoose.Types.ObjectId,
      ref: "party",
    },
    warehouse: {
      type: mongoose.Types.ObjectId,
      ref: "warehouse",
    },
    price: {
      type: Number,
    },
    saledPrice: {
      type: Number,
      default: 0
    },
    saled: {
      type: Boolean,
      default: false,
    },
    saledAmount: {
      type: Number,
    },
    history: [
      {
        warehouse: {
          type: mongoose.Types.ObjectId,
        },
        createdAt: {
          type: Date,
        },
      },
    ],
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

const Products = mongoose.model("product", ProductsSchema);

module.exports = Products;
