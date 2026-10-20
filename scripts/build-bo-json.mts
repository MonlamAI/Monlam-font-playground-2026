import fs from 'node:fs';
import path from 'node:path';
import en from '../src/i18n/messages/en.ts';
import { deepMerge } from '../src/i18n/deepMerge.ts';

/** Flat Tibetan UI strings — keys match dot paths from `scripts/flat-en.mts`. */
import tibetanFlat from './tibetan-flat.json' assert { type: 'json' };

function unflatten(flat: Record<string, string>): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let cur: Record<string, unknown> = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!cur[p] || typeof cur[p] !== 'object') cur[p] = {};
      cur = cur[p] as Record<string, unknown>;
    }
    cur[parts[parts.length - 1]] = value;
  }
  return root;
}

const existing = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, '../src/i18n/messages/bo.json'), 'utf8')
);

const tibetanTree = unflatten(tibetanFlat as Record<string, string>);
const merged = deepMerge(
  deepMerge(JSON.parse(JSON.stringify(en)) as typeof en, tibetanTree as Partial<typeof en>),
  existing as Partial<typeof en>
);

fs.writeFileSync(
  path.join(import.meta.dirname, '../src/i18n/messages/bo.json'),
  `${JSON.stringify(merged, null, 2)}\n`,
  'utf8'
);
console.log('Wrote bo.json with', Object.keys(tibetanFlat).length, 'Tibetan overrides');
