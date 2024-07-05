const { Schema, model } = require("mongoose");

const SettingsSchema = new Schema({
  settings: {
    type: Object,
    required: true
  }
});

const Settings = model("settings", SettingsSchema);

module.exports = Settings;
