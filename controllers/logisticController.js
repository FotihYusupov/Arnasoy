const Logistic = require("../models/Logistic");

exports.getAll = async (req, res) => {
  try {
    const logistics = await Logistic.find({ deleted: false });
    return res.json({ data: logistics });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addLogistic = async (req, res) => {
  try {
    const newLogistic = await Logistic.create({ ...req.body });
    return res.json({ data: newLogistic });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateLogistic = async (req, res) => {
  try {
    const updatedLogistic = await Logistic.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedLogistic) {
      return res.status(404).json({ error: "Logistic not found" });
    }
    return res.json({ data: updatedLogistic });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteLogistic = async (req, res) => {
  try {
    const deletedLogistic = await Logistic.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!deletedLogistic) {
      return res.status(404).json({ error: "Logistic not found" });
    }
    return res.json({ message: "Logistic deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
