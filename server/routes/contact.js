import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitContact,
  listMessages,
  markMessageRead,
  deleteMessage
} from '../controllers/index.js';
import { protect } from '../middleware/auth.js';

const r = Router();

// Public POST — limit to 5 submissions per 10 min per IP
const contactLimiter = rateLimit({
  windowMs: 10 * 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions. Please try again later.' }
});

r.post('/', contactLimiter, submitContact);
r.get('/', protect, listMessages);
r.put('/:id/read', protect, markMessageRead);
r.delete('/:id', protect, deleteMessage);

export default r;