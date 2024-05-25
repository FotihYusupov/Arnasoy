const Category = require("../models/Category");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json({ data: newCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false });
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.status(200).json({ data: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
