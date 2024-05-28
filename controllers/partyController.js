// Import necessary models and utilities
const Party = require("../models/Party");
const Users = require("../models/User");
const Products = require("../models/Products");
const Clients = require("../models/Client")
const ProductCategories = require("../models/productCategory");
const generateId = require("../utils/generateId");
const bot = require("../bot");

// Controller function to get all parties
exports.getAll = async (req, res) => {
  try {
    // Extract 'includes' query parameter
    const includes = req.query.includes;
    let parties;
    // Count total documents in Party model
    const total = await Party.countDocuments();

    // If 'includes' query parameter is provided
    if (includes) {
      const fields = includes.split(",");
      // Retrieve parties with specified fields populated
      parties = await Party.find({ deleted: false, saled: false, warehouse: req.params.id }).populate({
        path: "products",
        match: { saled: false },
      })
      .populate("clients")
      .skip((req.query.page - 1) * req.query.perPage)
      .limit(req.query.perPage);

      // Filter parties based on specified fields
      parties = parties.map((party) => {
        const filteredParty = {};
        fields.forEach((field) => {
          filteredParty[field] = party[field];
        });
        return filteredParty;
      });
    } else {
      // Retrieve parties without populating any fields
      parties = await Party.find({ deleted: false, saled: false, warehouse: req.params.id }).populate({
        path: "products",
        match: { saled: false },
      })
      .populate("client")
      .skip((req.query.page - 1) * req.query.perPage)
      .limit(req.query.perPage);
    }

    // Send response with parties data and metadata
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
    // Handle errors
    return res.status(500).json({ error: "Internal server error", err: err });
  }
};

// Controller function to generate a unique party ID
exports.generatePartyId = async (req, res) => {
  try {
    // Find all parties
    const party = await Party.find();
    // Generate a unique ID
    const id = generateId(party);
    // Send response with the generated ID
    return res.json({
      id: id,
    });
  } catch (err) {
    // Handle errors
    return res.json(err);
  }
};

// Controller function to add a new party
exports.addParty = async (req, res) => {
  try {
    // Extract request body data
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

    // Create a new Party instance
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

    // Save the new party
    await newParty.save();

    // Update client's indebtedness
    const findClient = await Clients.findById(client)
    findClient.indebtedness += total
    await findClient.save()

    // Add products to the party
    const productIds = [];
    for (let productData of products) {
      const lastItem = await Products.find();
      let findProductData = await ProductCategories.findById(productData.id)
      Object.assign(findProductData, productData);
      const newProduct = new Products({
        id: parseInt(generateId(lastItem)),
        ...findProductData._doc,
        amount: productData.amount,
        warehouse: warehouse,
        dept: req.body.dept,
        parties: newParty._id,
      });
      await newProduct.save();
      productIds.push(newProduct._id);
    }

    // Update party's products
    newParty.products = productIds;
    await newParty.save();

    // Notify users about the new party
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

    // Send response with added party data
    return res.json({
      data: newParty,
    });
  } catch (err) {
    // Handle errors
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to update party status
exports.updateStatus = async (req, res) => {
  try {
    // Extract party ID from request parameters
    const { id } = req.params;
    // Find party by ID
    const findParty = await Party.findById(id);
    // If party doesn't exist, return 404 error
    if (!findParty) {
      return res.status(404).json({
        status: 404,
        message: "Party Not Found",
      });
    }
    // Update party status
    findParty.status = req.body.status;
    await findParty.save();
    // Send response with updated party data
    return res.json({
      message: "Party status updated successfully",
      data: findParty,
    });
  } catch (err) {
    // Handle errors
    return res.json({
      message: "Internal Server Error",
    });
  }
};
