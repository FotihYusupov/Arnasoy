const ProductCategory = require('../models/productCategory');
const pagination = require("../utils/pagination")

exports.create = async (req, res) => {
  try {
    const { name, unit, saledPrice, price } = req.body;
    const newProductCategory = await ProductCategory.create({ name, unit, saledPrice, price });
    res.status(201).json({ data: newProductCategory });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    const data = await pagination(ProductCategory, req.query, 'unit')
    const productCategories = await ProductCategory.find({ deleted: false }).populate('unit');
    res.status(200).json({ data: productCategories });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await ProductCategory.findById(id);
    
    if (!productCategory) {
      return res.status(404).json({ data: null, message: "Product category not found" });
    }

    res.status(200).json({ data: productCategory });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedProductCategory = await ProductCategory.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ data: updatedProductCategory });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProductCategory = await ProductCategory.findByIdAndUpdate(id, { deleted: true, deletedAt: new Date() }, { new: true });
    res.status(200).json({ data: deletedProductCategory });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
};
