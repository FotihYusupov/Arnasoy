const mongoose = require('mongoose');

const SaledProductsSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  product: {
    type: Array,
  },
  client: {
    type: mongoose.Types.ObjectId,
    ref: "client",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
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
