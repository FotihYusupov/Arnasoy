const BalanceHistory = require("../models/BalanceHistory");
const Clients = require("../models/Client");
const Dept = require("../models/Debt");
const Users = require("../models/User");
const { pagination } = require("../utils");

exports.getBalanceAndDept = async (req, res) => {
  try {
    const clients = await Clients.find({ deleted: false });
    const totalIndebtedness = clients.reduce((sum, client) => sum + client.indebtedness, 0 );
    const totalClientBalance = clients.reduce((sum, client) => sum + client.balance, 0 );
    const totalClintDept = (await Dept.find({ deleted: false, paid: false })).reduce((sum, dept) => sum + dept.sum, 0);
    const users = await Users.find({ deleted: false, active: true });
    const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
    const totalCardBalance = users.reduce((sum, user) => sum + user.cardBalance, 0);
    const totalCashBalance = users.reduce((sum, user) => sum + user.cashBalance, 0);
    
    return res.json({
      indebtedness: totalIndebtedness,
      totalClientDept: (totalClientBalance - totalClintDept),
      totalBalance: totalBalance,
      totalCardBalance: totalCardBalance,
      totalCashBalance: totalCashBalance,
      total: (totalBalance + totalCardBalance + totalCashBalance)
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

exports.getAll = async (req, res) => {
  try {
    const data = await pagination(BalanceHistory, req.query, 'balance', 'user');
    return res.json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
}
