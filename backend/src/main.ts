import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Production-Grade CORS
  // Allows your Vercel frontend to communicate with this Render backend.
  app.enableCors({
    origin: '*', // Allows all origins for maximum compatibility
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Static File Serving
  // Serves the generated Word/Excel files from the 'uploads' folder.
  app.use(
    '/files',
    express.static(join(__dirname, '..', 'uploads')),
  );

  // 3. Dynamic Port Binding (CRITICAL FOR RENDER)
  const port = process.env.PORT || 3001;

  // We must listen on '0.0.0.0' to allow external traffic on Render
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Community OS Backend is live on port ${port}`);
}
bootstrap();