import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  app.enableCors();
  app.setGlobalPrefix('api');
  
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`NightOwl API is running on: http://localhost:${port}/api`);
}
bootstrap();
