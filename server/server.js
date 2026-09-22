import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';

const app = express();

app.set('trust proxy', 1);

// Longer timeouts for large uploads (5 minutes)
app.use((req, res, next) => {
  req.setTimeout(5 * 60 * 1000);
  res.setTimeout(5 * 60 * 1000);
  next();
});

app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigin = process.env.CLIENT_URL || true;
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// ----------------------------------------------------------------
// Serve uploaded media with guaranteed MIME types
// ----------------------------------------------------------------
const UPLOADS_DIR = path.resolve('uploads');

const MIME_MAP = {
  '.mp3':  'audio/mpeg',
  '.m4a':  'audio/mp4',
  '.wav':  'audio/wav',
  '.weba': 'audio/webm',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.gif':  'image/gif'
};

app.use(
  '/uploads',
  (req, res, next) => {
    const ext = path.extname(req.path).toLowerCase();
    const mime = MIME_MAP[ext];
    if (mime) {
      res.setHeader('Content-Type', mime);
      res.setHeader('Accept-Ranges', 'bytes'); // enables seeking / streaming
    }
    next();
  },
  express.static(UPLOADS_DIR, {
    fallthrough: true,
    index: false,
    maxAge: '1h'
  })
);

// Rate limiter for the API
const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please slow down.' }
});
app.use('/api', apiLimiter);

app.use('/api', routes);

app.use('/api', (_req, res) =>
  res.status(404).json({ message: 'Endpoint not found.' })
);

app.use((err, _req, res, _next) => {
  console.error('❌ Server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong. Please try again.'
  });
});

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });