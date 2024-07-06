const Settings = require("../models/Settings");

exports.getAll = async (req, res) => {
  try {
    const settings = await Settings.find();
    return res.json({
      data: settings
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

exports.addSettings = async (req, res) => {
  try {
    const newSettings = await Settings.create({ ...req.body });
    return res.json({
      data: newSettings
    })
  } catch(err) {
    return res.status(400).json(err)
  }
}

exports.updateSettings = async (req, res) => {
  try {
    const findSettings = await Settings.findById(req.params.id)
    if(!findSettings) {
      return res.status(404).json({
        message: "Settings not found!"
      });
    }
    findSettings._doc = req.body;
    await findSettings.save();
    return res.json({
      data: findSettings
    })
  } catch(err) {
    return res.status(400).json(err)
  }
}