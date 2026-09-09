import { Controller, Get, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Controller('health')
class HealthController {
  @Get()
  health() {
    return {
      ok: true,
      service: 'tegen-api',
      time: new Date().toISOString(),
    };
  }
}

@Controller('products')
class ProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list() {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  }
}

@Module({
  controllers: [
    HealthController,
    ProductsController,
    OrderController,
  ],
  providers: [
    PrismaService,
    OrderService,
  ],
})
export class AppModule {}
