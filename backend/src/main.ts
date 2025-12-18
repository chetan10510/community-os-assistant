import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // serve uploaded files
  app.use('/files', express.static('src/uploads'));

  await app.listen(3001);
  console.log('🚀 Backend running on http://localhost:3001');
}
bootstrap();
