import type { Db } from './db';
import { DEFAULT_PRESET_ID, MONLAM_FONTS, PRESET_TEXTS } from '../src/data/fontsData.ts';
import {
  TIBETAN_KEYBOARD_LAYOUT,
  TIBETAN_KEYBOARD_LAYOUT_WINDOWS,
  TIBETAN_KEYBOARD_LAYOUT_BODYIG_31,
  TIBETAN_KEYBOARD_LAYOUT_BODYIG_31_WINDOWS
} from '../src/data/tibetanData.ts';

const DEFAULT_KEYBOARD_ID = 'monlam-bodyig-3.1';
const KEYBOARD_31_FILE = 'Monlam_Bodyig_3.1.exe';
const KEYBOARD_31_KEY = `keyboards/${KEYBOARD_31_FILE}`;
const KEYBOARD_31_URL = `/uploads/${KEYBOARD_31_KEY}`;

const KEYBOARD_2025_ID = 'monlam-bodyig-2025';
const KEYBOARD_2025_FILE = 'Monlam_Bodyig_2025_Mac_Keyboard.bundle.zip';
const KEYBOARD_2025_KEY = `keyboards/${KEYBOARD_2025_FILE}`;
const KEYBOARD_2025_URL = `/uploads/${KEYBOARD_2025_KEY}`;

export function seedPresetsIfEmpty(db: Db) {
  const count = db.prepare('SELECT COUNT(*) as c FROM presets').get() as { c: number };
  if (count.c > 0) return;

  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT INTO presets (
      id, title, tibetan_title, content, translation, sort_order, status, created_at, updated_at
    ) VALUES (
      @id, @title, @tibetan_title, @content, @translation, @sort_order, 'published', @created_at, @updated_at
    )
  `);

  const tx = db.transaction(() => {
    PRESET_TEXTS.forEach((preset, index) => {
      insert.run({
        id: preset.id,
        title: preset.title,
        tibetan_title: preset.tibetanTitle,
        content: preset.content,
        translation: preset.translation,
        sort_order: index,
        created_at: now,
        updated_at: now
      });
    });
  });
  tx();
  console.log(`Seeded ${PRESET_TEXTS.length} preview presets`);
}

/** Keep “The 30 Consonants” first in preset lists (catalog default). */
export function ensureDefaultPresetOrder(db: Db) {
  const hasAlphabet = db.prepare('SELECT id FROM presets WHERE id = ?').get(DEFAULT_PRESET_ID);
  if (!hasAlphabet) return;

  const first = db
    .prepare(
      "SELECT id FROM presets WHERE status = 'published' ORDER BY sort_order ASC, title ASC LIMIT 1"
    )
    .get() as { id: string } | undefined;
  if (first?.id === DEFAULT_PRESET_ID) return;

  const rows = db
    .prepare('SELECT id FROM presets ORDER BY sort_order ASC, title ASC')
    .all() as { id: string }[];
  const ids = [DEFAULT_PRESET_ID, ...rows.map((r) => r.id).filter((id) => id !== DEFAULT_PRESET_ID)];
  const update = db.prepare('UPDATE presets SET sort_order = ? WHERE id = ?');
  const tx = db.transaction(() => {
    ids.forEach((id, index) => update.run(index, id));
  });
  tx();
}

/** Wipe and reseed fonts/keyboards from Bodyig 4.0.1 local assets. */
export function reseedBodyigAssets(db: Db) {
  const now = new Date().toISOString();
  seedPresetsIfEmpty(db);

  const insertFont = db.prepare(`
    INSERT INTO fonts (
      id, name, tibetan_name, category, font_kind, designer, release_year, version,
      description, tibetan_description, css_class, styles_count, weights,
      features, file_size, filename, sample_text, tags, metrics,
      supported_scripts, status, s3_key, file_url, keyboard_id, created_at, updated_at
    ) VALUES (
      @id, @name, @tibetan_name, @category, @font_kind, @designer, @release_year, @version,
      @description, @tibetan_description, @css_class, @styles_count, @weights,
      @features, @file_size, @filename, @sample_text, @tags, @metrics,
      @supported_scripts, @status, @s3_key, @file_url, @keyboard_id, @created_at, @updated_at
    )
  `);

  const tx = db.transaction(() => {
    db.prepare('DELETE FROM font_preset_configs').run();
    db.prepare('DELETE FROM font_keyboards').run();
    db.prepare('DELETE FROM fonts').run();
    db.prepare('DELETE FROM keyboards').run();

    const insertKeyboard = db.prepare(`
      INSERT INTO keyboards (
        id, name, tibetan_name, description, layout_type, script, version,
        status, s3_key, file_url, layout_json, layout_json_mac, layout_json_windows, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?)
    `);

    insertKeyboard.run(
      DEFAULT_KEYBOARD_ID,
      'Monlam Bodyig 3.1 Keyboard',
      'སྨོན་ལམ་བོད་ཡིག་༣.༡་མཐེབ་གཞོང་།',
      'Monlam Bodyig 3.1 Windows installer (Monlam_Bodyig_3.1.exe) — MLBYHMLY layout (c=ཀ, j=་ tsheg, Space=space).',
      'Monlam Bodyig QWERTY',
      'Tibetan',
      '3.1',
      KEYBOARD_31_KEY,
      KEYBOARD_31_URL,
      JSON.stringify(TIBETAN_KEYBOARD_LAYOUT_BODYIG_31),
      JSON.stringify(TIBETAN_KEYBOARD_LAYOUT_BODYIG_31),
      JSON.stringify(TIBETAN_KEYBOARD_LAYOUT_BODYIG_31_WINDOWS),
      now,
      now
    );

    insertKeyboard.run(
      KEYBOARD_2025_ID,
      'Monlam Bodyig 2025 Keyboard',
      'སྨོན་ལམ་བོད་ཡིག་མཐེབ་གཞོང་།',
      'Official Mac keyboard layout bundle from Monlam Bodyig 4.0.1 (Monlam bodyig 2025.bundle).',
      'Monlam Bodyig QWERTY',
      'Tibetan',
      '4.0.1',
      KEYBOARD_2025_KEY,
      KEYBOARD_2025_URL,
      JSON.stringify(TIBETAN_KEYBOARD_LAYOUT),
      JSON.stringify(TIBETAN_KEYBOARD_LAYOUT),
      JSON.stringify(TIBETAN_KEYBOARD_LAYOUT_WINDOWS),
      now,
      now
    );

    const link = db.prepare(
      'INSERT INTO font_keyboards (font_id, keyboard_id) VALUES (?, ?)'
    );

    for (const font of MONLAM_FONTS) {
      const storageKey = `fonts/${font.filename}`;
      insertFont.run({
        id: font.id,
        name: font.name,
        tibetan_name: font.tibetanName,
        category: font.category,
        font_kind: font.fontKind || 'normal',
        designer: font.designer,
        release_year: font.releaseYear,
        version: font.version || '4.0.1',
        description: font.description,
        tibetan_description: font.tibetanDescription,
        css_class: font.cssClass,
        styles_count: font.stylesCount,
        weights: JSON.stringify(font.weights),
        features: JSON.stringify(font.features),
        file_size: font.fileSize,
        filename: font.filename,
        sample_text: font.sampleText,
        tags: JSON.stringify(font.tags),
        metrics: JSON.stringify(font.metrics),
        supported_scripts: JSON.stringify(font.supportedScripts || ['Tibetan']),
        status: 'published',
        s3_key: storageKey,
        file_url: font.fileUrl || `/uploads/${storageKey}`,
        keyboard_id: DEFAULT_KEYBOARD_ID,
        created_at: now,
        updated_at: now
      });
      link.run(font.id, DEFAULT_KEYBOARD_ID);
      link.run(font.id, KEYBOARD_2025_ID);
    }
  });

  tx();
  console.log(
    `Reseeded ${MONLAM_FONTS.length} Bodyig fonts + keyboards ${DEFAULT_KEYBOARD_ID}, ${KEYBOARD_2025_ID}`
  );
}

export function seedIfEmpty(db: Db) {
  seedPresetsIfEmpty(db);
  ensureDefaultPresetOrder(db);
  const fontCount = db.prepare('SELECT COUNT(*) as c FROM fonts').get() as { c: number };
  if (fontCount.c > 0) return;
  reseedBodyigAssets(db);
}
