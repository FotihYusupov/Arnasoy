const TransferHistory = require("../models/TransferHistory");
const paginate = require("../utils/pagination");

exports.getTransferHistory = async (req, res) => {
  try {
    const data = await paginate(
      TransferHistory,
      req.query,
      "transfer-history",
      "oldWarehouse",
      "newWarehouse",
      "oldParty",
      "newParty",
      "user"
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
