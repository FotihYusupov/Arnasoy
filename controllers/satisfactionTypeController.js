const SatisfactionType = require("../models/SatisfactionType");
const paginate = require("../utils/pagination");

exports.getAll = async (req, res) => {
  try {
    const data = await paginate(SatisfactionType, req.query, "expense-type");
    return res.json(data);
  } catch (err) {
    return res.status(400).json(err);
  };
};

exports.add = async (req, res) => {
  console.log('hello');
  try {
    req.body.sum = parseInt(req.body.sum);
    if(typeof req.body.sum !== Number) delete req.body.sum;
    const newType = new SatisfactionType({ ...req.body });
    await newType.save();
    return res.json(newType);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

exports.update = async (req, res) => {
  try {
    const updatedType = await SatisfactionType.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedType) {
      return res.status(404).json({
        message: "Expense Type Not Found!",
      });
    }
    return res.json({
      data: updatedType,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedType = await SatisfactionType.findByIdAndDelete(req.params.id);
    if (!deletedType) {
      return res.status(404).json({
        message: "Expense Type Not Found!",
      });
    };
    return res.json({
      message: "Expense type not found",
    });
  } catch (err) {
    return res.status(400).json(err);
  };
};
