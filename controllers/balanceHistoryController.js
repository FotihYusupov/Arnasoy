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

// exports.getById = async (req, res) => {
//   try {
//     const { startDate, endDate, user } = req.query;
//     const query = { user: req.params.id };

//     if (startDate) {
//       query.createdAt = { $gte: new Date(startDate) };
//     }
//     if (endDate) {
//       const end = new Date(endDate);
//       end.setDate(end.getDate() + 1);
//       query.createdAt = { ...query.createdAt, $lte: end };
//     }
//     if (user) {
//       query.user = user;
//     }

//     const history = await BalanceHistory.find(query).populate('user');
//     return res.json(history);
//   } catch (err) {
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
