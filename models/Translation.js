const mongoose = require("mongoose");
const TranslationSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  uz: {
    type: String,
  },
  en: {
    type: String,
  },
  ru: {
    type: String,
  },
  kr: {
    type: String,
  },
});

const Translations = mongoose.model("translation", TranslationSchema);
module.exports = Translations;