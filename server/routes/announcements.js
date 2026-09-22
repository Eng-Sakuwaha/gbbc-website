import { Router } from 'express';
import { makeCrud } from '../controllers/index.js';
import { Announcement } from '../models/index.js';
import { protect } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

const r = Router();
const c = makeCrud(Announcement, { publicFilter: { status: 'published' } });
r.get('/', optionalAuth, c.list);
r.get('/:id', optionalAuth, c.getOne);
r.post('/', protect, c.create);
r.put('/:id', protect, c.update);
r.delete('/:id', protect, c.remove);
export default r;