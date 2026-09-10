const MINI_APP_URL = process.env.MINI_APP_URL || 'https://tegenmini-app-production.up.railway.app';

// Telegram pastki menyu tugmasini sozlash
bot.telegram.setChatMenuButton({
  menuButton: {
    type: 'web_app',
    text: '🛍️ Do\'konni ochish',
    web_app: { url: MINI_APP_URL },
  },
});
