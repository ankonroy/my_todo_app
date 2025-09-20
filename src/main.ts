import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { sessionConfig } from './session.config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Get MongoDB connection
  const mongooseConnection = app.get<Connection>(getConnectionToken());

  // Configure session middleware with MongoDB store
  app.use(sessionConfig(mongooseConnection));

  // Add this to your main.ts before setting views
  const viewsPath = join(__dirname, '..', 'views');
  console.log('Views directory path:', viewsPath);

  // Check if directory exists
  console.log('Views directory exists:', existsSync(viewsPath));

  // Check if index.ejs exists
  const indexPath = join(viewsPath, 'index.ejs');
  console.log('index.ejs exists:', existsSync(indexPath));

  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('ejs');

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
