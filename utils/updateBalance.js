const Users = require("../models/User");
const balanceHistory = require("./balanceHistory");

module.exports = {
  updateBalance: async (userId, balanceType, amount, comment) => {
    try {
      comment = comment ? comment : "";
      balanceType = parseInt(balanceType);
      amount = parseInt(amount);

      const findUser = await Users.findById(userId);
      if (!findUser) {
        throw new Error("User Not Found");
      }

      switch (balanceType) {
        case 1:
          let total = users.reduce((sum, user) => sum + user.cashBalance, 0)
          if (total < amount) {
            throw new Error(
              "There are insufficient funds in the user's balance"
            );
          }
          if(findUser.cashBalance <= total) {
            findUser.cashBalance = 0
            total = (total - findUser.cashBalance)
            const users = await Users.find()
            for(user of users) {
              if(total = 0) break;
              if(user.cashBalance <= total) {
                total = (total - user.cashBalance)
                user.cashBalance = 0
                await user.save()
              } else if (user.cashBalance > total) {
                user.cardBalance = (user.cashBalance - total)
                await user.save()
              }
            }
          } else {
            findUser.cashBalance -= amount;
          }
          break;
        case 2:
          if (findUser.cardBalance < amount) {
            throw new Error(
              "There are insufficient funds in the user's balance"
            );
          }
          findUser.cardBalance -= amount;
          break;
        case 3:
          if (findUser.balance < amount) {
            throw new Error(
              "There are insufficient funds in the user's balance"
            );
          }
          findUser.balance -= amount;
          break;
        default:
          throw new Error("Invalid balance type");
      }
      await balanceHistory(userId, amount, balanceType, comment, 1).catch(
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

      balanceHistory(userId, amount, balanceType, comment, 2);

      await user.save();
      return "Balance added successfully";
    } catch (err) {
      throw new Error(err);
    }
  },
};
