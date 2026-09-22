import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { protect } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';

const r = Router();
const uploadsDir = path.resolve('uploads');

r.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;

  res.status(201).json({
    url,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

r.get('/', protect, (req, res) => {
  if (!fs.existsSync(uploadsDir)) return res.json([]);

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const files = fs.readdirSync(uploadsDir).map((filename) => {
    const full = path.join(uploadsDir, filename);
    const stat = fs.statSync(full);
    return {
      url: `${baseUrl}/uploads/${filename}`,
      filename,
      size: stat.size,
      uploadedAt: stat.mtime
    };
  });
  res.json(files);
});

r.delete('/:filename', protect, (req, res) => {
  const safe = path.basename(req.params.filename);
  const full = path.join(uploadsDir, safe);
  if (!full.startsWith(uploadsDir)) {
    return res.status(400).json({ message: 'Invalid path.' });
  }
  if (fs.existsSync(full)) fs.unlinkSync(full);
  res.json({ ok: true });
});

export default r;