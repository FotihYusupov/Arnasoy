const mongoose = require('mongoose');

const SaledProductsSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  products: {
    type: Array,
  },
  invoiceDate: {
    type: Date,
  },
  client: {
    type: mongoose.Types.ObjectId,
    ref: "client",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  warehouse: {
    type: mongoose.Types.ObjectId,
    ref: "warehouse",
  },
  comment: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  }
}, {
  timestamps: true,
},);

const SaledProducts = mongoose.model('saled', SaledProductsSchema);

module.exports = SaledProducts;
