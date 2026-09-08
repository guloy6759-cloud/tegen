import { Bot, InlineKeyboard } from 'grammy';

const token = process.env.BOT_TOKEN;

if (!token) throw new Error('BOT_TOKEN is required');

const bot = new Bot(token);

bot.command('start', async ctx => {
  const url = process.env.MINI_APP_URL;

  if (!url) {
    return ctx.reply('TEGEN: Mini App hali sozlanmagan.');
  }

  const keyboard = new InlineKeyboard().webApp(
    '🛍 Do‘konni ochish',
    url
  );

  await ctx.reply('🔴 TEGEN ga xush kelibsiz!', {
    reply_markup: keyboard
  });
});

bot.catch(err => console.error(err));

bot.start();
