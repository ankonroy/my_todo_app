import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Connection } from 'mongoose';

export const sessionConfig = (mongooseConnection: Connection) => {
  // Get the native MongoDB client from mongoose connection
  const client = mongooseConnection.getClient();

  return session({
    secret:
      process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: client as any,
      collectionName: 'sessions',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'strict',
    },
  });
};
