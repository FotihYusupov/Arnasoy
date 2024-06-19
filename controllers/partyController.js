// Import necessary models and utilities
const Party = require("../models/Party");
const Users = require("../models/User");
const Products = require("../models/Products");
const Clients = require("../models/Client");
const ProductCategories = require("../models/productCategory");
const generateId = require("../utils/generateId");
const bot = require("../bot");
const pagination = require("../utils/pagination");

exports.get = async (req, res) => {
  try {
    if(!req.query.filter) {
      req.query.filter = {}
    }
    req.query.filter.deleted = false;
    const data = await pagination(
      Party,
      req.query,
      "parties",
      "products",
      "client",
      "warehouse",
      "logistic",
      "user"
    );

    for (product of data.data) {
      let total = 0
      for (productData of product.products) {
        await productData.populate("unit");
        total += (productData.amount * productData.price);
        productData._doc.productData = {
          name: productData.name,
          price: productData.price,
          saledPrice: productData.saledPrice,
          unit: productData.unit,
          _id: productData._id,
        };
        product._doc.total = total
      }
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json(err);
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
    let newParty = new Party({
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
      totalSum: parseInt(total),
      user: req.headers.userId,
    });

    // Save the new party
    await newParty.save();

    // Update client's indebtedness
    const findClient = await Clients.findById(client);
    findClient.indebtedness += total;
    await findClient.save();
    // Add products to the party
    const productIds = [];
    for (let productData of products) {
      const lastItem = await Products.find();
      let findProductData = await ProductCategories.findById(
        productData.productId
      );
      if (!findProductData) {
        return res.status(404).json({
          message: "Product category not found!",
        });
      }
      Object.assign(findProductData, productData);
      delete findProductData._doc._id;
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
    newParty = await newParty.populate("products");
    // Notify users about the new party
    const findUser = await Users.findById(req.headers.userId);
    const users = await Users.find({ bot: true, deleted: false, active: true });

    users.forEach((user) => {
      const messageText = `Yangi partiya qo'shildi.\n id: ${newParty.id}\n user: ${findUser.name} ${findUser.lastName}`;
      if (user.chatId) {
        bot.sendMessage(parseInt(user.chatId), messageText).catch((err) => {});
      }
    });

    // Send response with added party data
    return res.json({
      data: newParty,
    });
  } catch (err) {
    // Handle errors
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.updateParty = async (req, res) => {
  try {
    const findParty = await Party.findById(req.params.id);
    if (!findParty) {
      return res.status(404).json({
        message: "Party Not Found!",
      });
    }
    if (req.body.products) {
      for (product of req.body.products) {
        product.price = parseInt(product.price);
        product.amount = parseInt(product.amount);
        const find = await Products.findById(product.id);
        delete product.id;

        if (!find) {
          return res.status(404).json({
            message: "Product not found",
          });
        }

        if (product.productId) {
          const findCategory = await ProductCategories.findById(
            product.productId
          );
          if (!findCategory) {
            return res.status(404).json({
              message: "Product category not found",
            });
          }

          find.name = findCategory.name;
        }
        Object.assign(find, product);
        await find.save();
      }
    }
    delete req.body.products;
    Object.assign(findParty, req.body);
    await findParty.save();
    return res.json({
      data: findParty,
    });
  } catch (err) {
    return res.status(400).json(err);
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

exports.updateWarehouse = async (req, res) => {
  try {
    const { warehouse } = req.body;

    const findParty = await Party.findById(req.params.id).populate("products");
    if (!findParty) {
      return res.status(404).json({
        message: "Party Not Found!",
      });
    }

    findParty.warehouse = warehouse;

    for (let product of findParty.products) {
      product.warehouse = warehouse;
      await product.save();
    }

    await findParty.save();

    return res.json({
      data: findParty,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.deleteParty = async (req, res) => {
  try {
    const findParty = await Party.findById(req.params.id);
    if (!findParty) {
      return res.status(404).json({
        message: "Party Not Found",
      });
    }
    const findClient = await Clients.findById(findParty.client);
    if (!findClient) {
      return res.status(404).json({
        message: "Client NOt Found!",
      });
    }
    findClient.indebtedness -= findParty.totalSum;
    await findClient.save();
  } catch (err) {
    return res.status(400).json(err);
  }
};
