const { Schema, model } = require("mongoose");

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
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

const Group = model("group", GroupSchema);

module.exports = Group;
