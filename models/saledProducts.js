const mongoose = require('mongoose');

const SaledProductsSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  products: {
    type: Array,
  },
  invoice: {
    type: String,
    required: true,
    unique: true
  },
  invoiceDate: {
    type: String,
  },
  client: {
    type: mongoose.Types.ObjectId,
    ref: "client",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
  warehouse: {
    type: mongoose.Types.ObjectId,
    ref: "warehouse",
  },
  sum: {
    type: Number,
    required: true,
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
