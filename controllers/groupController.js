const Group = require('../models/Group');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const newItem = await Group.create({ name });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    const items = await Group.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedItem = await Group.findByIdAndUpdate(id, { name }, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByIdAndUpdate(id, { deleted: true, deletedAt: new Date() }, { new: true });
    res.status(200).json(group);
  } catch (err) {
    console.log(err);
    return res.json(err)
  }
}
