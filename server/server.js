import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust first proxy (Render, nginx, etc.)
app.set('trust proxy', 1);

// Long timeouts for large uploads
app.use((req, res, next) => {
  req.setTimeout(5 * 60 * 1000);
  res.setTimeout(5 * 60 * 1000);
  next();
});

app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false
}));

// CORS — allow all origins (safe because we serve the frontend from the same domain)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

/* =========================================================
   1. Serve uploaded media with guaranteed MIME types
   ========================================================= */
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
      res.setHeader('Accept-Ranges', 'bytes');
    }
    next();
  },
  express.static(UPLOADS_DIR, {
    fallthrough: true,
    index: false,
    maxAge: '1h'
  })
);

/* =========================================================
   2. API routes
   ========================================================= */
const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please slow down.' }
});

app.use('/api', apiLimiter);
app.use('/api', routes);

// 404 for unknown API routes (does not affect frontend routes)
app.use('/api', (_req, res) =>
  res.status(404).json({ message: 'Endpoint not found.' })
);

/* =========================================================
   3. Serve the built frontend (must come AFTER API routes)
   ========================================================= */
const clientDist = path.resolve(__dirname, '..', 'client', 'dist');

// Static assets: JS, CSS, images, hero slides
app.use(express.static(clientDist, {
  index: false,
  maxAge: '1h'
}));

// React Router fallback — send index.html for any non-API, non-uploads route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (req.path.startsWith('/uploads')) return next();

  const indexPath = path.join(clientDist, 'index.html');

  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Failed to serve index.html:', err.message);
      console.error('   Looked in:', indexPath);
      res.status(500).send('Frontend not built. Run the client build first.');
    }
  });
});

/* =========================================================
   4. Central error handler
   ========================================================= */
app.use((err, _req, res, _next) => {
  console.error('❌ Server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong. Please try again.'
  });
});

/* =========================================================
   5. Start the server
   ========================================================= */
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📁 Serving frontend from: ${clientDist}`);

      // Warn if the frontend isn't built
      import('fs').then(({ default: fs }) => {
        const indexPath = path.join(clientDist, 'index.html');
        if (!fs.existsSync(indexPath)) {
          console.warn(`⚠️  index.html not found at ${indexPath}`);
          console.warn(`   All routes will return 500 until the client is built.`);
          console.warn(`   Build command: cd ../client && npm install && npm run build`);
        } else {
          console.log(`✅ Frontend found at ${indexPath}`);
        }
      });
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });