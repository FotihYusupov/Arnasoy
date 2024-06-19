const Client = require("../models/Client");
const Dept = require("../models/Debt");
const DeptHistory = require("../models/DeptHistory");
const generateId = require("../utils/generateId");
const paginate = require("../utils/pagination");
const { addBalance, updateBalance } = require("../utils/updateBalance");

exports.getAll = async (req, res) => {
  try {
    if (!req.query.filter) {
      req.query.filter = {};
    }
    req.query.filter.deleted = false;
    const data = await paginate(
      Client,
      req.query,
      "clients",
      "category",
      "group"
    );
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.byId = async (req, res) => {
  try {
    const findClient = await Client.findById(req.params.id);
    if(!findClient) {
      return res.status(404).json({
        message: "Client Not Found!"
      })
    }
    return res.json({
      data: findClient,
    });
  } catch (err) {
    return res.status(400).json(err)
  }
}

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

exports.updateClientBalanceAndPayDebt = async (req, res) => {
  try {
    const { balanceType, sum, invoice, invoiceDate } = req.body;
    const userId = req.headers.userId;
    const clientId = req.params.id;

    // Add balance update
    await addBalance(userId, balanceType, sum, "Client qarzini berganda.");

    // Find client
    const findClient = await Client.findById(clientId);
    if (!findClient) {
      return res.status(404).json({ message: "Client Not Found!" });
    }

    // Initialize remaining sum
    let remainingSum = parseInt(sum);

    // Retrieve all debts of the client
    let debts = await Dept.find({ clients: clientId }).sort({ _id: 1 }); // Sort by _id to ensure paying off from oldest to newest
    const updatedDebts = [];

    // Pay off debts
    for (let debt of debts) {
      if (remainingSum <= 0) break;
      if (debt.sum <= remainingSum) {
        remainingSum -= debt.sum;
        debt.sum = 0;
        debt.paid = true;
      } else {
        debt.sum -= remainingSum;
        remainingSum = 0;
      }
      updatedDebts.push(debt);
    }

    // Add remaining sum to the client's balance
    findClient.balance += remainingSum;
    await findClient.save();

    // Save updated debts
    for (let debt of updatedDebts) {
      await debt.save();
    }

    await DeptHistory.create({
      client: clientId,
      user: userId,
      amount: sum,
      paymentType: balanceType,
      invoice: invoice,
      invoiceDate: invoiceDate,
    });

    return res.json({
      message: "Client balance and debts updated successfully!",
      data: findClient,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.moneyOut = async (req, res) => {
  try {
    const findClient = await Client.findById(req.params.id);
    if (!findClient) {
      return res.status(404).json({
        message: "Client Not Found!",
      });
    }
    await updateBalance(
      req.headers.userId,
      req.body.balanceType,
      req.body.amount,
      "Clientga qarzimizni berdik."
    );
    findClient.indebtedness -= req.body.sum;
    await findClient.save();
    return res.json({
      message: "Success",
    });
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
