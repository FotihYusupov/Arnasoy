const Users = require("../models/User");
const balanceHistory = require("./balanceHistory");

module.exports = {
  updateBalance: async (userId, balanceType, amount, comment) => {
    try {
      comment = comment ? comment : "";
      balanceType = parseInt(balanceType);
      amount = parseInt(amount);

      const user = await Users.findById(userId);
      if (!user) {
        throw new Error("User Not Found");
      }

      switch (balanceType) {
        case 1:
          if (user.cashBalance < amount) {
            throw new Error(
              "There are insufficient funds in the user's balance"
            );
          }
          user.cashBalance -= amount;
          break;
        case 2:
          if (user.cardBalance < amount) {
            throw new Error(
              "There are insufficient funds in the user's balance"
            );
          }
          user.cardBalance -= amount;
          break;
        case 3:
          if (user.balance < amount) {
            throw new Error(
              "There are insufficient funds in the user's balance"
            );
          }
          user.balance -= amount;
          break;
        default:
          throw new Error("Invalid balance type");
      }
      await balanceHistory(userId, amount, balanceType, comment).catch(
        (err) => {
          throw new Error(err);
        }
      );

      await user.save();
      return "Balance updated successfully";
    } catch (err) {
      throw new Error(err);
    }
  },
  addBalance: async (userId, balanceType, amount, comment) => {
    try {
      comment = comment ? comment : "";
      balanceType = parseInt(balanceType);
      amount = parseInt(amount);

      const user = await Users.findById(userId);
      if (!user) {
        throw new Error("User Not Found");
      }

      switch (balanceType) {
        case 1:
          user.cashBalance += amount;
          break;
        case 2:
          user.cardBalance += amount;
          break;
        case 3:
          user.balance += amount;
          break;
        default:
          throw new Error("Invalid balance type");
      }

      balanceHistory(userId, amount, balanceType, comment);

      await user.save();
      return "Balance added successfully";
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};
