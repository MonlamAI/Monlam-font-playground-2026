import type { KeyboardBundleImportResult } from '../src/lib/keyboardBundleParse';
import {
  parseKeyboardBundleBytes,
  parseMacKeylayoutXml
} from '../src/lib/keyboardBundleParse';

export type { KeyboardBundleImportResult };

export { parseMacKeylayoutXml };

function normalizeFontName(name: string): string {
  return name
    .replace(/\.(ttf|otf|ttc)$/i, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();
}

export function matchFontIds(
  fontFilenames: string[],
  fonts: { id: string; name: string; filename: string }[]
): string[] {
  const byNorm = new Map<string, string>();
  for (const f of fonts) {
    byNorm.set(normalizeFontName(f.filename), f.id);
    byNorm.set(normalizeFontName(f.name), f.id);
  }
  const ids = new Set<string>();
  for (const fn of fontFilenames) {
    const id = byNorm.get(normalizeFontName(fn));
    if (id) ids.add(id);
  }
  return [...ids];
}

export async function parseKeyboardBundleBuffer(
  buffer: Buffer,
  filename: string
): Promise<KeyboardBundleImportResult> {
  return parseKeyboardBundleBytes(new Uint8Array(buffer), filename);
}
