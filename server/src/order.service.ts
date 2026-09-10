import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(body: { telegramId: string; firstName?: string; phone?: string; items: { productId: number; quantity: number }[] }) {
    if (!body.telegramId || !body.items?.length) throw new BadRequestException('telegramId va items kerak');
    if (body.items.some((i) => !Number.isInteger(i.quantity) || i.quantity < 1)) throw new BadRequestException('Mahsulot miqdori noto‘g‘ri');
    const user = await this.prisma.user.upsert({
      where: { telegramId: BigInt(body.telegramId) },
      update: { firstName: body.firstName, phone: body.phone },
      create: { telegramId: BigInt(body.telegramId), firstName: body.firstName, phone: body.phone },
    });
    if (!user.phone && !body.phone) throw new BadRequestException('Buyurtma uchun telefon raqami kerak');
    const products = await this.prisma.product.findMany({ where: { id: { in: body.items.map(i => i.productId) }, isActive: true } });
    const byId = new Map(products.map(p => [p.id, p]));
    const items = body.items.map(item => {
      const p = byId.get(item.productId);
      if (!p) throw new BadRequestException(`Mahsulot topilmadi: ${item.productId}`);
      return { productId: p.id, quantity: item.quantity, price: p.price };
    });
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return this.prisma.order.create({ data: { userId: user.id, total, items: { create: items } }, include: { user: true, items: { include: { product: true } } } });
  }

  getOrders() { return this.prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true, items: { include: { product: true } } } }); }

  async getOrder(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { user: true, items: { include: { product: true } } } });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    return order;
  }

  async updateStatus(id: number, status: string) {
    const allowed = ['NEW','ACCEPTED','PREPARING','READY','DELIVERING','COMPLETED','REJECTED','CANCELLED'];
    if (!allowed.includes(status)) throw new BadRequestException('Noto‘g‘ri status');
    const order = await this.prisma.order.update({ where: { id }, data: { status }, include: { user: true } });
    const token = process.env.BOT_TOKEN;
    const labels: Record<string,string> = { NEW:'🆕 Buyurtmangiz qabul qilindi va ko‘rib chiqilmoqda.', ACCEPTED:'✅ Buyurtmangiz qabul qilindi.', PREPARING:'👨‍🍳 Buyurtmangiz tayyorlanmoqda.', READY:'📦 Buyurtmangiz tayyor.', DELIVERING:'🚚 Buyurtmangiz yetkazib berilmoqda.', COMPLETED:'🎉 Buyurtmangiz yakunlandi. Rahmat!', REJECTED:'❌ Afsuski, buyurtmangiz rad etildi.', CANCELLED:'⚠️ Buyurtmangiz bekor qilindi.' };
    if (token) await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ chat_id: order.user.telegramId.toString(), text:`${labels[status] ?? status}\n\nBuyurtma #${order.id}` }) }).catch(() => undefined);
    return order;
  }
                                                 }
