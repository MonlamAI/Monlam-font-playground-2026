/**
 * Export completed EN/BO i18n strings to Excel (Serial | Tibetan | English).
 * Run: npx tsx scripts/export-translations-excel.mts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import en from '../src/i18n/messages/en.ts';
import boOverrides from '../src/i18n/messages/bo.json' with { type: 'json' };
import { deepMerge } from '../src/i18n/deepMerge.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'docs/localization/Monlam-Playground-Translations-EN-BO.xlsx');

function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v as Record<string, unknown>, key));
    } else if (typeof v === 'string') {
      out[key] = v;
    }
  }
  return out;
}

const enFlat = flatten(en as unknown as Record<string, unknown>);
const boTree = deepMerge(
  JSON.parse(JSON.stringify(en)) as Record<string, unknown>,
  boOverrides as Record<string, unknown>
);
const boFlat = flatten(boTree);

/** Keys where bo.json explicitly overrides English (completed translation work). */
function loadBoOverrideKeys(): Set<string> {
  return new Set(Object.keys(flatten(boOverrides as Record<string, unknown>)));
}

async function main() {
  let XLSX: typeof import('xlsx');
  try {
    XLSX = await import('xlsx');
  } catch {
    console.error('Missing xlsx. Run: npm install --save-dev xlsx');
    process.exit(1);
  }

  const overrideKeys = loadBoOverrideKeys();
  const keys = Object.keys(enFlat).sort((a, b) => a.localeCompare(b));

  const rows: [number, string, string][] = [];
  let serial = 1;
  for (const key of keys) {
    const english = enFlat[key] ?? '';
    const tibetan = boFlat[key] ?? english;
    if (!english.trim()) continue;
    const isCompleted =
      overrideKeys.has(key) || tibetan.trim() !== english.trim();
    if (!isCompleted) continue;
    rows.push([serial++, tibetan, english]);
  }

  const sheetData: (string | number)[][] = [
    ['Serial Number', 'Tibetan Keywords', 'English Keywords'],
    ...rows
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws['!cols'] = [{ wch: 14 }, { wch: 56 }, { wch: 56 }];
  ws['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft' };
  XLSX.utils.book_append_sheet(wb, ws, 'Translations');

  const metaRows: (string | number)[][] = [
    ['Monlam Font Playground — completed i18n strings'],
    [''],
    ['Total rows', rows.length],
    ['Source', 'src/i18n/messages/en.ts + bo.json (merged)'],
    ['Regenerate', 'npx tsx scripts/export-translations-excel.mts'],
    [''],
    ['Note', 'Tibetan column uses merged locale (bo overrides + English fallback where not yet translated).']
  ];
  const meta = XLSX.utils.aoa_to_sheet(metaRows);
  meta['!cols'] = [{ wch: 18 }, { wch: 72 }];
  XLSX.utils.book_append_sheet(wb, meta, 'About');

  XLSX.writeFile(wb, OUT);
  console.log(`Wrote ${rows.length} translation rows to ${OUT}`);
  console.log(`Explicit bo.json keys: ${overrideKeys.size}`);
}

main();
