import { Router } from 'express';
import { dashboardStats } from '../controllers/index.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.get('/dashboard', protect, dashboardStats);
export default r;