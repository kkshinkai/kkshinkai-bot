// Enabling of cancellation of promises manually.
process.env.NTBA_FIX_319 = "1";

import TelegramBot from 'node-telegram-bot-api';
import rust from './run-rust';

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

bot.onText(/\/rust( |\n)([\s\S]*)/, async (msg, match) => {
  let chatId = msg.chat.id;

  let code = match[2];
  await bot.sendChatAction(chatId, "typing");
  let result = await rust.run(code);
  let output =
    result.success === true
      ? result.stdout
      : result.stderr.substring(result.stderr.indexOf("\n") + 1);

  let quotedCode =
    code.split('\n').map(line => `> ${line}`).join('\n') + '\n'
  let string = `<pre>${quotedCode}</pre><pre>${output}</pre>`;

  bot.sendMessage(chatId, string, { parse_mode: "HTML" });
});
