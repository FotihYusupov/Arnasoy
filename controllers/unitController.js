const Unit = require("../models/Unit");

exports.getAll = async (req, res) => {
  try {
    const units = await Unit.find({ deleted: false });
    res.status(200).json({
      data: units,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.createUnit = async (req, res) => {
  try {
    const newUnit = new Unit({ ...req.body });
    await newUnit.save();
    return res.status(200).json({
      data: newUnit,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.updateUnit = async (req, res) => {
  try {
    const findUnit = await Unit.findById(req.params.id);
    if (!findUnit) {
      return res.status(404).json({
        message: "Unit Not Found",
      });
    }
    Object.assign(findUnit, req.body);
    await findUnit.save();
    return res.status(200).json({
      data: findUnit,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.deleteUnit = async (req, res) => {
  try {
    const deletedUnit = await Unit.findById(req.params.id);
    if (!deletedUnit) {
      return res.status(404).json({
        message: "Unit Not Found",
      });
    }
    deletedUnit.deleted = true;
    deletedUnit.deletedAt = new Date();
    await deletedUnit.save();
    return res.json({
      message: "Unit deleted",
    });
  } catch (err) {
    return res.json(err);
  }
};
