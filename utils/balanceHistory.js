const Users = require("../models/User");
const BalanceHistory = require("../models/BalanceHistory");
const Currency = require("../models/Currency");

module.exports = async (userId, amount, type, comment) => {
  try {
    const findUser = await Users.findById(userId);
    if (!findUser) {
      throw new Error("User Not Found!");
    }
    const currentCurrency = await Currency.find({ date: new Date() });

    const newHistory = new BalanceHistory({
      user: findUser._id,
      amount: amount,
      comment: comment,
      type: type,
      currency: currentCurrency.length > 0 ? currentCurrency[0].current : "",
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
    throw new Error(err);
  }
};
