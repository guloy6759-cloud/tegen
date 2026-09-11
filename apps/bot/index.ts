import { Telegraf } from 'telegraf';

// 1. Avval bot obyektini e'lon qiling:
const bot = new Telegraf(process.env.BOT_TOKEN!);

// 2. Keyin menu tugmasini sozlang:
bot.telegram.setChatMenuButton({
  menuButton: {
    type: 'web_app',
    text: 'Do\'kon',
    web_app: { url: process.env.API_URL! }
  }
});

bot.launch();
