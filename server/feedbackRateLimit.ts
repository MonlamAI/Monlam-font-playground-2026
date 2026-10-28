import crypto from 'crypto';
import type { Request, Response } from 'express';
import type { Db } from './db';

export const FEEDBACK_SUBMITTER_COOKIE = 'monlam_feedback_id';
export const DEFAULT_FEEDBACK_DAILY_LIMIT = 3;

export type FeedbackQuota = {
  limit: number;
  used: number;
  remaining: number;
  resetAt: string;
};

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nextUtcMidnightIso(): string {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return next.toISOString();
}

export function feedbackDailyLimit(): number {
  const n = Number(process.env.FEEDBACK_DAILY_LIMIT || DEFAULT_FEEDBACK_DAILY_LIMIT);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_FEEDBACK_DAILY_LIMIT;
  return Math.floor(n);
}

export function parseCookieHeader(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx <= 0) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name) out[name] = decodeURIComponent(value);
  }
  return out;
}

export function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function hashIpUa(req: Request): string {
  const ip = clientIp(req);
  const ua = String(req.headers['user-agent'] || '').slice(0, 512);
  return crypto.createHash('sha256').update(`${ip}|${ua}`).digest('hex');
}

export function resolveSubmitterKeys(
  req: Request,
  contactEmail: string | null,
  cookieIdOverride?: string
): string[] {
  const keys: string[] = [];
  const cookies = parseCookieHeader(req.headers.cookie);
  const cookieId = cookieIdOverride || cookies[FEEDBACK_SUBMITTER_COOKIE];
  if (cookieId && /^[0-9a-f-]{36}$/i.test(cookieId)) {
    keys.push(`cookie:${cookieId}`);
  }
  keys.push(`ip:${hashIpUa(req)}`);
  const email = contactEmail?.trim().toLowerCase();
  if (email) keys.push(`email:${email}`);
  const session = (req as Request & { session?: { admin?: boolean; email?: string } }).session;
  if (session?.admin && session.email) {
    keys.push(`admin:${session.email.trim().toLowerCase()}`);
  }
  return keys;
}

export function ensureFeedbackSubmitterCookie(req: Request, res: Response): string {
  const cookies = parseCookieHeader(req.headers.cookie);
  let id = cookies[FEEDBACK_SUBMITTER_COOKIE];
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    id = crypto.randomUUID();
    const secure = (process.env.APP_URL || '').startsWith('https://');
    res.append(
      'Set-Cookie',
      `${FEEDBACK_SUBMITTER_COOKIE}=${id}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${
        secure ? '; Secure' : ''
      }`
    );
  }
  return id;
}

function countForKey(db: Db, submitterKey: string, day: string): number {
  const row = db
    .prepare(
      'SELECT submission_count AS c FROM feedback_daily_usage WHERE submitter_key = ? AND day_utc = ?'
    )
    .get(submitterKey, day) as { c: number } | undefined;
  return row?.c ?? 0;
}

export function getFeedbackQuota(db: Db, submitterKeys: string[]): FeedbackQuota {
  const limit = feedbackDailyLimit();
  const day = utcDay();
  let used = 0;
  for (const key of submitterKeys) {
    used = Math.max(used, countForKey(db, key, day));
  }
  const remaining = Math.max(0, limit - used);
  return {
    limit,
    used,
    remaining,
    resetAt: nextUtcMidnightIso()
  };
}

export function checkFeedbackRateLimit(
  db: Db,
  submitterKeys: string[]
): { allowed: true; quota: FeedbackQuota } | { allowed: false; quota: FeedbackQuota } {
  const quota = getFeedbackQuota(db, submitterKeys);
  if (quota.remaining <= 0) {
    return { allowed: false, quota };
  }
  return { allowed: true, quota };
}

export function recordFeedbackSubmission(db: Db, submitterKeys: string[]): void {
  const day = utcDay();
  const stmt = db.prepare(`
    INSERT INTO feedback_daily_usage (submitter_key, day_utc, submission_count)
    VALUES (?, ?, 1)
    ON CONFLICT(submitter_key, day_utc) DO UPDATE SET
      submission_count = submission_count + 1
  `);
  const tx = db.transaction(() => {
    for (const key of submitterKeys) {
      stmt.run(key, day);
    }
  });
  tx();
}
