const BalanceHistory = require("../models/BalanceHistory");

exports.getById = async (req, res) => {
  try {
    const { startDate, endDate, user } = req.query;
    const query = { client: req.params.id };

    if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      query.createdAt = { ...query.createdAt, $lte: end };
    }
    if (user) {
      query.user = user;
    }

    const history = await BalanceHistory.find(query).populate('user');
    return res.json(history);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
