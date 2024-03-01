const Warehouse = require("../models/Warehouse");
const generateId = require("../utils/generateId");

exports.getAll = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ deleted: false });
    return res.json({
      data: warehouses,
    });
  } catch (err) {
    console.error("Error fetching warehouses:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addWarehouse = async (req, res) => {
  try {
    const { name } = req.body;
    const warehouses = await Warehouse.find();
    const newWarehouse = new Warehouse({ name, id: generateId(warehouses) });
    await newWarehouse.save();
    return res.json({
      message: "Warehouse added successfully",
      data: newWarehouse,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true }
    );
    return res.json({
      message: "Warehouse updated successfully",
      data: updatedWarehouse,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: now },
      { new: true }
    );
    if (!updatedWarehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    return res.json({ message: 'Warehouse marked as deleted.', data: updatedWarehouse });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
