const { Schema, model, Types } = require("mongoose");

const ProductCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  unit: {
    type: Types.ObjectId,
    ref: 'Units'
  },
  saledPrice: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
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

const ProductCategory = model("productCategory", ProductCategorySchema);

module.exports = ProductCategory;
