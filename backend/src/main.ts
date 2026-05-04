import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import compression from 'compression';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Beautiful Hello Backend page directly in Express - bypasses all interceptors!
  const httpAdapter = app.getHttpAdapter();
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello Backend!</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f0f0f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .container {
      text-align: center;
      padding: 40px 60px;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    h1 {
      font-size: 32px;
      color: #1a1a1a;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello Backend!</h1>
  </div>
</body>
</html>`;
  httpAdapter.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  // Global Prefix for API endpoints
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  // Global Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor(), new CacheInterceptor());

  // Compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
  });

  // Body Parser
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name') || 'Dalaal Prime API')
    .setDescription(configService.get<string>('app.description') || 'The Dalaal Prime API Documentation')
    .setVersion(configService.get<string>('app.version') || '1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port, '0.0.0.0');
  
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`API endpoints: http://localhost:${port}/${apiPrefix}`);
  logger.log(`Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
}
bootstrap();
