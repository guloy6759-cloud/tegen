import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() body: { telegramId: string; items: any; totalPrice: number }) {
    return this.orderService.createOrder(body);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.orderService.updateOrderStatus(id, body.status);
  }
}
