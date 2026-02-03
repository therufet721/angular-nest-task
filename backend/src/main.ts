import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security: Add Helmet middleware for HTTP security headers
  // Protects against common vulnerabilities (XSS, clickjacking, etc.)
  app.use(helmet());
  
  // Enable CORS for Angular frontend
  // In production, use environment variable for allowed origins
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  });
  
  // Enable validation globally with security options
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // Strip properties not in DTO
    transform: true,        // Auto-transform payloads to DTO instances
    forbidNonWhitelisted: true,  // Throw error if unknown properties sent
  }));
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
