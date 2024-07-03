const Users = require("../models/User");
const bot  = require("../bot");

const sendMessage  = async (message, userId) => {
  const users = await Users.find({ deleted: false, bot: true });
  const findUser = await Users.findById(userId);

  users.forEach(user => {
    if(user.chatId) {
      bot.sendMessage(parseInt(user.chatId), `${message}\n User: ${findUser.name} ${findUser.lastName}`);
    }
  });
}

module.exports = sendMessage;