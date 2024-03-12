const axios = require("axios");
const Currency = require("../models/Currency");
const getLastWeek = require("../utils/getLastWeek");

function getCurrentDate() {
  const now = new Date();
  const day = ("0" + now.getDate()).slice(-2);
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const year = now.getFullYear();

  return `${year}-${month}-${day}`;
}

exports.getByDate = async (req, res) => {
  try {
    const lastDate = getLastWeek()[0];
    const cbResponse = await axios.get(
      "https://cbu.uz/uz/arkhiv-kursov-valyut/json/"
    );
    const cbData = cbResponse.data;
    const currentDate = getCurrentDate();
    const lastDateCurrency = await Currency.findOne({ date: lastDate });
    if (lastDateCurrency) {
      await Currency.deleteOne({ date: lastDate });
    }
    let currency = await Currency.findOne({ date: currentDate });
    if (!currency) {
      currency = new Currency({
        cb: cbData[0].Rate,
        current: cbData[0].Rate,
        date: currentDate,
      });
      await currency.save();
    }

    return res.json({ data: currency });
  } catch (err) {
    console.error("Error getting currency by date:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const currencies = await Currency.find();
    return res.json({ data: currencies });
  } catch (err) {
    console.error("Error getting all currencies:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCurrency = async (req, res) => {
  try {
    const updatedCurrency = await Currency.findByIdAndUpdate(
      req.body.id,
      {
        current: req.body.current,
      },
      { new: true }
    );
    return res.json({
      data: updatedCurrency,
    });
  } catch (err) {
    return res.json(err);
  }
};
