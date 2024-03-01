const Client = require("../models/Client");

exports.getAll = async (req, res) => {
  try {
    const clients = await Client.find({ deleted: false });
    return res.json({ data: clients });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addClient = async (req, res) => {
  try {
    const newClient = new Client({
      name: req.body.name,
      phone: req.body.phone,
    });
    await newClient.save();
    return res.status(201).json({ data: newClient });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }
    return res.json({ data: updatedClient });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const now = new Date();
    const deletedClient = await Client.findByIdAndUpdate(req.params.id, {
      deleted: true,
      deletedAt: now,
    });
    if (!deletedClient) {
      return res.status(404).json({ error: "Client not found" });
    }
    return res.json({ message: "Client deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
