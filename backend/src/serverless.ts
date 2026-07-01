import 'reflect-metadata';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureNestApp } from './platform/configure-nest-app';

let cachedServer: express.Express | null = null;

export async function createVercelHandler(): Promise<express.Express> {
  if (cachedServer) {
    return cachedServer;
  }

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log']
  });

  configureNestApp(app);
  await app.init();

  cachedServer = server;
  return server;
}

