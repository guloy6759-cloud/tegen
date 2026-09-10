import { Bot, Keyboard } from 'grammy';

const token = process.env.BOT_TOKEN;
const apiUrl = process.env.API_URL;
const adminChatId = process.env.ADMIN_CHAT_ID;

if (!token) throw new Error('BOT_TOKEN is not set');
if (!apiUrl) throw new Error('API_URL is not set');

const bot = new Bot(token);

async function saveUser(ctx: any, phone?: string) {
  const u = ctx.from;

  await fetch(`${apiUrl}/users/sync`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      telegramId: String(u.id),
      firstName: u.first_name,
      username: u.username,
      phone
    }),
  }).catch(() => undefined);
}

bot.command('start', async (ctx) => {
  try {
    const r = await fetch(`${apiUrl}/users/${ctx.from.id}`);
    const data = await r.json();

    if (data?.phone) {
      await ctx.reply(
        `Assalomu alaykum, ${ctx.from.first_name}! 👋\n\nTEGEN do‘koniga xush kelibsiz.`,
        {
          reply_markup: {
            remove_keyboard: true
          }
        }
      );

      return;
    }
  } catch {}

  await ctx.reply(
    'Assalomu alaykum! 👋\n\nBuyurtma berish uchun avval telefon raqamingizni yuboring:',
    {
      reply_markup: new Keyboard()
        .requestContact('📱 Telefon raqamimni yuborish')
        .resized()
        .oneTime(),
    }
  );
});

bot.on('message:contact', async (ctx) => {
  const c = ctx.message.contact;

  if (c.user_id && c.user_id !== ctx.from.id) {
    return ctx.reply(
      'Iltimos, o‘zingizning telefon raqamingizni yuboring.'
    );
  }

  await saveUser(ctx, c.phone_number);

  await ctx.reply(
    '✅ Telefon raqamingiz saqlandi.\n\nEndi TEGEN ilovasidan foydalanishingiz mumkin.',
    {
      reply_markup: {
        remove_keyboard: true
      }
    }
  );
});

bot.on('message', async (ctx) => {
  if (!adminChatId) return;

  const msg = ctx.message as any;

  if (msg.text?.startsWith('/')) return;

  await saveUser(ctx);

  await ctx.api.sendMessage(
    adminChatId,
    `👤 Mijoz: ${ctx.from.first_name}${
      ctx.from.username ? ` (@${ctx.from.username})` : ''
    }\n🆔 ${ctx.from.id}\n\nMijoz yuborgan xabar:`
  );

  await ctx.api.copyMessage(
    adminChatId,
    ctx.chat.id,
    msg.message_id
  );
});

bot.catch((err) => console.error('Bot error:', err));

bot.start();

console.log('Bot ishga tushdi');
