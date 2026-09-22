import { Router } from 'express';
import { login, me } from '../controllers/index.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.post('/login', login);
r.get('/me', protect, me);
r.post('/logout', (_req, res) => res.json({ ok: true }));
export default r;