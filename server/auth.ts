import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

type AdminSession = { admin?: boolean; email?: string } | null | undefined;

function getSession(req: Request): AdminSession {
  return (req as Request & { session?: AdminSession }).session;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Compare against self to keep work roughly constant-time when lengths differ
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (getSession(req)?.admin) {
    next();
    return;
  }
  res.status(401).json({ error: 'Unauthorized' });
}

export function loginAdmin(req: Request, res: Response) {
  const email = normalizeEmail(String(req.body?.email || ''));
  const password = String(req.body?.password || '');

  const expectedEmail = normalizeEmail(process.env.ADMIN_EMAIL || '');
  const expectedPassword = process.env.ADMIN_PASSWORD || '';

  if (!expectedEmail || !expectedPassword) {
    res.status(503).json({
      error: 'Admin credentials are not configured (ADMIN_EMAIL / ADMIN_PASSWORD).'
    });
    return;
  }

  if (!email || !password || !safeEqual(email, expectedEmail) || !safeEqual(password, expectedPassword)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const r = req as Request & { session?: AdminSession };
  r.session = r.session || {};
  r.session.admin = true;
  r.session.email = expectedEmail;
  res.json({ ok: true });
}

export function logoutAdmin(req: Request, res: Response) {
  (req as Request & { session?: AdminSession | null }).session = null;
  res.json({ ok: true });
}

export function meAdmin(req: Request, res: Response) {
  const session = getSession(req);
  res.json({
    authenticated: Boolean(session?.admin),
    email: session?.admin ? session.email || null : null
  });
}
