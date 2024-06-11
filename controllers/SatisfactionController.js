const Satisfaction = require("../models/Satisfaction");
const Expenses = require("../models/Expenses");
const Party = require("../models/Party");
const Products = require("../models/Products");
const generateId = require("../utils/generateId");
const paginate = require("../utils/pagination");

exports.getExpenses = async (req, res) => {
  try {
    req.query.filter ? "" : (req.query.filter = {});
    req.query.filter.deleted = false;
    const data = await paginate(Expenses, req.query, "satisfactions", "type", 'user');
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    req.query.filter ? "" : (req.query.filter = {});
    req.query.filter.deleted = false;
    const data = await paginate(
      Satisfaction,
      req.query,
      "satisfactions",
      "type"
    );
    return res.status(200).json({
      data: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addSatisfaction = async (req, res) => {
  try {
    const findParty = await Party.findById(req.params.id).populate("products");
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

    const priceIncreasePerProduct =
      parseInt(req.body.price) / allProductsAmount;

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
      parties: req.params.id,
      user: req.headers.userId,
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
    if (!findProduct) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }
    findProduct.price += parseInt(req.body.price) / findProduct.amount;
    await findProduct.save();

    const satisfactions = await Satisfaction.find();
    const newSatisfaction = await Satisfaction.create({
      id: generateId(satisfactions),
      type: req.body.type,
      comment: req.body.comment,
      price: req.body.price,
      parties: findProduct.parties,
      user: req.headers.userId,
    });

    return res.json({
      message: newSatisfaction,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.expenses = async (req, res) => {
  try {
    const expenses = await Expenses.find();
    const newExpense = new Expenses({
      id: generateId(expenses),
      type: req.body.type,
      comment: req.body.comment ? req.body.comment : "",
      price: req.body.price,
      user: req.headers.userId,
    });
    await newExpense.save();
    return res.json({
      data: newExpense,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.updateSatisfaction = async (req, res) => {
  try {
    const findSatisfaction = await Satisfaction.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if(!findSatisfaction) {
      return res.status(404).json({
        message: "Not Found!"
      });
    };
    return res.json({
      data: findSatisfaction,
    });
  } catch (err) {
    return res.status(400).json(err);
  };
};

exports.updateExpenses = async (req, res) => {
  try {
    const findExpense = await Expenses.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if(!findExpense) {
      return res.status(404).json({
        message: "Not Found!"
      });
    };
    return res.json({
      data: findExpense,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
}
