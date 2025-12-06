import mongoose from 'mongoose';

// Optional MongoDB - don't throw error if missing in development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pionyr-pacov';

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseConnection | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToMongoose(): Promise<typeof mongoose> {
  // Skip MongoDB if disabled
  if (MONGODB_URI === 'disabled' || !MONGODB_URI) {
    console.log('📴 MongoDB disabled - running in offline mode');
    throw new Error('MongoDB disabled');
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000, // Faster timeout
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected via Mongoose');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      console.log('💡 Running in offline mode - some features may be limited');
      cached!.promise = null;
      throw error;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.log('📴 MongoDB unavailable - continuing without database');
    throw e;
  }

  return cached!.conn;
}

export default connectToMongoose;