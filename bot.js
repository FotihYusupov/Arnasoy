const TelegramBot = require("node-telegram-bot-api");
const Users = require("./models/User");
const Clients = require("./models/Client")

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const findUser = await Users.findOne({ username: username, bot: true });
  const findClient = await Clients.findOne({ username: username, bot: true });

  if(findUser) {
    findUser.chatId = chatId;
    await findUser.save();
    bot.sendMessage(chatId, `Salom ${findUser.name} botga xush kelibsiz 👋`);
  } else if (findClient) {
    findClient.chatId = chatId;
    await findClient.save();
    bot.sendMessage(chatId, `Salom ${findClient.name} botga xush kelibsiz 👋`);
  } else {
    bot.sendMessage(
      chatId,
      "Kechirasiz sizda botdan foydalanish uchun ruxsat yoq!"
    );
    return;
  }
});

module.exports = bot;
