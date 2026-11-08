import mongoose from 'mongoose';
import { ENV } from '../config/env';

export async function connectDatabase(): Promise<boolean> {
  if (!ENV.MONGODB_URI) {
    console.log('[Database] No MONGODB_URI provided. Running in high-performance In-Memory Seeded Store mode (seed = 220).');
    return false;
  }

  try {
    console.log(`[Database] Connecting to MongoDB at ${ENV.MONGODB_URI}...`);
    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('[Database] MongoDB connection established successfully.');
    return true;
  } catch (err) {
    console.warn('[Database] MongoDB connection failed. Falling back to In-Memory Seeded Store:', (err as Error).message);
    return false;
  }
}
