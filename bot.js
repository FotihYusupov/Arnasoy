const TelegramBot = require("node-telegram-bot-api");
const Users = require("./models/User");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const findUser = await Users.findOne({ username: username });
  if (!findUser) {
    bot.sendMessage(
      chatId,
      "Kechirasiz sizda botdan foydalanish uchun ruxsat yoq!"
    );
    return;
  }
  findUser.chatId = chatId;
  await findUser.save();
  bot.sendMessage(chatId, `Salom ${findUser.name} botga xush kelibsiz 👋`);
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  let word = data.split(" ");
  word.pop();
  word = word.join(" ");
  switch (word) {
    case "Tasdiqlash":
      bot.editMessageText(query.message.text, {
        chat_id: chatId,
        message_id: query.message.message_id,
      });
      bot.sendMessage(chatId, "Tasdiqlash");
      break;
    case "Bekor Qilish":
      bot.editMessageText(query.message.text, {
        chat_id: chatId,
        message_id: query.message.message_id,
      });
      bot.sendMessage(chatId, "Bekor Qilish ");
      break;
    default:
      bot.sendMessage(
        chatId,
        "Kechirasiz serverda qandaydir xatolik yuz berdi!"
      );
  }
});

module.exports = bot;
