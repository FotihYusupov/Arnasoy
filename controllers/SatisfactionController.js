const Satisfaction = require("../models/Satisfaction");
const Expenses = require("../models/Expenses");
const Party = require("../models/Party");
const Products = require("../models/Products");
const generateId = require("../utils/generateId");
const paginate = require("../utils/pagination");
const { addBalance, updateBalance } = require("../utils/updateBalance")

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
      "type",
      "user"
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addSatisfaction = async (req, res) => {
  req.body.price = parseInt(req.body.price)
  console.log(req.body);
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
      req.body.price / allProductsAmount;

    for (const product of findParty.products) {
      product.price += priceIncreasePerProduct;
      await product.save();
    }

    const satisfactions = await Satisfaction.find();
    const newSatisfaction = await Satisfaction.create({
      id: generateId(satisfactions),
      type: req.body.type,
      expComment: req.body.comment,
      price: req.body.price,
      parties: req.params.id,
      user: req.headers.userId,
    });

    await updateBalance(req.headers.userId, req.body.balanceType, req.body.price, "Partiya uchun Dop Rasxod");
    return res.status(201).json({
      data: newSatisfaction,
    });
  } catch (err) {
    console.log(err);
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
    findProduct.sum += parseInt(req.body.sum) / findProduct.amount;
    await findProduct.save();

    const satisfactions = await Satisfaction.find();
    const newSatisfaction = await Satisfaction.create({
      id: generateId(satisfactions),
      type: req.body.type,
      expComment: req.body.expComment,
      sum: req.body.sum,
      parties: findProduct.parties,
      user: req.headers.userId,
    });

    await updateBalance(req.headers.userId, req.body.balanceType, req.body.price, "Product uchun Dop Rasxod");

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
      expComment: req.body.expComment ? req.body.expComment : "",
      sum: req.body.sum,
      user: req.headers.userId,
    });
    await newExpense.save();

    await updateBalance(req.headers.userId, req.body.balanceType, req.body.price, "Oylik rasxod");

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

    if(findSatisfaction.sum < req.body.sum) {
      await updateBalance(req.headers.userId, req.body.balanceType, (req.body.sum - findSatisfaction.sum, "Partiya dop rasxod o'zgartirildi"));
    } else {
      await addBalance(req.headers.userId, req.body.balanceType, (findSatisfaction.sum - req.body.sum, "Partiya dop rasxod o'zgartirildi"));
    }

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

    if(findExpense.sum < req.body.sum) {
      await updateBalance(req.headers.userId, req.body.balanceType, (req.body.sum - findExpense.sum, "Oylik rasxod o'zgartirildi"));
    } else {
      await addBalance(req.headers.userId, req.body.balanceType, (findExpense.sum - req.body.sum, "Oylik rasxod o'zgartirildi"));
    }

    return res.json({
      data: findExpense,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
}

exports.deleteExpense = async (req, res) => {
  try {
    const findExpense = await Expenses.findByIdAndDelete(req.params.id);
    if(!findExpense) {
      return res.status(404).json({
        message: "Expense Not Found!"
      });
    }
    await addBalance(req.headers.userId, req.body.balanceType, findExpense.sum, "Oylik rasxod bekor qilindi");
    return res.json({
      message: "Expense deleted!",
    });
  } catch (err) {
    return res.status(400).json(err);
  };
};
