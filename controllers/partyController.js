const Party = require("../models/Party");
const Users = require("../models/User");
const Products = require("../models/Products");
const generateId = require("../utils/generateId");
const bot = require("../bot");

exports.getAll = async (req, res) => {
  try {
    const includes = req.query.includes;
    let parties = await Party.find().populate("products");
    if (includes) {
      const fields = includes.split(",");
      parties = parties.map((party) => {
        const filteredParty = {};
        fields.forEach((field) => {
          filteredParty[field] = party[field];
        });
        return filteredParty;
      });
    }
    return res.json({
      data: parties,
    });
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

exports.generatePartyId = async (req, res) => {
  try {
    const party = await Party.find();
    const id = generateId(party);
    return res.json({
      id: id,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.addParty = async (req, res) => {
  try {
    const {
      client,
      logistic,
      departureDate,
      transportNumber,
      comment,
      invoice,
      invoiceDate,
      status,
      products,
    } = req.body;
    const newParty = new Party({
      client,
      logistic,
      departureDate,
      transportNumber,
      comment,
      invoice,
      invoiceDate,
      status,
      user: req.headers.userId,
    });
    await newParty.save();
    const productIds = [];
    for (let productData of products) {
      const newProduct = new Products({
        ...productData,
        parties: newParty._id,
      });
      await newProduct.save();
      productIds.push(newProduct._id);
    }
    newParty.products = productIds;
    await newParty.save();
    const findUser = await Users.findById(req.headers.userId);
    const users = await Users.find({ bot: true, deleted: false, active: true });
    users.forEach((user) => {
      const messageText = `Yangi partiya qo'shildi.\n id: ${newParty.id}\n user: ${findUser.name} ${findUser.lastName}`;
      if (user.chatId) {
        bot.sendMessage(parseInt(user.chatId), messageText);
      }
    });
    return res.json({
      data: newParty,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const findParty = await Party.findById(id);
    if (!findParty) {
      return res.status(404).json({
        status: 404,
        message: "Party Not Found",
      });
    }
    findParty.status = req.body.status;
    await findParty.save();
    return res.json({
      message: "Party status updated successfully",
      data: findParty,
    });
  } catch (err) {
    return res.json({
      message: "Internal Server Error",
    });
  }
};