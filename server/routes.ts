import { Router, type NextFunction, type Request, type Response } from 'express';
import multer, { MulterError } from 'multer';
import { randomUUID } from 'crypto';
import type { Db } from './db';
import {
  rowToFont,
  rowToKeyboard,
  rowToFeedback,
  rowToFeedbackAttachment,
  rowToPreset,
  rowToScriptStyle,
  loadFontPresetConfigs
} from './db';
import { requireAdmin, loginAdmin, logoutAdmin, meAdmin } from './auth';
import { storeUpload, deleteStoredFile } from './storage';
import { sendFeedbackEmail } from './email';
import {
  checkFeedbackRateLimit,
  ensureFeedbackSubmitterCookie,
  getFeedbackQuota,
  recordFeedbackSubmission,
  resolveSubmitterKeys
} from './feedbackRateLimit';
import { readPublicSiteSettings, setCompareBoldnessEnabled } from './siteSettings';
import type { KeyboardBundleImportResult } from './keyboardBundleImport';
import {
  matchFontIds,
  parseKeyboardBundleBuffer
} from './keyboardBundleImport';
import { isKeyMapLayout } from '../src/utils/keyboardLayout';

function fontWithConfigs(db: Db, row: Record<string, unknown>) {
  return rowToFont(row, loadFontPresetConfigs(db, row.id as string));
}

function replaceFontPresetConfigs(
  db: Db,
  fontId: string,
  configs: Array<{
    presetId: string;
    enabled?: boolean;
    contentOverride?: string | null;
    excludedChars?: string;
  }>
) {
  db.prepare('DELETE FROM font_preset_configs WHERE font_id = ?').run(fontId);
  const insert = db.prepare(`
    INSERT INTO font_preset_configs (font_id, preset_id, enabled, content_override, excluded_chars)
    VALUES (@font_id, @preset_id, @enabled, @content_override, @excluded_chars)
  `);
  for (const c of configs) {
    if (!c?.presetId) continue;
    insert.run({
      font_id: fontId,
      preset_id: c.presetId,
      enabled: c.enabled === false ? 0 : 1,
      content_override: c.contentOverride?.trim() ? c.contentOverride.trim() : null,
      excluded_chars: c.excludedChars || ''
    });
  }
}

function ensureSpecialFontDefaultConfigs(db: Db, fontId: string) {
  const existing = db
    .prepare('SELECT COUNT(*) as c FROM font_preset_configs WHERE font_id = ?')
    .get(fontId) as { c: number };
  if (existing.c > 0) return;
  const presets = db
    .prepare("SELECT id FROM presets WHERE status = 'published' ORDER BY sort_order ASC")
    .all() as { id: string }[];
  const insert = db.prepare(`
    INSERT INTO font_preset_configs (font_id, preset_id, enabled, content_override, excluded_chars)
    VALUES (?, ?, 1, NULL, '')
  `);
  for (const p of presets) {
    insert.run(fontId, p.id);
  }
}

/** Bodyig bundles and font packages can be large (Mac + Win + fonts). */
const MAX_ADMIN_UPLOAD_BYTES = 300 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_ADMIN_UPLOAD_BYTES }
});

function uploadSingle(field: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(field)(req, res, (err: unknown) => {
      if (!err) {
        next();
        return;
      }
      if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const maxMb = Math.round(MAX_ADMIN_UPLOAD_BYTES / (1024 * 1024));
          res.status(413).json({
            error: `Package is too large (max ${maxMb} MB). Try zipping only the Mac folder (Monlam.Bodyig.*.Mac).`
          });
          return;
        }
        res.status(400).json({ error: err.message });
        return;
      }
      next(err);
    });
  };
}

const feedbackUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024, files: 5 }
});

const FEEDBACK_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
]);
const FEEDBACK_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime'
]);
const FEEDBACK_ALLOWED = new Set([...FEEDBACK_IMAGE_TYPES, ...FEEDBACK_VIDEO_TYPES]);

function loadFeedback(db: Db, id: string) {
  const row = db.prepare('SELECT * FROM feedback WHERE id = ?').get(id) as
    | Record<string, unknown>
    | undefined;
  if (!row) return null;
  const attachments = (
    db
      .prepare('SELECT * FROM feedback_attachments WHERE feedback_id = ? ORDER BY created_at ASC')
      .all(id) as Record<string, unknown>[]
  ).map(rowToFeedbackAttachment);
  return rowToFeedback(row, attachments);
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function scriptStyleExists(db: Db, categoryId: string): boolean {
  if (!categoryId?.trim()) return false;
  const row = db.prepare('SELECT id FROM script_styles WHERE id = ?').get(categoryId.trim());
  return Boolean(row);
}

function assertScriptStyle(db: Db, categoryId: string | undefined, fallback: string): string {
  const id = (categoryId || fallback).trim();
  if (!scriptStyleExists(db, id)) {
    throw new Error(`Unknown script style “${id}”. Add it under Admin → Script styles first.`);
  }
  return id;
}

function listScriptStylesWithCounts(db: Db) {
  const rows = db
    .prepare('SELECT * FROM script_styles ORDER BY sort_order ASC, name ASC')
    .all() as Record<string, unknown>[];
  return rows.map((row) => {
    const countRow = db
      .prepare('SELECT COUNT(*) AS c FROM fonts WHERE category = ?')
      .get(row.id as string) as { c: number };
    return rowToScriptStyle(row, countRow.c);
  });
}

export function createAdminRouter(db: Db) {
  const router = Router();

  router.post('/login', loginAdmin);
  router.post('/logout', logoutAdmin);
  router.get('/me', meAdmin);

  router.use(requireAdmin);

  // —— Fonts ——
  router.get('/fonts', (_req, res) => {
    const rows = db.prepare('SELECT * FROM fonts ORDER BY sort_order ASC, name ASC').all() as Record<
      string,
      unknown
    >[];
    res.json(rows.map((r) => fontWithConfigs(db, r)));
  });

  router.get('/fonts/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!row) {
      res.status(404).json({ error: 'Font not found' });
      return;
    }
    res.json(fontWithConfigs(db, row));
  });

  router.post('/fonts', (req, res) => {
    const body = req.body || {};
    const now = new Date().toISOString();
    let category: string;
    try {
      category = assertScriptStyle(db, body.category, 'Uchen');
    } catch (e) {
      res.status(400).json({ error: e instanceof Error ? e.message : 'Invalid script style' });
      return;
    }
    const id = body.id || `${slugify(body.name || 'font')}-${randomUUID().slice(0, 8)}`;
    const cssClass =
      body.cssClass ||
      `font-cms-${id.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}`;
    const fontKind = body.fontKind === 'special' ? 'special' : 'normal';
    const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM fonts').get() as {
      m: number;
    };
    const sortOrder =
      body.sortOrder !== undefined && body.sortOrder !== null
        ? Number(body.sortOrder) || 0
        : maxOrder.m + 1;

    db.prepare(`
      INSERT INTO fonts (
        id, name, tibetan_name, category, font_kind, designer, release_year, version,
        description, tibetan_description, css_class, styles_count, weights,
        features, file_size, filename, sample_text, tags, metrics,
        supported_scripts, status, keyboard_id, sort_order, created_at, updated_at
      ) VALUES (
        @id, @name, @tibetan_name, @category, @font_kind, @designer, @release_year, @version,
        @description, @tibetan_description, @css_class, @styles_count, @weights,
        @features, '', @filename, @sample_text, @tags, @metrics,
        @supported_scripts, @status, @keyboard_id, @sort_order, @created_at, @updated_at
      )
    `).run({
      id,
      name: body.name || 'Untitled Font',
      tibetan_name: body.tibetanName || '',
      category,
      font_kind: fontKind,
      designer: body.designer || '',
      release_year: body.releaseYear || String(new Date().getFullYear()),
      version: body.version || '1.0.0',
      description: body.description || '',
      tibetan_description: body.tibetanDescription || '',
      css_class: cssClass,
      styles_count: body.stylesCount ?? 1,
      weights: JSON.stringify(body.weights || [400]),
      features: JSON.stringify(body.features || []),
      filename: body.filename || `${id}.ttf`,
      sample_text:
        body.sampleText ||
        'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ། བོད་ཀྱི་ཡི་གེ་ནི་འཛམ་གླིང་གི་རིག་གཞུང་བང་མཛོད་ཆེན་པོ་ཞིག་ཡིན།',
      tags: JSON.stringify(body.tags || []),
      metrics: JSON.stringify(
        body.metrics || {
          ascenderRatio: 1.25,
          descenderRatio: 1.45,
          strokeContrast: 'Medium',
          strokeType: 'Calligraphic Reed Pen',
          spacing: 'Standard'
        }
      ),
      supported_scripts: JSON.stringify(body.supportedScripts || ['Tibetan']),
      status: body.status === 'published' ? 'published' : 'draft',
      keyboard_id: body.keyboardId || null,
      sort_order: sortOrder,
      created_at: now,
      updated_at: now
    });

    if (body.keyboardId) {
      db.prepare(
        'INSERT OR IGNORE INTO font_keyboards (font_id, keyboard_id) VALUES (?, ?)'
      ).run(id, body.keyboardId);
    }

    if (Array.isArray(body.presetConfigs)) {
      replaceFontPresetConfigs(db, id, body.presetConfigs);
    } else if (fontKind === 'special') {
      ensureSpecialFontDefaultConfigs(db, id);
    }

    const row = db.prepare('SELECT * FROM fonts WHERE id = ?').get(id) as Record<string, unknown>;
    res.status(201).json(fontWithConfigs(db, row));
  });

  router.put('/fonts/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Font not found' });
      return;
    }
    const body = req.body || {};
    const now = new Date().toISOString();
    let category = String(existing.category || 'Uchen');
    if (body.category !== undefined) {
      try {
        category = assertScriptStyle(db, body.category, category);
      } catch (e) {
        res.status(400).json({ error: e instanceof Error ? e.message : 'Invalid script style' });
        return;
      }
    }
    const fontKind =
      body.fontKind === 'special'
        ? 'special'
        : body.fontKind === 'normal'
          ? 'normal'
          : (existing.font_kind as string) === 'special'
            ? 'special'
            : 'normal';

    db.prepare(`
      UPDATE fonts SET
        name = @name,
        tibetan_name = @tibetan_name,
        category = @category,
        font_kind = @font_kind,
        designer = @designer,
        release_year = @release_year,
        version = @version,
        description = @description,
        tibetan_description = @tibetan_description,
        css_class = @css_class,
        styles_count = @styles_count,
        weights = @weights,
        features = @features,
        filename = @filename,
        sample_text = @sample_text,
        tags = @tags,
        metrics = @metrics,
        supported_scripts = @supported_scripts,
        status = @status,
        keyboard_id = @keyboard_id,
        sort_order = @sort_order,
        updated_at = @updated_at
      WHERE id = @id
    `).run({
      id: req.params.id,
      name: body.name ?? existing.name,
      tibetan_name: body.tibetanName ?? existing.tibetan_name,
      category,
      font_kind: fontKind,
      designer: body.designer ?? existing.designer,
      release_year: body.releaseYear ?? existing.release_year,
      version: body.version ?? existing.version,
      description: body.description ?? existing.description,
      tibetan_description: body.tibetanDescription ?? existing.tibetan_description,
      css_class: body.cssClass ?? existing.css_class,
      styles_count: body.stylesCount ?? existing.styles_count,
      weights: JSON.stringify(body.weights ?? JSON.parse(String(existing.weights))),
      features: JSON.stringify(body.features ?? JSON.parse(String(existing.features))),
      filename: body.filename ?? existing.filename,
      sample_text: body.sampleText ?? existing.sample_text,
      tags: JSON.stringify(body.tags ?? JSON.parse(String(existing.tags))),
      metrics: JSON.stringify(body.metrics ?? JSON.parse(String(existing.metrics))),
      supported_scripts: JSON.stringify(
        body.supportedScripts ?? JSON.parse(String(existing.supported_scripts))
      ),
      status: body.status ?? existing.status,
      keyboard_id: body.keyboardId === undefined ? existing.keyboard_id : body.keyboardId,
      sort_order:
        body.sortOrder !== undefined && body.sortOrder !== null
          ? Number(body.sortOrder) || 0
          : Number(existing.sort_order ?? 0),
      updated_at: now
    });

    if (body.keyboardId !== undefined) {
      db.prepare('DELETE FROM font_keyboards WHERE font_id = ?').run(req.params.id);
      if (body.keyboardId) {
        db.prepare(
          'INSERT OR IGNORE INTO font_keyboards (font_id, keyboard_id) VALUES (?, ?)'
        ).run(req.params.id, body.keyboardId);
      }
    }

    if (Array.isArray(body.presetConfigs)) {
      replaceFontPresetConfigs(db, req.params.id, body.presetConfigs);
    } else if (fontKind === 'special') {
      ensureSpecialFontDefaultConfigs(db, req.params.id);
    } else if (fontKind === 'normal' && body.fontKind === 'normal') {
      // Switching back to normal clears exception rows
      db.prepare('DELETE FROM font_preset_configs WHERE font_id = ?').run(req.params.id);
    }

    const row = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as Record<
      string,
      unknown
    >;
    res.json(fontWithConfigs(db, row));
  });

  router.put('/fonts/:id/preset-configs', (req, res) => {
    const existing = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Font not found' });
      return;
    }
    const configs = Array.isArray(req.body?.presetConfigs) ? req.body.presetConfigs : req.body;
    if (!Array.isArray(configs)) {
      res.status(400).json({ error: 'presetConfigs array required' });
      return;
    }
    replaceFontPresetConfigs(db, req.params.id, configs);
    if ((existing.font_kind as string) !== 'special') {
      db.prepare("UPDATE fonts SET font_kind = 'special', updated_at = ? WHERE id = ?").run(
        new Date().toISOString(),
        req.params.id
      );
    } else {
      db.prepare('UPDATE fonts SET updated_at = ? WHERE id = ?').run(
        new Date().toISOString(),
        req.params.id
      );
    }
    const row = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as Record<
      string,
      unknown
    >;
    res.json(fontWithConfigs(db, row));
  });

  router.patch('/fonts/:id/publish', (req, res) => {
    const existing = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Font not found' });
      return;
    }
    const status = req.body?.status === 'published' ? 'published' : 'draft';
    db.prepare('UPDATE fonts SET status = ?, updated_at = ? WHERE id = ?').run(
      status,
      new Date().toISOString(),
      req.params.id
    );
    const row = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as Record<
      string,
      unknown
    >;
    res.json(fontWithConfigs(db, row));
  });

  router.post('/fonts/:id/upload', uploadSingle('file'), async (req, res) => {
    try {
      const existing = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as
        | Record<string, unknown>
        | undefined;
      if (!existing) {
        res.status(404).json({ error: 'Font not found' });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const stored = await storeUpload(req.file, 'fonts');
      await deleteStoredFile(existing.s3_key as string | null);
      db.prepare(`
        UPDATE fonts SET s3_key = ?, file_url = ?, file_size = ?, filename = ?, updated_at = ?
        WHERE id = ?
      `).run(
        stored.storageKey,
        stored.fileUrl,
        stored.fileSize,
        stored.filename,
        new Date().toISOString(),
        req.params.id
      );
      const row = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as Record<
        string,
        unknown
      >;
      res.json(fontWithConfigs(db, row));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  router.put('/fonts/:id/keyboard', (req, res) => {
    const existing = db.prepare('SELECT id FROM fonts WHERE id = ?').get(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Font not found' });
      return;
    }
    const keyboardId = req.body?.keyboardId ?? null;
    db.prepare('DELETE FROM font_keyboards WHERE font_id = ?').run(req.params.id);
    if (keyboardId) {
      const kb = db.prepare('SELECT id FROM keyboards WHERE id = ?').get(keyboardId);
      if (!kb) {
        res.status(400).json({ error: 'Keyboard not found' });
        return;
      }
      db.prepare(
        'INSERT INTO font_keyboards (font_id, keyboard_id) VALUES (?, ?)'
      ).run(req.params.id, keyboardId);
    }
    db.prepare('UPDATE fonts SET keyboard_id = ?, updated_at = ? WHERE id = ?').run(
      keyboardId,
      new Date().toISOString(),
      req.params.id
    );
    const row = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as Record<
      string,
      unknown
    >;
    res.json(fontWithConfigs(db, row));
  });

  router.delete('/fonts/:id', async (req, res) => {
    const existing = db.prepare('SELECT * FROM fonts WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Font not found' });
      return;
    }
    await deleteStoredFile(existing.s3_key as string | null);
    db.prepare('DELETE FROM fonts WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  // —— Keyboards ——
  router.get('/keyboards', (_req, res) => {
    const rows = db.prepare('SELECT * FROM keyboards ORDER BY updated_at DESC').all() as Record<
      string,
      unknown
    >[];
    const result = rows.map((r) => {
      const links = db
        .prepare('SELECT font_id FROM font_keyboards WHERE keyboard_id = ?')
        .all(r.id) as { font_id: string }[];
      return rowToKeyboard(
        r,
        links.map((l) => l.font_id)
      );
    });
    res.json(result);
  });

  router.get('/keyboards/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM keyboards WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!row) {
      res.status(404).json({ error: 'Keyboard not found' });
      return;
    }
    const links = db
      .prepare('SELECT font_id FROM font_keyboards WHERE keyboard_id = ?')
      .all(req.params.id) as { font_id: string }[];
    res.json(rowToKeyboard(row, links.map((l) => l.font_id)));
  });

  router.post('/keyboards', (req, res) => {
    const body = req.body || {};
    const now = new Date().toISOString();
    const id = body.id || `${slugify(body.name || 'keyboard')}-${randomUUID().slice(0, 8)}`;
    db.prepare(`
      INSERT INTO keyboards (
        id, name, tibetan_name, description, layout_type, script, version,
        status, layout_json, layout_json_mac, layout_json_windows, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      body.name || 'Untitled Keyboard',
      body.tibetanName || '',
      body.description || '',
      body.layoutType || 'Sambhota QWERTY',
      body.script || 'Tibetan',
      body.version || '1.0.0',
      body.status === 'published' ? 'published' : 'draft',
      (body.layoutJsonMac ?? body.layoutJson)
        ? JSON.stringify(body.layoutJsonMac ?? body.layoutJson)
        : null,
      body.layoutJsonMac
        ? JSON.stringify(body.layoutJsonMac)
        : body.layoutJson
          ? JSON.stringify(body.layoutJson)
          : null,
      body.layoutJsonWindows ? JSON.stringify(body.layoutJsonWindows) : null,
      now,
      now
    );

    if (Array.isArray(body.fontIds)) {
      const ins = db.prepare(
        'INSERT OR IGNORE INTO font_keyboards (font_id, keyboard_id) VALUES (?, ?)'
      );
      for (const fontId of body.fontIds) {
        ins.run(fontId, id);
        db.prepare('UPDATE fonts SET keyboard_id = ? WHERE id = ?').run(id, fontId);
      }
    }

    const row = db.prepare('SELECT * FROM keyboards WHERE id = ?').get(id) as Record<
      string,
      unknown
    >;
    const links = db
      .prepare('SELECT font_id FROM font_keyboards WHERE keyboard_id = ?')
      .all(id) as { font_id: string }[];
    res.status(201).json(rowToKeyboard(row, links.map((l) => l.font_id)));
  });

  router.put('/keyboards/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM keyboards WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Keyboard not found' });
      return;
    }
    const body = req.body || {};
    const macLayout =
      body.layoutJsonMac !== undefined
        ? body.layoutJsonMac
        : body.layoutJson !== undefined
          ? body.layoutJson
          : undefined;
    const windowsLayout =
      body.layoutJsonWindows !== undefined ? body.layoutJsonWindows : undefined;
    const legacyLayout = macLayout !== undefined ? macLayout : undefined;

    db.prepare(`
      UPDATE keyboards SET
        name = ?, tibetan_name = ?, description = ?, layout_type = ?,
        script = ?, version = ?, status = ?, layout_json = ?,
        layout_json_mac = ?, layout_json_windows = ?, updated_at = ?
      WHERE id = ?
    `).run(
      body.name ?? existing.name,
      body.tibetanName ?? existing.tibetan_name,
      body.description ?? existing.description,
      body.layoutType ?? existing.layout_type,
      body.script ?? existing.script,
      body.version ?? existing.version,
      body.status ?? existing.status,
      legacyLayout !== undefined
        ? legacyLayout
          ? JSON.stringify(legacyLayout)
          : null
        : existing.layout_json,
      macLayout !== undefined
        ? macLayout
          ? JSON.stringify(macLayout)
          : null
        : existing.layout_json_mac ?? existing.layout_json,
      windowsLayout !== undefined
        ? windowsLayout
          ? JSON.stringify(windowsLayout)
          : null
        : existing.layout_json_windows ?? existing.layout_json,
      new Date().toISOString(),
      req.params.id
    );

    if (Array.isArray(body.fontIds)) {
      db.prepare('DELETE FROM font_keyboards WHERE keyboard_id = ?').run(req.params.id);
      db.prepare('UPDATE fonts SET keyboard_id = NULL WHERE keyboard_id = ?').run(req.params.id);
      const ins = db.prepare(
        'INSERT OR IGNORE INTO font_keyboards (font_id, keyboard_id) VALUES (?, ?)'
      );
      for (const fontId of body.fontIds) {
        ins.run(fontId, req.params.id);
        db.prepare('UPDATE fonts SET keyboard_id = ? WHERE id = ?').run(req.params.id, fontId);
      }
    }

    const row = db.prepare('SELECT * FROM keyboards WHERE id = ?').get(req.params.id) as Record<
      string,
      unknown
    >;
    const links = db
      .prepare('SELECT font_id FROM font_keyboards WHERE keyboard_id = ?')
      .all(req.params.id) as { font_id: string }[];
    res.json(rowToKeyboard(row, links.map((l) => l.font_id)));
  });

  router.patch('/keyboards/:id/publish', (req, res) => {
    const existing = db.prepare('SELECT * FROM keyboards WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Keyboard not found' });
      return;
    }
    const status = req.body?.status === 'published' ? 'published' : 'draft';
    db.prepare('UPDATE keyboards SET status = ?, updated_at = ? WHERE id = ?').run(
      status,
      new Date().toISOString(),
      req.params.id
    );
    const row = db.prepare('SELECT * FROM keyboards WHERE id = ?').get(req.params.id) as Record<
      string,
      unknown
    >;
    const links = db
      .prepare('SELECT font_id FROM font_keyboards WHERE keyboard_id = ?')
      .all(req.params.id) as { font_id: string }[];
    res.json(rowToKeyboard(row, links.map((l) => l.font_id)));
  });

  function keyboardImportResponse(parsed: KeyboardBundleImportResult) {
    const fontRows = db.prepare('SELECT id, name, filename FROM fonts').all() as {
      id: string;
      name: string;
      filename: string;
    }[];
    const suggestedFontIds = matchFontIds(parsed.fontFilenames, fontRows);
    return { ...parsed, suggestedFontIds };
  }

  router.post('/keyboards/import-parsed', (req, res) => {
    try {
      const body = req.body as KeyboardBundleImportResult | undefined;
      if (
        !body?.name ||
        !body.version ||
        !isKeyMapLayout(body.layoutJsonMac) ||
        !isKeyMapLayout(body.layoutJsonWindows)
      ) {
        res.status(400).json({ error: 'Invalid import payload' });
        return;
      }
      res.json(keyboardImportResponse(body));
    } catch (err) {
      console.error(err);
      res.status(400).json({
        error: err instanceof Error ? err.message : 'Could not import keyboard metadata'
      });
    }
  });

  router.post('/keyboards/import-bundle', uploadSingle('file'), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const parsed = await parseKeyboardBundleBuffer(req.file.buffer, req.file.originalname);
      res.json(keyboardImportResponse(parsed));
    } catch (err) {
      console.error(err);
      res.status(400).json({
        error: err instanceof Error ? err.message : 'Could not read keyboard package'
      });
    }
  });

  router.post('/keyboards/:id/upload', uploadSingle('file'), async (req, res) => {
    try {
      const existing = db.prepare('SELECT * FROM keyboards WHERE id = ?').get(req.params.id) as
        | Record<string, unknown>
        | undefined;
      if (!existing) {
        res.status(404).json({ error: 'Keyboard not found' });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const stored = await storeUpload(req.file, 'keyboards');
      await deleteStoredFile(existing.s3_key as string | null);

      let layoutMac = existing.layout_json_mac ?? existing.layout_json;
      let layoutWin = existing.layout_json_windows;
      const name = existing.name as string;
      let version = existing.version as string;
      let description = existing.description as string;
      const lower = req.file.originalname.toLowerCase();
      if (lower.endsWith('.zip') || lower.endsWith('.keylayout') || lower.endsWith('.keylayout.xml')) {
        try {
          const parsed = await parseKeyboardBundleBuffer(req.file.buffer, req.file.originalname);
          layoutMac = JSON.stringify(parsed.layoutJsonMac);
          layoutWin = JSON.stringify(parsed.layoutJsonWindows);
          version = parsed.version || version;
          description = parsed.description || description;
        } catch (parseErr) {
          console.warn('Keyboard package stored but layout auto-import failed:', parseErr);
        }
      }

      db.prepare(`
        UPDATE keyboards SET s3_key = ?, file_url = ?, layout_json = ?, layout_json_mac = ?, layout_json_windows = ?,
          version = ?, description = ?, updated_at = ? WHERE id = ?
      `).run(
        stored.storageKey,
        stored.fileUrl,
        layoutMac,
        layoutMac,
        layoutWin,
        version,
        description,
        new Date().toISOString(),
        req.params.id
      );
      const row = db.prepare('SELECT * FROM keyboards WHERE id = ?').get(req.params.id) as Record<
        string,
        unknown
      >;
      const links = db
        .prepare('SELECT font_id FROM font_keyboards WHERE keyboard_id = ?')
        .all(req.params.id) as { font_id: string }[];
      res.json(rowToKeyboard(row, links.map((l) => l.font_id)));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  router.delete('/keyboards/:id', async (req, res) => {
    const existing = db.prepare('SELECT * FROM keyboards WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Keyboard not found' });
      return;
    }
    await deleteStoredFile(existing.s3_key as string | null);
    db.prepare('UPDATE fonts SET keyboard_id = NULL WHERE keyboard_id = ?').run(req.params.id);
    db.prepare('DELETE FROM keyboards WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  router.get('/site-settings', (_req, res) => {
    res.json(readPublicSiteSettings(db));
  });

  router.patch('/site-settings', (req, res) => {
    const enabled = req.body?.compareBoldnessEnabled;
    if (typeof enabled !== 'boolean') {
      res.status(400).json({ error: 'compareBoldnessEnabled must be a boolean.' });
      return;
    }
    res.json(setCompareBoldnessEnabled(db, enabled));
  });

  router.get('/stats', (_req, res) => {
    const fonts = db.prepare('SELECT COUNT(*) as c FROM fonts').get() as { c: number };
    const publishedFonts = db
      .prepare("SELECT COUNT(*) as c FROM fonts WHERE status = 'published'")
      .get() as { c: number };
    const keyboards = db.prepare('SELECT COUNT(*) as c FROM keyboards').get() as { c: number };
    const publishedKeyboards = db
      .prepare("SELECT COUNT(*) as c FROM keyboards WHERE status = 'published'")
      .get() as { c: number };
    const feedback = db.prepare('SELECT COUNT(*) as c FROM feedback').get() as { c: number };
    const newFeedback = db
      .prepare("SELECT COUNT(*) as c FROM feedback WHERE status = 'new'")
      .get() as { c: number };
    res.json({
      fonts: fonts.c,
      publishedFonts: publishedFonts.c,
      draftFonts: fonts.c - publishedFonts.c,
      keyboards: keyboards.c,
      publishedKeyboards: publishedKeyboards.c,
      draftKeyboards: keyboards.c - publishedKeyboards.c,
      feedback: feedback.c,
      newFeedback: newFeedback.c
    });
  });

  // —— Script styles ——
  router.get('/script-styles', (_req, res) => {
    res.json(listScriptStylesWithCounts(db));
  });

  router.get('/script-styles/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM script_styles WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!row) {
      res.status(404).json({ error: 'Script style not found' });
      return;
    }
    const countRow = db
      .prepare('SELECT COUNT(*) AS c FROM fonts WHERE category = ?')
      .get(req.params.id) as { c: number };
    res.json(rowToScriptStyle(row, countRow.c));
  });

  router.post('/script-styles', (req, res) => {
    const body = req.body || {};
    const now = new Date().toISOString();
    const name = String(body.name || '').trim();
    if (!name) {
      res.status(400).json({ error: 'English name is required' });
      return;
    }
    const rawId = String(body.id || '').trim();
    const id = rawId || slugify(name) || `style-${randomUUID().slice(0, 8)}`;
    const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM script_styles').get() as {
      m: number;
    };
    try {
      db.prepare(`
        INSERT INTO script_styles (id, name, tibetan_name, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        id,
        name,
        body.tibetanName || '',
        body.sortOrder ?? maxOrder.m + 1,
        now,
        now
      );
    } catch (e) {
      res.status(400).json({
        error: e instanceof Error ? e.message : 'Could not create script style (duplicate id?)'
      });
      return;
    }
    const row = db.prepare('SELECT * FROM script_styles WHERE id = ?').get(id) as Record<
      string,
      unknown
    >;
    res.status(201).json(rowToScriptStyle(row, 0));
  });

  router.put('/script-styles/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM script_styles WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Script style not found' });
      return;
    }
    const body = req.body || {};
    const now = new Date().toISOString();
    const newId = String(body.newId || '').trim();
    const id = req.params.id;

    if (newId && newId !== id) {
      if (db.prepare('SELECT id FROM script_styles WHERE id = ?').get(newId)) {
        res.status(400).json({ error: 'Another script style already uses that id' });
        return;
      }
      const tx = db.transaction(() => {
        db.prepare(`
          INSERT INTO script_styles (id, name, tibetan_name, sort_order, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          newId,
          body.name ?? existing.name,
          body.tibetanName ?? existing.tibetan_name,
          body.sortOrder ?? existing.sort_order,
          existing.created_at,
          now
        );
        db.prepare('UPDATE fonts SET category = ? WHERE category = ?').run(newId, id);
        db.prepare('DELETE FROM script_styles WHERE id = ?').run(id);
      });
      try {
        tx();
      } catch (e) {
        res.status(400).json({ error: e instanceof Error ? e.message : 'Could not rename id' });
        return;
      }
      const row = db.prepare('SELECT * FROM script_styles WHERE id = ?').get(newId) as Record<
        string,
        unknown
      >;
      const countRow = db.prepare('SELECT COUNT(*) AS c FROM fonts WHERE category = ?').get(newId) as {
        c: number;
      };
      res.json(rowToScriptStyle(row, countRow.c));
      return;
    }

    db.prepare(`
      UPDATE script_styles SET
        name = ?,
        tibetan_name = ?,
        sort_order = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      body.name ?? existing.name,
      body.tibetanName ?? existing.tibetan_name,
      body.sortOrder ?? existing.sort_order,
      now,
      id
    );
    const row = db.prepare('SELECT * FROM script_styles WHERE id = ?').get(id) as Record<
      string,
      unknown
    >;
    const countRow = db.prepare('SELECT COUNT(*) AS c FROM fonts WHERE category = ?').get(id) as {
      c: number;
    };
    res.json(rowToScriptStyle(row, countRow.c));
  });

  router.delete('/script-styles/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM script_styles WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Script style not found' });
      return;
    }
    const countRow = db.prepare('SELECT COUNT(*) AS c FROM fonts WHERE category = ?').get(
      req.params.id
    ) as { c: number };
    if (countRow.c > 0) {
      res.status(400).json({
        error: `${countRow.c} typeface(s) still use this style. Reassign them in Fonts or below before deleting.`
      });
      return;
    }
    db.prepare('DELETE FROM script_styles WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  router.put('/script-styles/:id/fonts', (req, res) => {
    const styleId = req.params.id;
    if (!db.prepare('SELECT id FROM script_styles WHERE id = ?').get(styleId)) {
      res.status(404).json({ error: 'Script style not found' });
      return;
    }
    const fontIds = Array.isArray(req.body?.fontIds)
      ? (req.body.fontIds as unknown[]).map((x) => String(x)).filter(Boolean)
      : [];
    const now = new Date().toISOString();
    const update = db.prepare('UPDATE fonts SET category = ?, updated_at = ? WHERE id = ?');
    const tx = db.transaction(() => {
      for (const fontId of fontIds) {
        update.run(styleId, now, fontId);
      }
    });
    tx();
    const fonts = db
      .prepare('SELECT * FROM fonts WHERE category = ? ORDER BY sort_order ASC, name ASC')
      .all(styleId) as Record<string, unknown>[];
    res.json({
      styleId,
      fonts: fonts.map((r) => fontWithConfigs(db, r))
    });
  });

  // —— Presets ——
  router.get('/presets', (_req, res) => {
    const rows = db
      .prepare('SELECT * FROM presets ORDER BY sort_order ASC, title ASC')
      .all() as Record<string, unknown>[];
    res.json(rows.map(rowToPreset));
  });

  router.get('/presets/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM presets WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!row) {
      res.status(404).json({ error: 'Preset not found' });
      return;
    }
    res.json(rowToPreset(row));
  });

  router.post('/presets', (req, res) => {
    const body = req.body || {};
    const now = new Date().toISOString();
    const title = String(body.title || '').trim();
    const content = String(body.content || '').trim();
    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }
    const id =
      String(body.id || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '') || `${slugify(title)}-${randomUUID().slice(0, 6)}`;

    const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) as m FROM presets').get() as {
      m: number;
    };

    try {
      db.prepare(`
        INSERT INTO presets (
          id, title, tibetan_title, content, translation, sort_order, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        title,
        body.tibetanTitle || '',
        content,
        body.translation || '',
        body.sortOrder ?? maxOrder.m + 1,
        body.status === 'draft' ? 'draft' : 'published',
        now,
        now
      );
    } catch (e) {
      res.status(400).json({
        error: e instanceof Error ? e.message : 'Could not create preset (duplicate id?)'
      });
      return;
    }

    const row = db.prepare('SELECT * FROM presets WHERE id = ?').get(id) as Record<string, unknown>;
    res.status(201).json(rowToPreset(row));
  });

  router.put('/presets/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM presets WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Preset not found' });
      return;
    }
    const body = req.body || {};
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE presets SET
        title = ?,
        tibetan_title = ?,
        content = ?,
        translation = ?,
        sort_order = ?,
        status = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      body.title ?? existing.title,
      body.tibetanTitle ?? existing.tibetan_title,
      body.content ?? existing.content,
      body.translation ?? existing.translation,
      body.sortOrder ?? existing.sort_order,
      body.status === 'draft' || body.status === 'published' ? body.status : existing.status,
      now,
      req.params.id
    );
    const row = db.prepare('SELECT * FROM presets WHERE id = ?').get(req.params.id) as Record<
      string,
      unknown
    >;
    res.json(rowToPreset(row));
  });

  router.delete('/presets/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM presets WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Preset not found' });
      return;
    }
    db.prepare('DELETE FROM font_preset_configs WHERE preset_id = ?').run(req.params.id);
    db.prepare('DELETE FROM presets WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  // —— Feedback (CMS) ——
  router.get('/feedback', (req, res) => {
    const status = String(req.query.status || '');
    const rows = (
      status && ['new', 'reviewed', 'archived'].includes(status)
        ? db
            .prepare('SELECT * FROM feedback WHERE status = ? ORDER BY created_at DESC')
            .all(status)
        : db.prepare('SELECT * FROM feedback ORDER BY created_at DESC').all()
    ) as Record<string, unknown>[];

    const result = rows.map((row) => {
      const attachments = (
        db
          .prepare(
            'SELECT * FROM feedback_attachments WHERE feedback_id = ? ORDER BY created_at ASC'
          )
          .all(row.id as string) as Record<string, unknown>[]
      ).map(rowToFeedbackAttachment);
      return rowToFeedback(row, attachments);
    });
    res.json(result);
  });

  router.get('/feedback/:id', (req, res) => {
    const item = loadFeedback(db, req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    res.json(item);
  });

  router.patch('/feedback/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM feedback WHERE id = ?').get(req.params.id) as
      | Record<string, unknown>
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    const status = req.body?.status;
    if (!['new', 'reviewed', 'archived'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    db.prepare('UPDATE feedback SET status = ?, updated_at = ? WHERE id = ?').run(
      status,
      new Date().toISOString(),
      req.params.id
    );
    res.json(loadFeedback(db, req.params.id));
  });

  router.delete('/feedback/:id', async (req, res) => {
    const item = loadFeedback(db, req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    for (const att of item.attachments) {
      await deleteStoredFile(att.storageKey);
    }
    db.prepare('DELETE FROM feedback_attachments WHERE feedback_id = ?').run(req.params.id);
    db.prepare('DELETE FROM feedback WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  return router;
}

export function createPublicRouter(db: Db) {
  const router = Router();

  router.get('/site-settings', (_req, res) => {
    res.json(readPublicSiteSettings(db));
  });

  router.get('/presets', (req, res) => {
    const publishedOnly = req.query.published !== '0';
    const rows = (
      publishedOnly
        ? db.prepare(
            "SELECT * FROM presets WHERE status = 'published' ORDER BY sort_order ASC, title ASC"
          )
        : db.prepare('SELECT * FROM presets ORDER BY sort_order ASC, title ASC')
    ).all() as Record<string, unknown>[];
    res.json(rows.map(rowToPreset));
  });

  router.get('/script-styles', (_req, res) => {
    res.json(listScriptStylesWithCounts(db));
  });

  router.get('/fonts', (req, res) => {
    const publishedOnly = req.query.published !== '0';
    const rows = (
      publishedOnly
        ? db.prepare(
            "SELECT * FROM fonts WHERE status = 'published' ORDER BY sort_order ASC, name ASC"
          )
        : db.prepare('SELECT * FROM fonts ORDER BY sort_order ASC, name ASC')
    ).all() as Record<string, unknown>[];
    res.json(rows.map((r) => fontWithConfigs(db, r)));
  });

  router.get('/keyboards', (req, res) => {
    const publishedOnly = req.query.published !== '0';
    const rows = (
      publishedOnly
        ? db.prepare("SELECT * FROM keyboards WHERE status = 'published' ORDER BY name ASC")
        : db.prepare('SELECT * FROM keyboards ORDER BY name ASC')
    ).all() as Record<string, unknown>[];
    const result = rows.map((r) => {
      const links = db
        .prepare('SELECT font_id FROM font_keyboards WHERE keyboard_id = ?')
        .all(r.id) as { font_id: string }[];
      return rowToKeyboard(
        r,
        links.map((l) => l.font_id)
      );
    });
    res.json(result);
  });

  router.get('/feedback/quota', (req, res) => {
    const cookieId = ensureFeedbackSubmitterCookie(req, res);
    const contactEmail = String(req.query?.contactEmail || '').trim() || null;
    const keys = resolveSubmitterKeys(req, contactEmail, cookieId);
    const quota = getFeedbackQuota(db, keys);
    res.json(quota);
  });

  /** Public feedback submission — always persists; email is best-effort. */
  router.post('/feedback', feedbackUpload.array('attachments', 5), async (req, res) => {
    try {
      const cookieId = ensureFeedbackSubmitterCookie(req, res);
      const message = String(req.body?.message || '').trim();
      const contactEmail = String(req.body?.contactEmail || req.body?.email || '').trim() || null;

      const submitterKeys = resolveSubmitterKeys(req, contactEmail, cookieId);
      const rate = checkFeedbackRateLimit(db, submitterKeys);
      if (!rate.allowed) {
        const limit = rate.quota.limit;
        res.status(429).json({
          error: `You have reached the maximum of ${limit} feedback submissions for today. Please try again after the daily limit resets.`,
          code: 'FEEDBACK_DAILY_LIMIT',
          limit,
          used: rate.quota.used,
          remaining: 0,
          resetAt: rate.quota.resetAt
        });
        return;
      }

      if (!message || message.length < 5) {
        res.status(400).json({ error: 'Please enter feedback of at least 5 characters.' });
        return;
      }
      if (message.length > 8000) {
        res.status(400).json({ error: 'Feedback is too long (max 8000 characters).' });
        return;
      }
      if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        res.status(400).json({ error: 'Please enter a valid contact email, or leave it blank.' });
        return;
      }

      const files = (req.files as Express.Multer.File[] | undefined) || [];
      for (const file of files) {
        const mime = file.mimetype || '';
        if (!FEEDBACK_ALLOWED.has(mime)) {
          res.status(400).json({
            error:
              'Invalid file type. Allowed: JPEG, PNG, GIF, WebP images and MP4, WebM, MOV videos.'
          });
          return;
        }
        if (file.size > 50 * 1024 * 1024) {
          res.status(400).json({ error: 'Each attachment must be 50 MB or smaller.' });
          return;
        }
      }

      const id = randomUUID();
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO feedback (id, message, contact_email, status, email_sent, email_error, created_at, updated_at)
        VALUES (?, ?, ?, 'new', 0, NULL, ?, ?)
      `).run(id, message, contactEmail, now, now);

      const storedAttachments: {
        filename: string;
        storageKey: string;
        mimeType: string;
      }[] = [];

      for (const file of files) {
        const stored = await storeUpload(file, 'feedback');
        const attId = randomUUID();
        db.prepare(`
          INSERT INTO feedback_attachments (
            id, feedback_id, filename, mime_type, file_size, storage_key, file_url, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          attId,
          id,
          stored.filename,
          file.mimetype,
          stored.fileSize,
          stored.storageKey,
          stored.fileUrl,
          now
        );
        storedAttachments.push({
          filename: stored.filename,
          storageKey: stored.storageKey,
          mimeType: file.mimetype
        });
      }

      recordFeedbackSubmission(db, submitterKeys);

      // Email is independent of CMS storage — never roll back saved feedback.
      const emailResult = await sendFeedbackEmail({
        id,
        message,
        contactEmail,
        createdAt: now,
        attachments: storedAttachments
      });

      db.prepare(
        'UPDATE feedback SET email_sent = ?, email_error = ?, updated_at = ? WHERE id = ?'
      ).run(emailResult.sent ? 1 : 0, emailResult.error || null, new Date().toISOString(), id);

      const saved = loadFeedback(db, id);
      const quota = getFeedbackQuota(db, submitterKeys);
      res.status(201).json({
        ok: true,
        feedback: saved,
        emailSent: emailResult.sent,
        emailWarning: emailResult.sent ? null : emailResult.error || 'Email could not be sent.',
        quota
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not submit feedback. Please try again.' });
    }
  });

  return router;
}
