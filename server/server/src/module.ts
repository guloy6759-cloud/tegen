import { Module, Controller, Get } from '@nestjs/common';

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
  @Get()
  list() {
    return [];
  }
}

@Module({
  controllers: [HealthController, ProductsController]
})
export class AppModule {}
