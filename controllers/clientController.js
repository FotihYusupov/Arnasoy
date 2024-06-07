const Client = require("../models/Client");
const Users = require("../models/User");
const BalanceHistory = require("../models/BalanceHistory");
const generateId = require("../utils/generateId");
const paginate = require("../utils/pagination");

exports.getAll = async (req, res) => {
  try {
    const data = await paginate(Client, req.query, 'clients', 'category', 'group')
    return res.json(data)
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
    if (paymentType == 2) {
      if (findUser.cardBalance >= sum) {
        findUser.cardBalance += sum;
        await findUser.save();
      } else {
        return res.json({
          message: "You don't have enough funds in your balance",
        });
      }
    } else if (paymentType == 3) {
      if (findUser.cashBalance >= sum) {
        findUser.cashBalance += sum;
        await findUser.save();
      } else {
        return res.json({
          message: "You don't have enough funds in your balance",
        });
      }
    } else if (paymentType == 4) {
      if (findUser.balance >= sum) {
        findUser.balance += sum;
        await findUser.save();
      }
    } else {
      return res.json({
        message: "You don't have enough funds in your balance",
      });
    }
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { balance: req.body.amount },
      { new: true }
    );
    await BalanceHistory.create({
      ...req.body,
    });
    const findUser = await Users.findById(req.headers.userId)
    const paymentType = req.body.paymentType
    return res.json({
      message: "Client balance updated",
      data: updatedClient,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.moneyOut = async (req, res) => {
  try {
    const findClient = await Client.findById(req.params.id);
    const findUser = await Users.findById(req.headers.userId);
    const paymentType = req.body.paymentType;

    if (paymentType == 2) {
      if (findUser.cardBalance >= sum) {
        findUser.cardBalance -= sum;
        await findUser.save();
      } else {
        return res.json({
          message: "You don't have enough funds in your balance",
        });
      }
    } else if (paymentType == 3) {
      if (findUser.cashBalance >= sum) {
        findUser.cashBalance -= sum;
        await findUser.save();
      } else {
        return res.json({
          message: "You don't have enough funds in your balance",
        });
      }
    } else if (paymentType == 4) {
      if (findUser.balance >= sum) {
        findUser.balance -= sum;
        await findUser.save();
      }
    } else {
      return res.json({
        message: "You don't have enough funds in your balance",
      });
    }
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
