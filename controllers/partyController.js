const Party = require("../models/Party");
const Users = require("../models/User");
const Products = require("../models/Products");
const Clients = require("../models/Client")
const generateId = require("../utils/generateId");
const bot = require("../bot");

exports.getAll = async (req, res) => {
  try {
    const includes = req.query.includes;
    let parties;
    const total = await Party.countDocuments();

    if (includes) {
      const fields = includes.split(",");
      parties = await Party.find({ deleted: false, saled: false, warehouse: req.params.id }).populate({
        path: "products",
        match: { saled: false },
      })
      .populate("clients")
      .skip((req.query.page - 1) * req.query.perPage)
      .limit(req.query.perPage);

      parties = parties.map((party) => {
        const filteredParty = {};
        fields.forEach((field) => {
          filteredParty[field] = party[field];
        });
        return filteredParty;
      });
    } else {
      parties = await Party.find({ deleted: false, saled: false, warehouse: req.params.id }).populate({
        path: "products",
        match: { saled: false },
      })
      .populate("client")
      .skip((req.query.page - 1) * req.query.perPage)
      .limit(req.query.perPage);
    }

    return res.json({
      data: parties,
      _meta: {
        currentPage: +req.query.page,
        perPage: +req.query.perPage,
        totalCount: total,
        pageCount: Math.ceil(total / req.query.perPage),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", err: err });
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
      id,
      client,
      logistic,
      departureDate,
      transportNumber,
      comment,
      invoice,
      invoiceDate,
      status,
      warehouse,
      products,
      total,
    } = req.body;

    const newParty = new Party({
      id,
      client,
      logistic,
      departureDate,
      transportNumber,
      comment,
      invoice,
      invoiceDate,
      status,
      warehouse,
      totalSum: total,
      user: req.headers.userId,
    });

    await newParty.save();

    const findClient = await Clients.findById(client)
    findClient.indebtedness += total
    await findClient.save()

    const productIds = [];
    for (let productData of products) {
      const lastItem = await Products.find();
      const newProduct = new Products({
        id: parseInt(generateId(lastItem)),
        ...productData,
        warehouse: warehouse,
        dept: req.body.dept,
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
        bot.sendMessage(parseInt(user.chatId), messageText).catch(err => {
          console.log(err)
        });
      }
    });

    return res.json({
      data: newParty,
    });
  } catch (err) {
    console.log(err)
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
