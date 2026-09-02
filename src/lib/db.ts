import mongoose from "mongoose";

type MongoCache = {
  connection: typeof mongoose | null;
  connectionPromise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoCache: MongoCache | undefined;
}

const cache: MongoCache = global.mongoCache ?? {
  connection: null,
  connectionPromise: null,
};

global.mongoCache = cache;

export async function connectDB() {
  if (cache.connection) return cache.connection;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!cache.connectionPromise) {
    cache.connectionPromise = mongoose.connect(uri);
  }

  try {
    cache.connection = await cache.connectionPromise;
  } catch (error) {
    cache.connectionPromise = null;
    throw error;
  }

  return cache.connection;
}
