const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  cb: {
    type: String,
  },
  current: {
    type: String,
  },
  date: {
    type: Date,
  },
});

const Currency = mongoose.model('currency', CurrencySchema);

module.exports = Currency;
