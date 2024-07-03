const BalanceHistory = require("../models/BalanceHistory");
const { pagination } = require("../utils");

exports.getAll = async (req, res) => {
  try {
    const data = await pagination(BalanceHistory, req.query, 'balance', 'user');
    return res.json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
}
