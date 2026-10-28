import JSZip from 'jszip';
import type { KeyMap } from '../src/data/tibetanData';
import { toWindowsKeyboardLayout } from '../src/data/tibetanData';

export type KeyboardBundleImportResult = {
  name: string;
  tibetanName: string;
  description: string;
  version: string;
  layoutType: string;
  script: string;
  layoutJsonMac: KeyMap[][];
  layoutJsonWindows: KeyMap[][];
  fontFilenames: string[];
  keylayoutSource: string;
  warnings: string[];
};

/** Apple virtual key codes → US QWERTY keys (ANSI). */
const MAC_CODE_TO_KEY: Record<number, string> = {
  0: 'a',
  1: 's',
  2: 'd',
  3: 'f',
  4: 'h',
  5: 'g',
  6: 'z',
  7: 'x',
  8: 'c',
  9: 'v',
  11: 'b',
  12: 'q',
  13: 'w',
  14: 'e',
  15: 'r',
  16: 'y',
  17: 't',
  18: '1',
  19: '2',
  20: '3',
  21: '4',
  22: '6',
  23: '5',
  24: '=',
  25: '9',
  26: '7',
  27: '-',
  28: '8',
  29: '0',
  30: ']',
  31: 'o',
  32: 'u',
  33: '[',
  34: 'p',
  35: 'l',
  38: 'j',
  39: "'",
  40: 'k',
  41: ';',
  42: '\\',
  43: ',',
  44: '/',
  45: 'n',
  46: 'm',
  47: '.',
  50: '`',
  49: ' '
};

const ROW_KEY_ORDER: string[][] = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', ' ']
];

function decodeXmlText(raw: string): string {
  return raw
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
}

type ActionDef = { none?: string; s1?: string };

function parseActions(xml: string): Map<string, ActionDef> {
  const map = new Map<string, ActionDef>();
  const blockRe = /<action id="([^"]+)">([\s\S]*?)<\/action>/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(xml))) {
    const id = m[1];
    const body = m[2];
    const def: ActionDef = {};
    const whenRe = /<when state="([^"]+)" output="([^"]*)"/g;
    let w: RegExpExecArray | null;
    while ((w = whenRe.exec(body))) {
      const state = w[1];
      const out = decodeXmlText(w[2]);
      if (state === 'none') def.none = out;
      if (state === 's1') def.s1 = out;
    }
    map.set(id, def);
  }
  return map;
}

function parseKeyMapLayer(xml: string, mapIndex: number): Map<number, { output?: string; action?: string }> {
  const layerRe = new RegExp(`<keyMap index="${mapIndex}">([\\s\\S]*?)<\\/keyMap>`, 'i');
  const match = layerRe.exec(xml);
  const layer = match?.[1] ?? '';
  const keys = new Map<number, { output?: string; action?: string }>();
  const keyRe = /<key code="(\d+)"(?:\s+output="([^"]*)")?(?:\s+action="([^"]*)")?[^>]*\/?>/g;
  let k: RegExpExecArray | null;
  while ((k = keyRe.exec(layer))) {
    const code = Number(k[1]);
    if (k[2] !== undefined) keys.set(code, { output: decodeXmlText(k[2]) });
    else if (k[3] !== undefined) keys.set(code, { action: k[3] });
  }
  return keys;
}

function resolveOutput(
  entry: { output?: string; action?: string } | undefined,
  actions: Map<string, ActionDef>,
  preferS1: boolean
): string {
  if (!entry) return '';
  if (entry.output !== undefined) return entry.output;
  if (entry.action) {
    const act = actions.get(entry.action);
    if (act) {
      if (preferS1 && act.s1) return act.s1;
      if (act.none) return act.none;
    }
    if (/[\u0f00-\u0fff]/.test(entry.action) || entry.action.length <= 2) {
      return entry.action;
    }
  }
  return '';
}

function labelForKey(key: string): string {
  if (key === ' ') return 'SPACE';
  if (key.length === 1 && /[a-z]/.test(key)) return key.toUpperCase();
  return key;
}

export function parseMacKeylayoutXml(xml: string, warnings: string[]): KeyMap[][] {
  const actions = parseActions(xml);
  const layer0 = parseKeyMapLayer(xml, 0);
  const layer1 = parseKeyMapLayer(xml, 1);
  const layer2 = parseKeyMapLayer(xml, 2);
  const layer4 = parseKeyMapLayer(xml, 4);

  const byKey = new Map<string, KeyMap>();

  const allCodes = new Set<number>([
    ...layer0.keys(),
    ...layer1.keys(),
    ...layer2.keys(),
    ...layer4.keys()
  ]);

  for (const code of allCodes) {
    const key = MAC_CODE_TO_KEY[code];
    if (!key || key === 'Backspace' || key === 'Tab') continue;

    const char = resolveOutput(layer0.get(code), actions, false);
    const shiftChar = resolveOutput(layer1.get(code), actions, false) || char;
    const capsChar = resolveOutput(layer2.get(code), actions, false);
    const capsShiftChar = resolveOutput(layer4.get(code), actions, false);

    if (!char && !shiftChar) continue;

    byKey.set(key, {
      key,
      char: char || shiftChar,
      shiftChar: shiftChar || char,
      label: labelForKey(key),
      wylie: key,
      shiftWylie: key,
      ...(capsChar ? { capsChar } : {}),
      ...(capsShiftChar ? { capsShiftChar } : {})
    });
  }

  if (byKey.size < 20) {
    warnings.push('Fewer than 20 keys parsed from keylayout — check the bundle format.');
  }

  const rows: KeyMap[][] = [];
  for (const row of ROW_KEY_ORDER) {
    const keys: KeyMap[] = [];
    for (const k of row) {
      const mapped = byKey.get(k);
      if (mapped) keys.push(mapped);
    }
    if (keys.length) rows.push(keys);
  }

  if (!byKey.has(' ')) {
    const spaceCode = 49;
    const char = resolveOutput(layer0.get(spaceCode), actions, false) || '་';
    const shiftChar = resolveOutput(layer1.get(spaceCode), actions, false) || ' ';
    rows[rows.length - 1]?.push({
      key: ' ',
      char,
      shiftChar,
      label: 'SPACE',
      wylie: 'space',
      shiftWylie: 'space'
    });
  }

  return rows;
}

function plistString(xml: string, key: string): string | undefined {
  const re = new RegExp(`<key>${key}<\\/key>\\s*<string>([^<]*)<\\/string>`, 'i');
  const m = re.exec(xml);
  return m?.[1]?.trim();
}

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

async function collectZipEntries(zip: JSZip): Promise<{ path: string; data: Uint8Array }[]> {
  const out: { path: string; data: Uint8Array }[] = [];
  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir || path.includes('__MACOSX/') || path.startsWith('.')) continue;
    const data = await entry.async('uint8array');
    out.push({ path, data });
  }
  return out;
}

export async function parseKeyboardBundleBuffer(
  buffer: Buffer,
  filename: string
): Promise<KeyboardBundleImportResult> {
  const warnings: string[] = [];
  let entries: { path: string; data: Uint8Array }[] = [];

  const lower = filename.toLowerCase();
  if (lower.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(buffer);
    entries = await collectZipEntries(zip);
  } else if (lower.endsWith('.keylayout') || lower.endsWith('.keylayout.xml')) {
    entries = [{ path: filename, data: new Uint8Array(buffer) }];
  } else {
    throw new Error('Upload a .zip Bodyig package or a .keylayout / .keylayout.xml file.');
  }

  const keylayoutEntry = entries
    .filter((e) => /\.keylayout(\.xml)?$/i.test(e.path) && !e.path.includes('__MACOSX'))
    .sort((a, b) => b.path.length - a.path.length)[0];

  if (!keylayoutEntry) {
    throw new Error('No Mac keyboard layout (.keylayout or .keylayout.xml) found in the package.');
  }

  const xml = new TextDecoder('utf-8').decode(keylayoutEntry.data);
  const layoutJsonMac = parseMacKeylayoutXml(xml, warnings);
  const layoutJsonWindows = toWindowsKeyboardLayout(layoutJsonMac);

  const nameMatch = /<keyboard[^>]*name="([^"]+)"/i.exec(xml);
  const keyboardName = nameMatch?.[1] ?? 'Monlam Bodyig Keyboard';

  const plistEntry = entries.find((e) => /Info\.plist$/i.test(e.path));
  let bundleName = keyboardName;
  let version = '1.0.0';
  if (plistEntry) {
    const plist = new TextDecoder('utf-8').decode(plistEntry.data);
    bundleName = plistString(plist, 'CFBundleName') ?? bundleName;
    version = plistString(plist, 'CFBundleVersion') ?? version;
  }

  const versionPlist = entries.find((e) => /version\.plist$/i.test(e.path));
  if (versionPlist) {
    const v = plistString(new TextDecoder('utf-8').decode(versionPlist.data), 'CFBundleVersion');
    if (v) version = v;
  }

  const fontFilenames = entries
    .filter((e) => /\/Fonts\//i.test(e.path) && /\.(ttf|otf|ttc)$/i.test(e.path))
    .map((e) => e.path.split('/').pop()!)
    .filter(Boolean);

  const uniqueFonts = [...new Set(fontFilenames)];

  return {
    name: `${keyboardName} Keyboard`.replace(/\s+Keyboard Keyboard/i, ' Keyboard'),
    tibetanName: bundleName.includes('བོད') || /[\u0f00-\u0fff]/.test(bundleName) ? bundleName : 'སྨོན་ལམ་བོད་ཡིག་མཐེབ་གཞོང་།',
    description: `Imported from Monlam Bodyig package (${keylayoutEntry.path.split('/').pop()}). Includes ${uniqueFonts.length} font file(s) in the bundle.`,
    version,
    layoutType: 'Monlam Bodyig QWERTY',
    script: 'Tibetan',
    layoutJsonMac,
    layoutJsonWindows,
    fontFilenames: uniqueFonts,
    keylayoutSource: keylayoutEntry.path,
    warnings
  };
}
