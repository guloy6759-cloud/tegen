import { Bot, Keyboard, InlineKeyboard } from "grammy";

const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_TELEGRAM_ID;
const API_URL = process.env.API_URL || "http://localhost:3000";
const miniAppUrl = process.env.MINI_APP_URL || "https://example.com";

if (!token) throw new Error("BOT_TOKEN is not defined");

const bot = new Bot(token);

// 1. /start komandasi
bot.command("start", async (ctx) => {
  const phoneKeyboard = new Keyboard()
    .requestContact("📱 Telefon raqamni yuborish")
    .resized()
    .oneTime();

  await ctx.reply(
    `Xush kelibsiz! Tegen do'konidan foydalanish uchun telefon raqamingizni yuboring:`,
    { reply_markup: phoneKeyboard }
  );
});

// 2. Telefon raqamni qabul qilish va saqlash
bot.on(":contact", async (ctx) => {
  const contact = ctx.message?.contact;
  if (!contact) return;

  const telegramId = String(ctx.from?.id);
  const firstName = ctx.from?.first_name || "";
  const username = ctx.from?.username || "";
  const phone = contact.phone_number;

  try {
    await fetch(`${API_URL}/users/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, firstName, username, phone }),
    });

    const webAppKeyboard = new InlineKeyboard().webApp("🛍️ Tegen do'konini ochish", miniAppUrl);
    await ctx.reply("Raqamingiz saqlandi! Do'kondan foydalanishingiz mumkin:", {
      reply_markup: webAppKeyboard,
    });
  } catch (error) {
    console.error("User sync error:", error);
    await ctx.reply("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
  }
});

// 3. Callback tugmalar (Buyurtma qabul qilish va Ishchi mahsulotini tasdiqlash)
bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;

  // Buyurtmani qabul qilish
  if (data.startsWith("accept_order_")) {
    const orderId = data.replace("accept_order_", "");
    
    // Statusni bazada UPDATE qilish uchun API
    await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACCEPTED" }),
    });

    await ctx.answerCallbackQuery("Buyurtma qabul qilindi!");
    await ctx.editMessageText(`${ctx.callbackQuery.message?.text}\n\n✅ *STATUS: QABUL QILINDI*`, { parse_mode: "Markdown" });
  }

  // Ishchi taklif qilgan mahsulotni tasdiqlash (Admin)
  if (data.startsWith("approve_prod_")) {
    const proposalId = data.replace("approve_prod_", "");

    await fetch(`${API_URL}/admin/approve-product/${proposalId}`, {
      method: "POST",
    });

    await ctx.answerCallbackQuery("Mahsulot tasdiqlandi va app'ga qo'shildi!");
    await ctx.editMessageText(`${ctx.callbackQuery.message?.text}\n\n✅ *ADMIN TARAFIDAN TASDIQLANDI*`, { parse_mode: "Markdown" });
  }
});

// 4. Mijozdan kelgan matn va rasmlarni to'g'ridan-to'g'ri adminga uzatish
bot.on(["message:text", "message:photo"], async (ctx) => {
  // Agar xabar admindan chiqmagan bo'lsa, adminga forvard qilamiz
  if (adminId && String(ctx.from?.id) !== adminId) {
    const senderName = ctx.from?.first_name || "Mijoz";
    const senderId = ctx.from?.id;

    await bot.api.sendMessage(
      adminId,
      `📩 *Mijozdan yangi xabar/rasm*\n👤 *Kimdan:* ${senderName} (ID: ${senderId}):`,
      { parse_mode: "Markdown" }
    );
    await ctx.forwardMessage(adminId);
    await ctx.reply("Xabaringiz adminga yetkazildi!");
  }
});

bot.start();
console.log("Tegen Bot is active...");
