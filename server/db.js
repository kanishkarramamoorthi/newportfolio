import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not set. Running with sample data only.');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed. Running with sample data only.');
    console.warn(error.message);
    return false;
  }
}
