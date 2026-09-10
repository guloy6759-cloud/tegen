import { Bot, Keyboard, InlineKeyboard } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN is not defined");
}

const API_URL = process.env.API_URL || "http://localhost:3000";
const miniAppUrl = process.env.MINI_APP_URL || "https://example.com";

const bot = new Bot(token);

// /start komandasi
bot.command("start", async (ctx) => {
  const telegramId = String(ctx.from?.id);
  const firstName = ctx.from?.first_name || "";
  const username = ctx.from?.username || "";

  // Kontakt so'rash uchun tugma
  const phoneKeyboard = new Keyboard()
    .requestContact("📱 Telefon raqamni yuborish")
    .resized()
    .oneTime();

  await ctx.reply(
    `Xush kelibsiz, ${firstName}!\nTegen do'konidan foydalanish uchun iltimos, telefon raqamingizni yuboring:`,
    { reply_markup: phoneKeyboard }
  );
});

// Telefon raqam (contact) qabul qilish
bot.on(":contact", async (ctx) => {
  const contact = ctx.message?.contact;
  if (!contact) return;

  const telegramId = String(ctx.from?.id);
  const firstName = ctx.from?.first_name || "";
  const username = ctx.from?.username || "";
  const phone = contact.phone_number;

  try {
    // Backend API ga foydalanuvchini saqlash uchun so'rov
    await fetch(`${API_URL}/users/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, firstName, username, phone }),
    });

    const webAppKeyboard = new InlineKeyboard().webApp("🛍️ Tegen do'konini ochish", miniAppUrl);

    await ctx.reply("Raqamingiz qabul qilindi! Do'kondan foydalanishingiz mumkin:", {
      reply_markup: webAppKeyboard,
    });
  } catch (error) {
    console.error("User sync error:", error);
    await ctx.reply("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
  }
});

bot.start();
console.log("Tegen Bot started...");
