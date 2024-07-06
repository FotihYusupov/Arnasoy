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

function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const year = yesterday.getFullYear();
  const month = (yesterday.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
  const day = yesterday.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

exports.getByDate = async (req, res) => {
  try {
    const lastDate = getLastWeek()[0];
    const currentDate = getCurrentDate();
    const lastDateCurrency = await Currency.findOne({ date: lastDate });
    if (lastDateCurrency) {
      await Currency.deleteOne({ date: lastDate });
    }
    let currency = await Currency.findOne({ date: currentDate });
    if (!currency) {
      const cbResponse = await axios.get(
        "https://cbu.uz/uz/arkhiv-kursov-valyut/json/"
      );
      const cbData = cbResponse.data;
      const lastCurrentCurrency = await Currency.findOne({ date: getYesterdayDate() })
      currency = new Currency({
        cb: cbData[0].Rate,
        current: lastCurrentCurrency ? lastCurrentCurrency.current : cbData[0].Rate,
        date: currentDate,
      });
      await currency.save();
    }

    return res.json({ data: currency });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const currencies = await Currency.find();
    return res.json({ data: currencies });
  } catch (err) {
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
