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
      ref: "party"
    },    
    price: {
      type: Number,
    },
    saledPrice: {
      type: Number,
    },
    saled: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("product", ProductsSchema);

module.exports = Products;
