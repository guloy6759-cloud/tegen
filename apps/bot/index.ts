import { Telegraf, Markup } from 'telegraf';
import { PrismaClient } from '@prisma/client';

const bot = new Telegraf(process.env.BOT_TOKEN!);
const prisma = new PrismaClient();
const ADMIN_ID = Number(process.env.ADMIN_ID);

// 1. /start bosilganda nomer so'rash
bot.start(async (ctx) => {
  const userId = BigInt(ctx.from.id);
  let user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    user = await prisma.user.create({ data: { id: userId } });
  }

  if (!user.phoneNumber) {
    return ctx.reply(
      "Xush kelibsiz! Do'kondan foydalanish uchun telefon raqamingizni yuboring:",
      Markup.keyboard([
        [Markup.button.contactRequest("📱 Telefon raqamni yuborish")]
      ]).resize()
    );
  }

  ctx.reply(
    "Katalog va mahsulotlarni ko'rish uchun quyidagi tugmani bosing:",
    Markup.inlineKeyboard([
      [Markup.button.webApp("🛒 Do'konni ochish", process.env.API_URL!)]
    ])
  );
});

// 2. Telefon raqamni saqlash
bot.on('contact', async (ctx) => {
  const userId = BigInt(ctx.from.id);
  const phone = ctx.message.contact.phone_number;

  await prisma.user.update({
    where: { id: userId },
    data: { phoneNumber: phone }
  });

  await ctx.reply("Raqamingiz saqlandi! Endi do'kondan foydalanishingiz mumkin.", 
    Markup.inlineKeyboard([
      [Markup.button.webApp("🛒 Do'konni ochish", process.env.API_URL!)]
    ])
  );
});

// 3. Ishchi mahsulot yuborishi va adminga tasdiqlash uchun borishi
bot.action(/^approve_prod_(\d+)$/, async (ctx) => {
  const prodId = Number(ctx.match[1]);
  await prisma.product.update({
    where: { id: prodId },
    data: { status: 'APPROVED' }
  });
  await ctx.answerCbQuery("Mahsulot tasdiqlandi va appda ko'rindi!");
  await ctx.editMessageText("✅ Mahsulot admin tomonidan tasdiqlandi.");
});

// 4. Mijozdan adminga to'g'ridan-to'g'ri xabar/rasm o'tishi
bot.on(['text', 'photo'], async (ctx) => {
  if (ctx.from.id === ADMIN_ID) return;

  const text = 'text' in ctx.message ? ctx.message.text : 'Rasm yuborildi';
  await ctx.telegram.sendMessage(
    ADMIN_ID,
    `📩 **Mijozdan yangi xabar**\nID: ${ctx.from.id}\nIsm: ${ctx.from.first_name}\n\nXabar: ${text}`
  );

  if ('photo' in ctx.message) {
    const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    await ctx.telegram.sendPhoto(ADMIN_ID, photoId);
  }

  ctx.reply("Xabaringiz adminga yetkazildi.");
});

bot.launch();
    
