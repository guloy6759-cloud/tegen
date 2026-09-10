import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: { telegramId: string; items: any; totalPrice: number }) {
    // 1. Bazaga buyurtmani saqlaymiz
    const order = await this.prisma.order.create({
      data: {
        telegramId: data.telegramId,
        items: data.items,
        totalPrice: data.totalPrice,
        status: 'PENDING',
      },
      include: {
        user: true,
      },
    });

    // 2. Adminga Telegram orqali xabar yuboramiz
    const adminId = process.env.ADMIN_TELEGRAM_ID;
    const botToken = process.env.BOT_TOKEN;

    if (adminId && botToken) {
      const text = `🛒 *Yangi buyurtma!* (#${order.id.slice(0, 8)})\n\n` +
                   `👤 *Mijoz:* ${order.user?.firstName || 'Noma\'lum'} (${order.user?.phone || 'Raqam yo\'q'})\n` +
                   `💰 *Jami summa:* ${order.totalPrice.toLocaleString()} so'm\n\n` +
                   `Status: ⏳ Kutilmoqda`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminId,
            text: text,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '✅ Qabul qilish', callback_data: `accept_${order.id}` },
                  { text: '❌ Rad etish', callback_data: `cancel_${order.id}` },
                ],
              ],
            },
          }),
        });
      } catch (err) {
        console.error('Adminga xabar yuborishda xatolik:', err);
      }
    }

    return order;
  }
          }
