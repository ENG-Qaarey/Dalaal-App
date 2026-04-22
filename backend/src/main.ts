import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global Prefix
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
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // CORS
  app.enableCors({
    origin: configService.get<string>('app.frontendUrl'),
    credentials: true,
  });

  // Body Parser
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
}
bootstrap();
