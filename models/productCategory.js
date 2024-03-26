const { Schema, model } = require("mongoose");

const ProductCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  unit: {
    type: Number,
  },
  output: {
    type: Number,
    default: 0
  },
  input: {
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
