import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDbPath = path.join(__dirname, 'data', 'cms.sqlite');
const repoRoot = path.join(__dirname, '..');

/** Relative DATABASE_PATH is anchored to the repo root, not process.cwd() (systemd-safe). */
export function resolveDatabasePath(configured?: string): string {
  const value = (configured ?? process.env.DATABASE_PATH ?? '').trim();
  if (!value) return defaultDbPath;
  if (path.isAbsolute(value)) return value;
  return path.normalize(path.join(repoRoot, value));
}

function ensureColumn(
  db: InstanceType<typeof Database>,
  table: string,
  column: string,
  definition: string
) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

export function openDatabase(dbPath?: string) {
  const resolvedPath = dbPath ? path.normalize(dbPath) : resolveDatabasePath();
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  const db = new Database(resolvedPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS fonts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tibetan_name TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Uchen',
      designer TEXT NOT NULL DEFAULT '',
      release_year TEXT NOT NULL DEFAULT '',
      version TEXT NOT NULL DEFAULT '1.0.0',
      description TEXT NOT NULL DEFAULT '',
      tibetan_description TEXT NOT NULL DEFAULT '',
      css_class TEXT NOT NULL DEFAULT '',
      styles_count INTEGER NOT NULL DEFAULT 1,
      weights TEXT NOT NULL DEFAULT '[400]',
      features TEXT NOT NULL DEFAULT '[]',
      file_size TEXT NOT NULL DEFAULT '',
      filename TEXT NOT NULL DEFAULT '',
      sample_text TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      metrics TEXT NOT NULL DEFAULT '{}',
      supported_scripts TEXT NOT NULL DEFAULT '["Tibetan"]',
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      s3_key TEXT,
      file_url TEXT,
      keyboard_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS keyboards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tibetan_name TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      layout_type TEXT NOT NULL DEFAULT 'Sambhota QWERTY',
      script TEXT NOT NULL DEFAULT 'Tibetan',
      version TEXT NOT NULL DEFAULT '1.0.0',
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      s3_key TEXT,
      file_url TEXT,
      layout_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS font_keyboards (
      font_id TEXT NOT NULL,
      keyboard_id TEXT NOT NULL,
      PRIMARY KEY (font_id, keyboard_id),
      FOREIGN KEY (font_id) REFERENCES fonts(id) ON DELETE CASCADE,
      FOREIGN KEY (keyboard_id) REFERENCES keyboards(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      message TEXT NOT NULL,
      contact_email TEXT,
      status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'reviewed', 'archived')),
      email_sent INTEGER NOT NULL DEFAULT 0,
      email_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS feedback_attachments (
      id TEXT PRIMARY KEY,
      feedback_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size TEXT NOT NULL DEFAULT '',
      storage_key TEXT NOT NULL,
      file_url TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback_daily_usage (
      submitter_key TEXT NOT NULL,
      day_utc TEXT NOT NULL,
      submission_count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (submitter_key, day_utc)
    );

    CREATE TABLE IF NOT EXISTS script_styles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tibetan_name TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS presets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tibetan_title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      translation TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft', 'published')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS font_preset_configs (
      font_id TEXT NOT NULL,
      preset_id TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      content_override TEXT,
      excluded_chars TEXT NOT NULL DEFAULT '',
      PRIMARY KEY (font_id, preset_id),
      FOREIGN KEY (font_id) REFERENCES fonts(id) ON DELETE CASCADE,
      FOREIGN KEY (preset_id) REFERENCES presets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  ensureColumn(db, 'fonts', 'font_kind', "TEXT NOT NULL DEFAULT 'normal'");
  ensureColumn(db, 'fonts', 'sort_order', 'INTEGER NOT NULL DEFAULT 0');
  ensureColumn(db, 'keyboards', 'layout_json_mac', 'TEXT');
  ensureColumn(db, 'keyboards', 'layout_json_windows', 'TEXT');
  db.exec(`
    UPDATE keyboards
    SET layout_json_mac = layout_json
    WHERE layout_json_mac IS NULL AND layout_json IS NOT NULL
  `);

  return db;
}

export type Db = ReturnType<typeof openDatabase>;

export function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export type FontPresetConfigRow = {
  presetId: string;
  enabled: boolean;
  contentOverride: string | null;
  excludedChars: string;
};

export function rowToFontPresetConfig(row: Record<string, unknown>): FontPresetConfigRow {
  return {
    presetId: row.preset_id as string,
    enabled: Boolean(row.enabled),
    contentOverride: (row.content_override as string) || null,
    excludedChars: (row.excluded_chars as string) || ''
  };
}

export function loadFontPresetConfigs(db: Db, fontId: string): FontPresetConfigRow[] {
  const rows = db
    .prepare(
      'SELECT * FROM font_preset_configs WHERE font_id = ? ORDER BY preset_id ASC'
    )
    .all(fontId) as Record<string, unknown>[];
  return rows.map(rowToFontPresetConfig);
}

export function rowToFont(
  row: Record<string, unknown>,
  presetConfigs: FontPresetConfigRow[] = []
) {
  const kind = (row.font_kind as string) === 'special' ? 'special' : 'normal';
  return {
    id: row.id as string,
    name: row.name as string,
    tibetanName: row.tibetan_name as string,
    category: row.category as string,
    fontKind: kind as 'normal' | 'special',
    designer: row.designer as string,
    releaseYear: row.release_year as string,
    version: row.version as string,
    description: row.description as string,
    tibetanDescription: row.tibetan_description as string,
    cssClass: row.css_class as string,
    stylesCount: Number(row.styles_count),
    weights: parseJson<number[]>(row.weights as string, [400]),
    features: parseJson<string[]>(row.features as string, []),
    fileSize: row.file_size as string,
    filename: row.filename as string,
    sampleText: row.sample_text as string,
    tags: parseJson<string[]>(row.tags as string, []),
    metrics: parseJson(row.metrics as string, {
      ascenderRatio: 1.25,
      descenderRatio: 1.45,
      strokeContrast: 'Medium',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Standard'
    }),
    supportedScripts: parseJson<string[]>(row.supported_scripts as string, ['Tibetan']),
    status: row.status as 'draft' | 'published',
    s3Key: (row.s3_key as string) || null,
    fileUrl: (row.file_url as string) || null,
    keyboardId: (row.keyboard_id as string) || null,
    sortOrder: Number(row.sort_order ?? 0),
    presetConfigs,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

export function rowToScriptStyle(row: Record<string, unknown>, fontCount?: number) {
  return {
    id: row.id as string,
    name: row.name as string,
    tibetanName: row.tibetan_name as string,
    sortOrder: Number(row.sort_order),
    ...(fontCount !== undefined ? { fontCount } : {}),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

export function rowToPreset(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    title: row.title as string,
    tibetanTitle: row.tibetan_title as string,
    content: row.content as string,
    translation: row.translation as string,
    sortOrder: Number(row.sort_order),
    status: row.status as 'draft' | 'published',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

export function rowToKeyboard(row: Record<string, unknown>, fontIds: string[] = []) {
  return {
    id: row.id as string,
    name: row.name as string,
    tibetanName: row.tibetan_name as string,
    description: row.description as string,
    layoutType: row.layout_type as string,
    script: row.script as string,
    version: row.version as string,
    status: row.status as 'draft' | 'published',
    s3Key: (row.s3_key as string) || null,
    fileUrl: (row.file_url as string) || null,
    layoutJson: parseJson(row.layout_json as string, null),
    layoutJsonMac:
      parseJson(row.layout_json_mac as string, null) || parseJson(row.layout_json as string, null),
    layoutJsonWindows: parseJson(row.layout_json_windows as string, null),
    fontIds,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

export function rowToFeedbackAttachment(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    feedbackId: row.feedback_id as string,
    filename: row.filename as string,
    mimeType: row.mime_type as string,
    fileSize: row.file_size as string,
    storageKey: row.storage_key as string,
    fileUrl: row.file_url as string,
    createdAt: row.created_at as string
  };
}

export function rowToFeedback(
  row: Record<string, unknown>,
  attachments: ReturnType<typeof rowToFeedbackAttachment>[] = []
) {
  return {
    id: row.id as string,
    message: row.message as string,
    contactEmail: (row.contact_email as string) || null,
    status: row.status as 'new' | 'reviewed' | 'archived',
    emailSent: Boolean(row.email_sent),
    emailError: (row.email_error as string) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    attachments
  };
}
