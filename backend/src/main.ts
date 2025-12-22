import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Serve uploaded files publicly
  app.use(
    '/files',
    express.static(join(__dirname, '..', 'src', 'uploads')),
  );

  app.enableCors();
  await app.listen(3001);
  console.log('🚀 Backend running on http://localhost:3001');
}
bootstrap();
