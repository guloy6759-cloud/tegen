import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body()
    body: {
      telegramId: string;
      firstName?: string;
      phone?: string;
      items: {
        productId: number;
        quantity: number;
      }[];
    },
  ) {
    return this.orderService.createOrder(body);
  }

  @Get()
  getOrders() {
    return this.orderService.getOrders();
  }

  @Get(':id')
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrder(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ) {
    return this.orderService.updateStatus(id, body.status);
  }
}
