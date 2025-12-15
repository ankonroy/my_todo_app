import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { sessionConfig } from './session.config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // IMPORTANT: Trust proxy for production (Render/Heroku)
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  // Get MongoDB connection
  const mongooseConnection = app.get<Connection>(getConnectionToken());

  // Configure session middleware with MongoDB store
  app.use(sessionConfig(mongooseConnection));

  // Add this to your main.ts before setting views
  const viewsPath = join(__dirname, '..', 'views');
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('ejs');

  // Enable CORS with proper configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173', // Vite/React
      'https://my-todo-app-whr8.onrender.com', // Your frontend if separate
      'https://*.onrender.com', // All Render domains
    ],
    credentials: true, // REQUIRED for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(
    `Application running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`,
  );
}
bootstrap();