const Satisfaction = require("../models/Satisfaction");
const Party = require("../models/Party");
const Products = require("../models/Products");
const generateId = require("../utils/generateId");

exports.getAll = async (req, res) => {
  try {
    const satisfactions = await Satisfaction.find({ deleted: false });
    return res.status(200).json({
      data: satisfactions,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addSatisfaction = async (req, res) => {
  try {
    const findParty = await Party.findById(req.body.partyId).populate("products");
    if (!findParty) {
      return res.status(404).json({ error: "Party not found" });
    }

    let allProductsAmount = 0;
    for (const product of findParty.products) {
      allProductsAmount += product.amount;
    }

    if (allProductsAmount === 0) {
      return res.status(400).json({ error: "Total product amount is zero" });
    }

    const priceIncreasePerProduct = req.body.price / allProductsAmount;

    for (const product of findParty.products) {
      product.price += priceIncreasePerProduct;
      await product.save();
    }

    const satisfactions = await Satisfaction.find();
    const newSatisfaction = await Satisfaction.create({
      id: generateId(satisfactions),
      type: req.body.type,
      comment: req.body.comment,
      price: req.body.price,
      parties: req.body.partyId,
    });

    return res.status(201).json({
      data: newSatisfaction,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addSatisfactionProduct = async (req, res) => {
  try {
    const findProduct = await Products.findById(req.params.id);
    if(!findProduct) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    };
    findProduct.price += (req.body.sum / findProduct.amount);
    await findProduct.save();

    const satisfactions = await Satisfaction.find();
    const newSatisfaction = await Satisfaction.create({
      id: generateId(satisfactions),
      type: req.body.type,
      comment: req.body.comment,
      price: req.body.price,
      parties: findProduct.parties,
    });

    return res.json({
      message: newSatisfaction,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};
