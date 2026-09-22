import { Router } from 'express';
import { User } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const r = Router();

r.use(protect);

/*
 * The church has one and only one admin account — created by the seed
 * script. This route exists only so the admin can see their own profile
 * via the "Users" endpoint if called. It never returns other users.
 */
r.get('/', async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user ? [user] : []);
});

/* Creating additional users is disabled. */
r.post('/', (_req, res) => {
  res.status(403).json({
    message: 'Creating additional admin accounts is disabled.'
  });
});

/* Role changes are disabled. */
r.put('/:id', (_req, res) => {
  res.status(403).json({
    message: 'The admin account cannot be modified through this endpoint.'
  });
});

/* Deletion is disabled — the admin account cannot be removed. */
r.delete('/:id', (_req, res) => {
  res.status(403).json({
    message: 'The admin account cannot be deleted.'
  });
});

export default r;