import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/index.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.get('/settings', getSettings);
r.put('/settings', protect, updateSettings);
r.get('/', getSettings); // alias
export default r;