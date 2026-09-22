import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.use(protect);

r.get('/', async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

r.put('/', async (req, res) => {
  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.email) updates.email = req.body.email.toLowerCase();
  if (req.body.password) updates.password = await bcrypt.hash(req.body.password, 10);
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
    .select('-password');
  res.json(user);
});

export default r;