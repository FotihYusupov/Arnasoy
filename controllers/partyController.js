const Party = require("../models/Party");
const Users = require("../models/User");
const Products = require("../models/Products");
const generateId = require("../utils/generateId");
const bot = require("../bot");

exports.getAll = async (req, res) => {
  try {
    const includes = req.query.includes;
    let parties;

    // Check if includes parameter is provided
    if (includes) {
      const fields = includes.split(",");
      parties = await Party.find({ deleted: false, saled: false }).populate({
        path: "products",
        match: { saled: false } // Populate only products where saled is false
      });
      
      // Map parties to filter fields
      parties = parties.map((party) => {
        const filteredParty = {};
        fields.forEach((field) => {
          filteredParty[field] = party[field];
        });
        return filteredParty;
      });
    } else {
      // If no includes parameter, populate all products
      parties = await Party.find({ deleted: false, saled: false }).populate("products");
    }

    return res.json({
      data: parties,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.getAll = async (req, res) => {
  try {
    const includes = req.query.includes;
    let parties;

    // Check if includes parameter is provided
    if (includes) {
      const fields = includes.split(",");
      parties = await Party.find({ deleted: false, saled: false }).populate({
        path: "products",
        match: { saled: false } // Populate only products where saled is false
      });
      
      // Map parties to filter fields
      parties = parties.map((party) => {
        const filteredParty = {};
        fields.forEach((field) => {
          filteredParty[field] = party[field];
        });
        return filteredParty;
      });
    } else {
      // If no includes parameter, populate all products
      parties = await Party.find({ deleted: false, saled: false }).populate("products");
    }

    return res.json({
      data: parties,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
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
}; require("../bot");

exports.getAll = async (req, res) => {
  try {
    const includes = req.query.includes;
    let parties = await Party.find({ deleted: false, saled: false }).populate("products");
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
      id,
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
    // Creating a new Party instance
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
      user: req.headers.userId, // Assuming userId is available in headers
    });
    // Saving the new party to the database
    await newParty.save();

    // Storing IDs of the products associated with the new party
    const productIds = [];
    for (let productData of products) {
      const newProduct = new Products({
        ...productData,
        parties: newParty._id, // Associating the product with the new party
      });
      await newProduct.save();
      productIds.push(newProduct._id); // Storing the ID of the saved product
    }

    // Assigning the product IDs to the new party
    newParty.products = productIds;

    // Saving the new party again with the updated product IDs
    await newParty.save();

    // Not sure why this line is here, it's trying to access findUser before it's defined
    // console.log(findUser);

    // Finding the user who created the party (assuming it's available in headers)
    const findUser = await Users.findById(req.headers.userId);

    // Finding all bot users (assuming this is defined in the Users model)
    const users = await Users.find({ bot: true, deleted: false, active: true });

    // Sending a message to all bot users about the new party
    users.forEach((user) => {
      const messageText = `Yangi partiya qo'shildi.\n id: ${newParty.id}\n user: ${findUser.name} ${findUser.lastName}`;
      if (user.chatId) {
        bot.sendMessage(parseInt(user.chatId), messageText);
      }
    });

    // Returning the newly created party in the response
    return res.json({
      data: newParty,
    });
  } catch (err) {
    console.log(err, 'cdcdscdcds');
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
