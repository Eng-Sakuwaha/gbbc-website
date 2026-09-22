import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200 MB

// Map mimetype → canonical extension
const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/mp4': '.m4a',
  'audio/x-m4a': '.m4a',
  'audio/m4a': '.m4a',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/webm': '.weba',
  'video/mp4': '.mp4',
  'video/webm': '.webm'
};

const ALLOWED_EXT = /\.(jpe?g|png|webp|gif|mp3|m4a|wav|weba|mp4|webm)$/i;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    // Determine the extension we want to save under.
    const fromMime = MIME_TO_EXT[file.mimetype];
    const fromName = path.extname(file.originalname).toLowerCase();
    const ext = fromMime || (ALLOWED_EXT.test(fromName) ? fromName : '');

    if (!ext) {
      return cb(new Error('Unsupported file type.'));
    }

    const base = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9\-_]/g, '_')
      .slice(0, 80);

    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 20
  },
  fileFilter: (_req, file, cb) => {
    const okMime = !!MIME_TO_EXT[file.mimetype];
    const okExt = ALLOWED_EXT.test(path.extname(file.originalname).toLowerCase());
    if (okMime || okExt) return cb(null, true);
    cb(new Error('Unsupported file type. Only images, audio, and video are allowed.'));
  }
});