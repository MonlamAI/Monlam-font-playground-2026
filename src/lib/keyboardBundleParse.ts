import JSZip from 'jszip';
import type { KeyMap } from '../data/tibetanData';
import { toWindowsKeyboardLayout } from '../data/tibetanData';

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

function zipEntryPaths(zip: JSZip): string[] {
  return Object.keys(zip.files).filter((path) => {
    const entry = zip.files[path];
    if (!entry || entry.dir) return false;
    if (path.includes('__MACOSX/') || path.startsWith('.')) return false;
    return true;
  });
}

function isFontBinaryZipPath(path: string): boolean {
  return /\/Fonts\//i.test(path) && /\.(ttf|otf|ttc)$/i.test(path);
}

/**
 * Zip without font binaries — small enough for Cloudflare when saving keyboard downloads.
 * Keeps keylayout, bundle plists, installers, and other non-font assets.
 */
export async function buildBodyigStorageZip(data: ArrayBuffer | Uint8Array): Promise<Blob> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const src = await JSZip.loadAsync(bytes, { checkCRC32: false });
  const out = new JSZip();
  const paths = zipEntryPaths(src).filter((p) => !isFontBinaryZipPath(p));

  for (const path of paths) {
    const entry = src.file(path);
    if (!entry) continue;
    const content = await entry.async('uint8array');
    out.file(path, content);
  }

  return out.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
}

/** Read only keylayout + plists from zip (skip decompressing font binaries). */
async function loadZipBundleParts(zip: JSZip): Promise<{
  keylayoutPath: string;
  keylayoutData: Uint8Array;
  infoPlist?: Uint8Array;
  versionPlist?: Uint8Array;
  fontFilenames: string[];
}> {
  const paths = zipEntryPaths(zip);

  const fontFilenames = paths
    .filter((p) => /\/Fonts\//i.test(p) && /\.(ttf|otf|ttc)$/i.test(p))
    .map((p) => p.split('/').pop()!)
    .filter(Boolean);

  const keylayoutPath = paths
    .filter((p) => /\.keylayout(\.xml)?$/i.test(p))
    .sort((a, b) => b.length - a.length)[0];

  if (!keylayoutPath) {
    throw new Error('No Mac keyboard layout (.keylayout or .keylayout.xml) found in the package.');
  }

  const infoPath = paths.find((p) => /Info\.plist$/i.test(p));
  const versionPath = paths.find((p) => /version\.plist$/i.test(p));

  const keylayoutEntry = zip.file(keylayoutPath);
  if (!keylayoutEntry) {
    throw new Error('Could not read keyboard layout from the package.');
  }

  const [keylayoutData, infoPlist, versionPlist] = await Promise.all([
    keylayoutEntry.async('uint8array'),
    infoPath ? zip.file(infoPath)?.async('uint8array') : Promise.resolve(undefined),
    versionPath ? zip.file(versionPath)?.async('uint8array') : Promise.resolve(undefined)
  ]);

  return {
    keylayoutPath,
    keylayoutData,
    infoPlist,
    versionPlist,
    fontFilenames: [...new Set(fontFilenames)]
  };
}

/** Parse a Bodyig zip or keylayout file (browser or Node). */
export async function parseKeyboardBundleBytes(
  data: ArrayBuffer | Uint8Array,
  filename: string
): Promise<KeyboardBundleImportResult> {
  const warnings: string[] = [];
  const lower = filename.toLowerCase();
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);

  let keylayoutPath: string;
  let keylayoutData: Uint8Array;
  let infoPlist: Uint8Array | undefined;
  let versionPlist: Uint8Array | undefined;
  let uniqueFonts: string[] = [];

  if (lower.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(bytes, { checkCRC32: false });
    const parts = await loadZipBundleParts(zip);
    keylayoutPath = parts.keylayoutPath;
    keylayoutData = parts.keylayoutData;
    infoPlist = parts.infoPlist;
    versionPlist = parts.versionPlist;
    uniqueFonts = parts.fontFilenames;
  } else if (lower.endsWith('.keylayout') || lower.endsWith('.keylayout.xml')) {
    keylayoutPath = filename;
    keylayoutData = bytes;
  } else {
    throw new Error('Upload a .zip Bodyig package or a .keylayout / .keylayout.xml file.');
  }

  const xml = new TextDecoder('utf-8').decode(keylayoutData);
  const layoutJsonMac = parseMacKeylayoutXml(xml, warnings);
  const layoutJsonWindows = toWindowsKeyboardLayout(layoutJsonMac);

  const nameMatch = /<keyboard[^>]*name="([^"]+)"/i.exec(xml);
  const keyboardName = nameMatch?.[1] ?? 'Monlam Bodyig Keyboard';

  let bundleName = keyboardName;
  let version = '1.0.0';
  if (infoPlist) {
    const plist = new TextDecoder('utf-8').decode(infoPlist);
    bundleName = plistString(plist, 'CFBundleName') ?? bundleName;
    version = plistString(plist, 'CFBundleVersion') ?? version;
  }

  if (versionPlist) {
    const v = plistString(new TextDecoder('utf-8').decode(versionPlist), 'CFBundleVersion');
    if (v) version = v;
  }

  return {
    name: `${keyboardName} Keyboard`.replace(/\s+Keyboard Keyboard/i, ' Keyboard'),
    tibetanName: bundleName.includes('བོད') || /[\u0f00-\u0fff]/.test(bundleName) ? bundleName : 'སྨོན་ལམ་བོད་ཡིག་མཐེབ་གཞོང་།',
    description: `Imported from Monlam Bodyig package (${keylayoutPath.split('/').pop()}). Includes ${uniqueFonts.length} font file(s) in the bundle.`,
    version,
    layoutType: 'Monlam Bodyig QWERTY',
    script: 'Tibetan',
    layoutJsonMac,
    layoutJsonWindows,
    fontFilenames: uniqueFonts,
    keylayoutSource: keylayoutPath,
    warnings
  };
}
