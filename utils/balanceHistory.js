const Users = require("../models/BalanceHistory");
const BalanceHistory = require("../models/BalanceHistory");
const Currency = require("../models/Currency");

module.exports = async (userId, amount, type, comment) => {
  const findUser = await Users.findById(userId);
  if (!findUser) {
    return "User Not Found!";
  }

  const currentCurrency = await Currency.find({ date: new Date() });

  const newHistory = new BalanceHistory({
    user: findUser._id,
    amount: amount,
    comment: comment,
    type: type,
    currency: currentCurrency.length > 0 ? currentCurrency[0].current : ""
  });

  switch (type) {
    case 1:
      newHistory.current = findUser.cashBalance;
      newHistory.next = (findUser.cashBalance - amount);
      break;
    case 2:
      newHistory.current = findUser.cardBalance;
      newHistory.next = (findUser.cardBalance - amount);

      break;
    case 3:
      newHistory.cardBalance = findUser.balance;
      newHistory.next = (findUser.balance - amount);
      break;
    default:
      return "Invalid balance type";
  };
};
