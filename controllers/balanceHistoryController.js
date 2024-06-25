const BalanceHistory = require("../models/BalanceHistory");
const paginate = require("../utils/pagination");

exports.getAll = async (req, res) => {
  try {
    const data = await paginate(BalanceHistory, req.query, 'balance', 'user');
    return res.json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
}
