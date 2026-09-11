import { Telegraf, Markup } from 'telegraf';

// 1. Botni e'lon qilish
const bot = new Telegraf(process.env.BOT_TOKEN!);

// 2. /start buyrug'i - Telefon raqam so'rash va Mini App tugmasi
bot.start((ctx) => {
  ctx.reply(
    'Xush kelibsiz! Do\'kondan foydalanish uchun telefon raqamingizni yuboring:',
    Markup.keyboard([
      [Markup.button.contactRequest('📱 Telefon raqamni yuborish')],
      [Markup.button.webApp('🛒 Do\'konni ochish', process.env.API_URL || 'https://tegenmini-app-production.up.railway.app')]
    ]).resize()
  );
});

// 3. Telefon raqam qabul qilish
bot.on('contact', async (ctx) => {
  const phoneNumber = ctx.message.contact.phone_number;
  await ctx.reply(`Raqamingiz qabul qilindi: ${phoneNumber}\nEndi do'kondan buyurtma berishingiz mumkin!`, 
    Markup.inlineKeyboard([
      [Markup.button.webApp('🛒 Do\'konga kirish', process.env.API_URL || 'https://tegenmini-app-production.up.railway.app')]
    ])
  );
});

// 4. Chat Menu Button (Pastdagi tugma)
bot.telegram.setChatMenuButton({
  menuButton: {
    type: 'web_app',
    text: 'Do\'kon',
    web_app: { url: process.env.API_URL || 'https://tegenmini-app-production.up.railway.app' }
  }
}).catch((err) => console.error('Menu button error:', err));

// 5. Botni ishga tushirish
bot.launch().then(() => {
  console.log('Bot muvaffaqiyatli ishga tushdi!');
});

// To'xtatish xavfsizligi
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
