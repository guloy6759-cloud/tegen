import { Controller, Get, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('health')
class HealthController {
  @Get()
  health() {
    return {
      ok: true,
      service: 'tegen-api',
      time: new Date().toISOString()
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
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}

@Module({
  controllers: [HealthController, ProductsController],
  providers: [PrismaService]
})
export class AppModule {}
