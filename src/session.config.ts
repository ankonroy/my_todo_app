import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Connection } from 'mongoose';

export const sessionConfig = (mongooseConnection: Connection) => {
  // Get the native MongoDB client from mongoose connection
  const client = mongooseConnection.getClient();
  const isProduction = process.env.NODE_ENV === 'production';

  return session({
    secret:
      process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: client as any,
      dbName: process.env.DB_NAME || 'todoapp', // Add this
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 24 hours in seconds
      autoRemove: 'native', // Let MongoDB remove expired sessions
      stringify: false, // Store as BSON
    }),
    cookie: {
      secure: isProduction, // true in production (Render uses HTTPS)
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      sameSite: isProduction ? 'none' : 'strict', // Change to 'none' for cross-domain
      httpOnly: true, // Prevent client-side JS access
      path: '/', // Ensure cookie is sent for all routes
    },
    proxy: true, // ADD THIS - Required for Render/Heroku
    name: 'sessionId', // Custom cookie name
    rolling: false, // Reset maxAge on every request? Set to false
  });
};
