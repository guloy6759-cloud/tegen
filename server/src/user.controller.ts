import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('users')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':telegramId')
  async getUser(@Param('telegramId') telegramId: string) {
    return this.prisma.user.findUnique({
      where: { telegramId },
    });
  }

  @Post('sync')
  async syncUser(@Body() body: { telegramId: string; firstName?: string; username?: string; phone?: string }) {
    return this.prisma.user.upsert({
      where: { telegramId: body.telegramId },
      update: {
        firstName: body.firstName,
        username: body.username,
        phone: body.phone,
      },
      create: {
        telegramId: body.telegramId,
        firstName: body.firstName,
        username: body.username,
        phone: body.phone,
      },
    });
  }
}
