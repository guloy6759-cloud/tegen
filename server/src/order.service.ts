import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: { telegramId: string; items: any; totalPrice: number }) {
    const order = await this.prisma.order.create({
      data: {
        telegramId: data.telegramId,
        items: data.items,
        totalPrice: data.totalPrice,
        status: 'PENDING',
      },
      include: { user: true },
    });

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
                  { text: '✅ Qabul qilish', callback_data: `accept_order_${order.id}` },
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

  async updateOrderStatus(id: string, status: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { user: true },
    });

    // Mijozga status bo'yicha xabar yuborish
    const botToken = process.env.BOT_TOKEN;
    if (botToken && order.telegramId) {
      const message = status === 'ACCEPTED' 
        ? '✅ Buyurtmangiz qabul qilindi! Operatorlarimiz tayyorlashni boshlashdi.' 
        : `Status yangilandi: ${status}`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: order.telegramId,
            text: message,
          }),
        });
      } catch (err) {
        console.error('Mijozga xabar yuborishda xatolik:', err);
      }
    }

    return order;
  }
}
