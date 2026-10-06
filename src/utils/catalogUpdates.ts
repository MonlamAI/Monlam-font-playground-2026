import type { FontAsset, KeyboardAsset } from '../types/cms';

const STORAGE_KEY = 'monlam-catalog-updates-seen-v1';

export interface CatalogUpdateItem {
  id: string;
  name: string;
  version: string;
  updatedAt: string;
  kind: 'new' | 'updated';
}

export interface CatalogUpdateSnapshot {
  fonts: Record<string, { version: string; updatedAt: string; name: string }>;
  keyboards: Record<string, { version: string; updatedAt: string; name: string }>;
}

export interface CatalogUpdateDiff {
  fonts: CatalogUpdateItem[];
  keyboards: CatalogUpdateItem[];
  hasUpdates: boolean;
  scope: 'fonts' | 'keyboards' | 'both' | null;
}

function toMap(
  items: Array<{ id: string; name: string; version: string; updatedAt: string }>
): CatalogUpdateSnapshot['fonts'] {
  const map: CatalogUpdateSnapshot['fonts'] = {};
  for (const item of items) {
    map[item.id] = {
      name: item.name,
      version: item.version || '1.0.0',
      updatedAt: item.updatedAt || ''
    };
  }
  return map;
}

export function buildSnapshot(
  fonts: FontAsset[],
  keyboards: KeyboardAsset[]
): CatalogUpdateSnapshot {
  return {
    fonts: toMap(
      fonts.map((f) => ({
        id: f.id,
        name: f.name,
        version: f.version,
        updatedAt: f.updatedAt
      }))
    ),
    keyboards: toMap(
      keyboards.map((k) => ({
        id: k.id,
        name: k.name,
        version: k.version,
        updatedAt: k.updatedAt
      }))
    )
  };
}

function diffCategory(
  current: CatalogUpdateSnapshot['fonts'],
  previous: CatalogUpdateSnapshot['fonts'] | undefined
): CatalogUpdateItem[] {
  const prev = previous || {};
  const items: CatalogUpdateItem[] = [];

  for (const [id, entry] of Object.entries(current)) {
    const old = prev[id];
    if (!old) {
      items.push({
        id,
        name: entry.name,
        version: entry.version,
        updatedAt: entry.updatedAt,
        kind: 'new'
      });
      continue;
    }
    if (old.version !== entry.version || old.updatedAt !== entry.updatedAt) {
      items.push({
        id,
        name: entry.name,
        version: entry.version,
        updatedAt: entry.updatedAt,
        kind: 'updated'
      });
    }
  }

  // Newest first
  items.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  return items;
}

export function diffSnapshots(
  current: CatalogUpdateSnapshot,
  previous: CatalogUpdateSnapshot | null
): CatalogUpdateDiff {
  if (!previous) {
    return { fonts: [], keyboards: [], hasUpdates: false, scope: null };
  }

  const fonts = diffCategory(current.fonts, previous.fonts);
  const keyboards = diffCategory(current.keyboards, previous.keyboards);
  const hasFonts = fonts.length > 0;
  const hasKeyboards = keyboards.length > 0;

  let scope: CatalogUpdateDiff['scope'] = null;
  if (hasFonts && hasKeyboards) scope = 'both';
  else if (hasFonts) scope = 'fonts';
  else if (hasKeyboards) scope = 'keyboards';

  return {
    fonts,
    keyboards,
    hasUpdates: hasFonts || hasKeyboards,
    scope
  };
}

export function readSeenSnapshot(): CatalogUpdateSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CatalogUpdateSnapshot;
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      fonts: parsed.fonts || {},
      keyboards: parsed.keyboards || {}
    };
  } catch {
    return null;
  }
}

export function writeSeenSnapshot(snapshot: CatalogUpdateSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore quota / private mode failures
  }
}

export function formatUpdateHeadline(diff: CatalogUpdateDiff): string {
  if (diff.scope === 'both') return 'Fonts and keyboards were updated';
  if (diff.scope === 'fonts') return 'New font updates are available';
  if (diff.scope === 'keyboards') return 'New keyboard updates are available';
  return 'Catalog updates are available';
}

export function formatUpdateSummary(diff: CatalogUpdateDiff): string {
  const parts: string[] = [];

  if (diff.fonts.length === 1) {
    parts.push(`${diff.fonts[0].name}`);
  } else if (diff.fonts.length > 1) {
    parts.push(`${diff.fonts.length} fonts`);
  }

  if (diff.keyboards.length === 1) {
    parts.push(`${diff.keyboards[0].name}`);
  } else if (diff.keyboards.length > 1) {
    parts.push(`${diff.keyboards.length} keyboards`);
  }

  if (parts.length === 0) return 'Something in the catalog changed.';

  const total = diff.fonts.length + diff.keyboards.length;
  const subject = parts.join(' and ');
  return total === 1 ? `${subject} was updated.` : `${subject} were updated.`;
}
