import { Body, Controller, Delete, Get, Module, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Controller('health')
class HealthController { @Get() health() { return { ok:true, service:'tegen-api', time:new Date().toISOString() }; } }

@Controller('products')
class ProductsController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() list() { return this.prisma.product.findMany({ where:{isActive:true}, orderBy:{createdAt:'desc'}, include:{category:true} }); }
}

@Controller('categories')
class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() list() { return this.prisma.category.findMany({ where:{isActive:true}, orderBy:{name:'asc'} }); }
}


@Controller('users')
class UsersController {
  constructor(private readonly prisma: PrismaService) {}
  @Get(':telegramId') async get(@Param('telegramId') telegramId:string) { return this.prisma.user.findUnique({ where:{telegramId:BigInt(telegramId)} }); }
  @Post('sync') async sync(@Body() b:any) { return this.prisma.user.upsert({ where:{telegramId:BigInt(b.telegramId)}, update:{firstName:b.firstName,username:b.username,phone:b.phone}, create:{telegramId:BigInt(b.telegramId),firstName:b.firstName,username:b.username,phone:b.phone} }); }
}

@Controller('admin')
class AdminController {
  constructor(private readonly prisma: PrismaService) {}
  private check(token?: string) { if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) throw new Error('Unauthorized'); }
  @Get('dashboard') async dashboard() { return { products:await this.prisma.product.count(), activeProducts:await this.prisma.product.count({where:{isActive:true}}), orders:await this.prisma.order.count(), users:await this.prisma.user.count() }; }
  @Post('categories') async createCategory(@Body() b:any) { this.check(b.token); const {token,...data}=b; return this.prisma.category.create({data}); }
  @Post('products') async createProduct(@Body() b:any) { this.check(b.token); const {token,...data}=b; return this.prisma.product.create({data}); }
  @Patch('products/:id') async updateProduct(@Param('id',ParseIntPipe) id:number,@Body() b:any) { this.check(b.token); const {token,...data}=b; return this.prisma.product.update({where:{id},data}); }
  @Delete('products/:id') async deleteProduct(@Param('id',ParseIntPipe) id:number,@Body() b:any) { this.check(b.token); return this.prisma.product.update({where:{id},data:{isActive:false}}); }
}

@Module({controllers:[HealthController,ProductsController,CategoriesController,UsersController,AdminController,OrderController],providers:[PrismaService,OrderService]})
export class AppModule {}
