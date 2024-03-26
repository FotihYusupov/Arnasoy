const ProductCategory = require('../models/ProductCategory');

exports.create = async (req, res) => {
  try {
    const { name, unit, output, input } = req.body;
    const newProductCategory = await ProductCategory.create({ name, unit, output, input });
    res.status(201).json(newProductCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    const productCategories = await ProductCategory.find();
    res.status(200).json(productCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedProductCategory = await ProductCategory.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedProductCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProductCategory = await ProductCategory.findByIdAndUpdate(id, { deleted: true, deletedAt: new Date() }, { new: true });
    res.status(200).json(deletedProductCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
