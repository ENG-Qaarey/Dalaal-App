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
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
  const appName = configService.get<string>('app.name') || 'Dalaal Prime API';
  const pageHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #87CEEB 0%, #B0E0FF 30%, #ffffff 70%, #f0f8ff 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    .card {
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border: 1px solid rgba(135,206,235,0.3);
      border-radius: 40px;
      padding: 80px 100px;
      text-align: center;
      box-shadow: 0 30px 60px rgba(135,206,235,0.2), 0 10px 20px rgba(0,0,0,0.05);
      max-width: 800px;
      width: 100%;
    }
    .logo {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #87CEEB, #5BA3D9);
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 32px;
      font-size: 56px;
      color: white;
      font-weight: 800;
      box-shadow: 0 10px 30px rgba(135,206,235,0.4);
    }
    h1 {
      font-size: 52px;
      color: #1a1a2e;
      margin-bottom: 12px;
      letter-spacing: -1px;
      font-weight: 700;
    }
    .subtitle {
      color: #5a6a7a;
      font-size: 20px;
      margin-bottom: 48px;
      font-weight: 400;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 32px;
      background: rgba(72, 187, 120, 0.12);
      border: 1px solid rgba(72, 187, 120, 0.3);
      border-radius: 100px;
      color: #2f855a;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 48px;
    }
    .status::before {
      content: '';
      width: 10px;
      height: 10px;
      background: #48bb78;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    .links {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .links a {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 18px 36px;
      border-radius: 16px;
      text-decoration: none;
      font-size: 18px;
      font-weight: 600;
      transition: all 0.25s;
    }
    .links a.docs {
      background: linear-gradient(135deg, #87CEEB, #5BA3D9);
      color: white;
      box-shadow: 0 6px 20px rgba(135,206,235,0.3);
    }
    .links a.docs:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(135,206,235,0.5);
    }
    .links a.health {
      background: rgba(255,255,255,0.6);
      color: #2c5282;
      border: 2px solid rgba(135,206,235,0.4);
    }
    .links a.health:hover {
      background: rgba(255,255,255,0.9);
      border-color: #87CEEB;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(135,206,235,0.2);
    }
    .footer {
      margin-top: 48px;
      color: #7a8a9a;
      font-size: 15px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">D</div>
    <h1>${appName}</h1>
    <p class="subtitle">Backend server is running</p>
    <div class="status">All systems operational</div>
    <div class="links">
      <a href="/${apiPrefix}/docs" class="docs">API Documentation</a>
      <a href="/${apiPrefix}/health" class="health">Health Check</a>
    </div>
    <div class="footer">Dalaal &mdash; Your Marketplace Platform</div>
  </div>
</body>
</html>`;
  httpAdapter.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(pageHtml);
  });

  // Global Prefix for API endpoints
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
  const frontendUrl = configService.get<string>('app.frontendUrl') || 'http://localhost:8081';
  const allowedOrigins = [
    frontendUrl,
    'http://localhost:3000',
    'http://localhost:3005',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3005',
    'http://127.0.0.1:8081',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
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
