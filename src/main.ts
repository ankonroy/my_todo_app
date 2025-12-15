import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { sessionConfig } from './session.config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

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

  // Enable CORS for your frontend (update with your frontend URL)
  app.enableCors({
    origin: [
      'http://localhost:3000', // Local development
      'http://localhost:5173', // Vite dev server
      'https://my-todo-app-whr8.onrender.com', // Your frontend on Render
    ],
    credentials: true,
  });

  // Use Render's PORT or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
