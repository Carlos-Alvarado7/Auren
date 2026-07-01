import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { json, urlencoded } from 'express';

export function configureNestApp(app: INestApplication): void {
  const cookieSecret = process.env.COOKIE_SECRET;
  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:4200';

  app.setGlobalPrefix('api');
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(json({ limit: '250kb' }));
  app.use(urlencoded({ extended: false, limit: '250kb' }));
  app.use(cookieParser(cookieSecret));
  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );
}
