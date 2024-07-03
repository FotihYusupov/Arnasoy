const Clients = require("../models/Client");
const Currency = require("../models/Currency");
const bot = require("../bot");

const sendMessageToClient = async (clientId, message) => {
  const findClient = await Clients.findById(clientId);
  const today = new Date();
  
  const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

  const findCurrency = await Currency.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });

  if (findClient._doc.chatId) {
    await bot.sendMessage(parseInt(findClient._doc.chatId), `${message}\n\nValyuta\nBank: ${findCurrency.cb} So'm,\nBizning hisob bo'yicha: ${findCurrency.current} So'm`);
  }
};

module.exports = sendMessageToClient;
