import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { openDatabase } from './db';
import { seedIfEmpty } from './seed';
import { createAdminRouter, createPublicRouter } from './routes';
import { getLocalUploadDir } from './storage';
import { ensureDefaultSiteSettings } from './siteSettings';

const PORT = Number(process.env.PORT || 8787);
const isProd = process.env.NODE_ENV === 'production';

const db = openDatabase();
seedIfEmpty(db);
ensureDefaultSiteSettings(db);

const app = express();
app.set('trust proxy', 1);

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(
  cookieSession({
    name: 'monlam_admin',
    keys: [process.env.SESSION_SECRET || 'dev-session-secret-change-me'],
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    httpOnly: true,
    // Secure cookies are ignored by browsers on http://. Only enable for https.
    secure: (process.env.APP_URL || '').startsWith('https://')
  })
);

app.use('/uploads', express.static(getLocalUploadDir()));
app.use('/api/admin', createAdminRouter(db));
app.use('/api', createPublicRouter(db));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

if (isProd) {
  const dist = path.join(__dirname, '..', 'dist');
  app.use(express.static(dist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      next();
      return;
    }
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Monlam CMS API listening on http://localhost:${PORT}`);
});
