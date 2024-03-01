const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  deleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

const Warehouse = mongoose.model('warehouse', WarehouseSchema);

module.exports = Warehouse;
