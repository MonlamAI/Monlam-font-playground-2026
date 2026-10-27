import type { Db } from './db';

export const SITE_SETTING_COMPARE_BOLDNESS = 'compare_boldness_enabled';

export type PublicSiteSettings = {
  compareBoldnessEnabled: boolean;
};

export function readPublicSiteSettings(db: Db): PublicSiteSettings {
  const row = db
    .prepare('SELECT value FROM site_settings WHERE key = ?')
    .get(SITE_SETTING_COMPARE_BOLDNESS) as { value: string } | undefined;
  return {
    compareBoldnessEnabled: row?.value === '1'
  };
}

export function setCompareBoldnessEnabled(db: Db, enabled: boolean): PublicSiteSettings {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO site_settings (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).run(SITE_SETTING_COMPARE_BOLDNESS, enabled ? '1' : '0', now);
  return readPublicSiteSettings(db);
}

export function ensureDefaultSiteSettings(db: Db) {
  const row = db
    .prepare('SELECT 1 FROM site_settings WHERE key = ?')
    .get(SITE_SETTING_COMPARE_BOLDNESS);
  if (!row) {
    setCompareBoldnessEnabled(db, false);
  }
}
