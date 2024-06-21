const Dept = require("../models/Debt");
const DeptHistory = require("../models/DeptHistory");
const paginate = require("../utils/pagination");
const { login } = require("./userController");

exports.getById = async (req, res) => {
  try {
    // Mijozga tegishli, o'chirilmagan va to'lanmagan qarzlarni topish
    const dept = await Dept.find({
      clients: req.params.id,
      deleted: false,
      paid: false,
    }).populate("saleds");

    // Qarzlarni json formatida qaytarish
    return res.json({
      data: dept,
    });
  } catch (err) {
    // Xatolik yuz berganda xatolikni json formatida qaytarish
    return res.json(err);
  }
};

exports.getHistory = async (req, res) => {
  try {
    if (!req.query.filter) req.query.filter = {};
    // req.query.filter.client = req.params.id;
    const data = await paginate(
      DeptHistory,
      req.query,
      "depts",
      "client",
      "user"
    );
    return res.json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
};
