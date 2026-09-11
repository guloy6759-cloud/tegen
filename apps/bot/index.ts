import { Telegraf, Markup } from 'telegraf';
import { PrismaClient } from '@prisma/client';

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN environment variable is missing!');
}

const bot = new Telegraf(BOT_TOKEN);
const prisma = new PrismaClient();
const ADMIN_ID = Number(process.env.ADMIN_ID || 0);
const API_URL = process.env.API_URL || 'https://example.com';

// WebApp Tugmasini Sozlash
bot.telegram.setChatMenuButton({
  menuButton: {
    type: 'web_app',
    text: "🛒 Do'kon",
    web_app: { url: API_URL }
  }
}).catch((err) => console.error("Menu button error:", err));

// Start Buyrug'i
bot.start(async (ctx) => {
  const userId = BigInt(ctx.from.id);
  let user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    user = await prisma.user.create({ data: { id: userId } });
  }

  if (!user.phoneNumber) {
    return ctx.reply(
      "Xush kelibsiz! Do'kondan foydalanish uchun avval telefon raqamingizni yuboring:",
      Markup.keyboard([
        [Markup.button.contactRequest("📱 Telefon raqamni yuborish")]
      ]).resize()
    );
  }

  ctx.reply(
    "Xarid qilishni boshlashingiz mumkin:",
    Markup.inlineKeyboard([
      [Markup.button.webApp("🛒 Do'konni ochish", API_URL)]
    ])
  );
});

// Kontakt Saqlash
bot.on('contact', async (ctx) => {
  const userId = BigInt(ctx.from.id);
  const phone = ctx.message.contact.phone_number;

  await prisma.user.update({
    where: { id: userId },
    data: { phoneNumber: phone }
  });

  await ctx.reply("Raqamingiz saqlandi! Endi do'kondan foydalanishingiz mumkin.", 
    Markup.inlineKeyboard([
      [Markup.button.webApp("🛒 Do'konni ochish", API_URL)]
    ])
  );
});

// Adminga Xabarlarni Yo'naltirish
bot.on(['text', 'photo'], async (ctx) => {
  if (ctx.from.id === ADMIN_ID) return;

  const text = 'text' in ctx.message ? ctx.message.text : 'Rasm yuborildi';
  if (ADMIN_ID) {
    await ctx.telegram.sendMessage(
      ADMIN_ID,
      `📩 **Mijozdan xabar**\nID: ${ctx.from.id}\nIsm: ${ctx.from.first_name}\n\nXabar: ${text}`
    );

    if ('photo' in ctx.message) {
      const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      await ctx.telegram.sendPhoto(ADMIN_ID, photoId);
    }
  }

  ctx.reply("Xabaringiz adminga yetkazildi.");
});

bot.launch().then(() => {
  console.log("Bot muvaffaqiyatli ishga tushdi!");
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
