const Client = require("../models/Client");
const generateId = require("../utils/generateId");

exports.getAll = async (req, res) => {
  try {
    const clients = await Client.find({ deleted: false })
      .skip((req.query.page - 1) * req.query.perPage)
      .limit(req.query.perPage);
    const total = await Client.countDocuments();
    return res.json({
      data: clients,
      _meta: {
        currentPage: +req.query.page,
        perPage: +req.query.perPage,
        totalCount: total,
        pageCount: Math.ceil(total / req.query.perPage),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addClient = async (req, res) => {
  try {
    const clients = await Client.find();
    const newClient = new Client({
      id: generateId(clients),
      ...req.body,
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

exports.updateClientBalance = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { balance: req.body.balance },
      { new: true }
    );
    return res.json({
      message: "Client balance updated",
      data: updatedClient,
    })
  } catch (err) {
    return res.json(err);
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
