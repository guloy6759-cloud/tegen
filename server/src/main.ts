import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // Railway taqdim etadigan PORT o'zgaruvchisini olish yoki 3000 ni ishlatish
  const port = process.env.PORT || 3000;
  
  // '0.0.0.0' hostini ko'rsatish Railway va Docker uchun shart
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on port ${port}`);
}
bootstrap();
