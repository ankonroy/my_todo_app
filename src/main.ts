import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { sessionConfig } from './session.config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
// import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Get MongoDB connection
  const mongooseConnection = app.get<Connection>(getConnectionToken());

  // Configure session middleware with MongoDB store
  app.use(sessionConfig(mongooseConnection));

  // Add this to your main.ts before setting views
  const viewsPath = join(__dirname, '..', 'views');

  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('ejs');

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
