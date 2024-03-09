const Satisfaction = require("../models/Satisfaction");

exports.getAll = async (req, res) => {
  try {
    const satisfactions = await Satisfaction.find();
  } catch (err) {
    return res.json(err)
  }
}