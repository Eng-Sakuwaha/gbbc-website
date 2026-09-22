import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Always load server/.env regardless of the current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

export const connectDB = async (uri) => {
  const connectionUri = uri || process.env.MONGODB_URI;

  if (!connectionUri) {
    console.error('❌ MONGODB_URI is not set.');
    console.error('   Looked for .env at:', envPath);
    console.error('   Make sure server/.env exists and contains:');
    console.error('   MONGODB_URI=mongodb://127.0.0.1:27017/gbbc');
    process.exit(1);
  }

  try {
    await mongoose.connect(connectionUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected to', connectionUri.replace(/\/\/.*@/, '//***@'));
  } catch (err) {
    console.error('❌ Could not connect to MongoDB.');
    console.error('   URI:', connectionUri);
    console.error('   Reason:', err.message);
    console.error('   → Is MongoDB running?  Try:  net start MongoDB');
    process.exit(1);
  }
};