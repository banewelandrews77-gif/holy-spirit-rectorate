import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { initDatabase, db } from './db';
import authRoutes from './routes/auth.routes';
import donationRoutes from './routes/donation.routes';
import contentRoutes from './routes/content.routes';
import galleryRoutes from './routes/gallery.routes';
import contactRoutes from './routes/contact.routes';
import settingsRoutes from './routes/settings.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

// Initialize SQLite database schema
initDatabase();

// Auto-seed on startup if database is empty (supports free-tier hosting without persistent disk)
async function autoSeedIfEmpty() {
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  if (userCount === 0) {
    console.log('[SERVER] Empty database detected — running auto-seed...');
    const { seedDatabase } = await import('./seed.js');
    seedDatabase();
    console.log('[SERVER] Auto-seed complete.');
  } else {
    console.log(`[SERVER] Database ready — ${userCount} user(s) found.`);
  }
}
autoSeedIfEmpty().catch(err => console.error('[SERVER] Auto-seed error:', err));

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');
const uploadsPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded media files
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api', contentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    parish: 'Holy Spirit Rectorate',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend if dist exists (Express 5 compatible SPA fallback)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[PARISH SERVER] Holy Spirit Rectorate running on http://localhost:${PORT}`);
});
