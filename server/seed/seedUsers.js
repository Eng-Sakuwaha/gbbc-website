import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { User } from '../models/index.js';

await connectDB(process.env.MONGODB_URI);

const email = (process.env.ADMIN_EMAIL || 'admin@gbbc.local').toLowerCase();
const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

const existing = await User.findOne({ email });
if (existing) {
  console.log('Admin already exists:', email);
} else {
  await User.create({
    name: 'Administrator',
    email,
    password: await bcrypt.hash(password, 10),
    role: 'Super Admin'
  });
  console.log('✅ Admin created:', email);
}

await mongoose.disconnect();