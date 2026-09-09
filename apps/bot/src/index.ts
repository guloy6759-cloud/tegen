import { Bot } from "grammy";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is not set");
}

const bot = new Bot(token);

bot.command("start", (ctx) => {
  ctx.reply("Bot ishlayapti! 🚀");
});

bot.on("message:text", (ctx) => {
  ctx.reply(`Siz yozdingiz: ${ctx.message.text}`);
});

bot.start();

console.log("Bot ishga tushdi");
