// app/lib/mongodb.js
import mongoose from 'mongoose';

// Default to a non-existent MongoDB URI if not provided
const MONGODB_URI = process.env.MONGODB_URI || '';

// Flag to track if MongoDB is available
let isMongoDBAvailable = !!MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If MongoDB URI is not available, return null without throwing an error
  if (!isMongoDBAvailable) {
    console.warn('MongoDB URI not provided. Using localStorage fallback.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      }).catch(error => {
        console.error('MongoDB connection error:', error);
        isMongoDBAvailable = false;
        return null;
      });
    } catch (error) {
      console.error('MongoDB connection error:', error);
      isMongoDBAvailable = false;
      return null;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Error resolving MongoDB connection:', error);
    isMongoDBAvailable = false;
    return null;
  }
}

// Export a function to check if MongoDB is available
export const checkMongoDBAvailability = () => isMongoDBAvailable;

export default connectDB;