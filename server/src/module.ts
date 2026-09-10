import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserController } from './user.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [OrderController, UserController],
  providers: [OrderService, PrismaService],
})
export class AppModule {}
