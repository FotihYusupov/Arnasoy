const SaledProducts = require("../models/saledProducts");
const paginate = require("../utils/pagination");

exports.getAll = async (req, res) => {
  try {
    const data = await paginate(
      SaledProducts,
      req.query,
      "saleds",
      "client",
      "user",
      "warehouse"
    );
    return res.json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
};
