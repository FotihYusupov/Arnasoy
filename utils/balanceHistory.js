const Users = require("../models/User");
const BalanceHistory = require("../models/BalanceHistory");
const Currency = require("../models/Currency");

module.exports = async (userId, amount, type, comment, historyType, from, fromModel, to, toModel) => {
  try {
    const findUser = await Users.findById(userId);
    if (!findUser) {
      throw new Error("User Not Found!");
    }

    const today = new Date()
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

    const currentCurrency = await Currency.findOne({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    const newHistory = new BalanceHistory({
      user: findUser._id,
      amount: amount,
      comment: comment,
      type: type,
      currency: currentCurrency ? currentCurrency.current : "",
      historyType: historyType,
      from,
      fromModel,
      to,
      toModel
    });
    switch (type) {
      case 1:
        newHistory.current = findUser.cashBalance;
        newHistory.next = findUser.cashBalance - amount;
        await newHistory.save();
        break;
      case 2:
        newHistory.current = findUser.cardBalance;
        newHistory.next = findUser.cardBalance - amount;
        await newHistory.save();
        break;
      case 3:
        newHistory.current = findUser.balance;
        newHistory.next = findUser.balance - amount;
        await newHistory.save();
        break;
      default:
        throw new Error("Invalid balance type");
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
