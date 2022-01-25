// Enabling of cancellation of promises manually.
process.env.NTBA_FIX_319 = "1";

import TelegramBot from 'node-telegram-bot-api';
import { runRust } from './rust';

let token = process.env.KKSHINKAI_BOT_TOKEN;
if (token === undefined) {
  console.log("Environment variable `KKSHINKAI_BOT_TOKEN` is not defined");
  process.exit(1);
} else {
  console.log("Found token `KKSHINKAI_BOT_TOKEN`: " + token);
}

let bot = new TelegramBot(token, {
  polling: true,
  onlyFirstMatch: true,
});

bot.on('group_chat_created', msg => {
  let chatId = msg.chat.id;

  bot.sendMessage(chatId, "Hello everyone, I'm Kk Shinkai's bot.");
});

bot.onText(/\/echo( |\n)([\s\S]*)/, (msg, match) => {
  let chatId = msg.chat.id;
  let response = match[2];

  bot.sendMessage(chatId, response);
});

bot.onText(/\/rust( |\n)([\s\S]*)/, (msg, match) => {
  let chatId = msg.chat.id;
  console.log(match[2]);
  runRust(match[2], output => {
    bot.sendMessage(chatId, `<pre>${output}</pre>`, { parse_mode: 'HTML' });
  });
});

// bot.onText(/(.+)/, (msg, _) => {
//   let chatId = msg.chat.id;

//   bot.sendMessage(chatId, "Sorry, I didn't quite get that.");
// });