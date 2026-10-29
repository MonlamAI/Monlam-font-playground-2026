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

/** Apple virtual key codes (kVK_ANSI_*) → US QWERTY keys (ANSI). */
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
  34: 'i',
  35: 'p',
  37: 'l',
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
  49: ' ',
  50: '`'
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

type ActionDef = {
  byState: Map<string, string>;
  /** When `none` has only `next="…"`, use that state's output for the base key cap. */
  noneNext?: string;
};

function parseActions(xml: string): Map<string, ActionDef> {
  const map = new Map<string, ActionDef>();
  const blockRe = /<action id="([^"]+)">([\s\S]*?)<\/action>/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(xml))) {
    const id = m[1];
    const body = m[2];
    const def: ActionDef = { byState: new Map() };
    const whenRe = /<when state="([^"]+)"([^>]*)\/?>/g;
    let w: RegExpExecArray | null;
    while ((w = whenRe.exec(body))) {
      const state = w[1];
      const attrs = w[2];
      const outMatch = /\boutput="([^"]*)"/.exec(attrs);
      const nextMatch = /\bnext="([^"]+)"/.exec(attrs);
      if (outMatch) {
        def.byState.set(state, decodeXmlText(outMatch[1]));
      } else if (state === 'none' && nextMatch) {
        def.noneNext = nextMatch[1];
      }
    }
    map.set(id, def);
  }
  return map;
}

function parseKeyMapSetXml(xml: string): string {
  const layoutMatch = /<layout[^>]*\smapSet="(\d+)"/i.exec(xml);
  const setId = layoutMatch?.[1];
  if (!setId) return xml;
  const setRe = new RegExp(`<keyMapSet id="${setId}">([\\s\\S]*?)<\\/keyMapSet>`, 'i');
  return setRe.exec(xml)?.[1] ?? xml;
}

function parseModifierKeyMapIndex(xml: string, modifierKeys: string): number | undefined {
  const re = new RegExp(
    `<keyMapSelect mapIndex="(\\d+)">\\s*<modifier keys="${modifierKeys.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\/>`,
    'i'
  );
  const m = re.exec(xml);
  return m ? Number(m[1]) : undefined;
}

function parseKeyMapLayer(keyMapSetXml: string, mapIndex: number): Map<number, { output?: string; action?: string }> {
  const layerRe = new RegExp(`<keyMap index="${mapIndex}">([\\s\\S]*?)<\\/keyMap>`, 'i');
  const match = layerRe.exec(keyMapSetXml);
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

type ResolveLayer = 'base' | 'shift' | 'caps';

function actionOutputForLayer(actionId: string, actions: Map<string, ActionDef>, layer: ResolveLayer): string {
  const act = actions.get(actionId);
  if (!act) {
    if (/[\u0f00-\u0fff]/.test(actionId)) return actionId;
    return '';
  }
  const none = act.byState.get('none');
  const s1 = act.byState.get('s1');
  const mv2 = act.byState.get('mv2');

  if (layer === 'base') {
    if (none) return none;
    if (act.noneNext) {
      const chained = act.byState.get(act.noneNext);
      if (chained) return chained;
    }
    if (mv2) return mv2;
    if (s1) return s1;
    return '';
  }

  if (layer === 'shift') {
    return none ?? s1 ?? mv2 ?? '';
  }

  return none ?? mv2 ?? s1 ?? '';
}

function resolveOutput(
  entry: { output?: string; action?: string } | undefined,
  actions: Map<string, ActionDef>,
  layer: ResolveLayer
): string {
  if (!entry) return '';
  if (entry.output !== undefined) return entry.output;
  if (entry.action) {
    const out = actionOutputForLayer(entry.action, actions, layer);
    if (out) return out;
    if (/[\u0f00-\u0fff]/.test(entry.action)) return entry.action;
  }
  return '';
}

function labelForKey(key: string): string {
  if (key === ' ') return 'SPACE';
  if (key.length === 1 && /[a-z]/.test(key)) return key.toUpperCase();
  return key;
}

const LETTER_KEY_CODES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17];

/** macOS Caps Lock layer is often Latin A–Z; Monlam docs map Tibetan symbols to the Option layers. */
function capsLayerUsesLatinLetters(
  layerCaps: Map<number, { output?: string; action?: string }>,
  actions: Map<string, ActionDef>
): boolean {
  let latin = 0;
  let tibetan = 0;
  for (const code of LETTER_KEY_CODES) {
    const out = resolveOutput(layerCaps.get(code), actions, 'caps');
    if (/^[A-Z]$/.test(out)) latin += 1;
    else if (/[\u0f00-\u0fff]/.test(out)) tibetan += 1;
  }
  return latin >= 8 && latin > tibetan;
}

export function parseMacKeylayoutXml(xml: string, warnings: string[]): KeyMap[][] {
  const actions = parseActions(xml);
  const keyMapSetXml = parseKeyMapSetXml(xml);
  const shiftMapIndex = parseModifierKeyMapIndex(xml, 'anyShift caps?') ?? 1;
  const capsMapIndex = parseModifierKeyMapIndex(xml, 'caps') ?? 2;
  const optionMapIndex = parseModifierKeyMapIndex(xml, 'anyOption');
  const optionShiftMapIndex =
    parseModifierKeyMapIndex(xml, 'anyShift caps? anyOption') ??
    parseModifierKeyMapIndex(xml, 'anyShift? caps? anyOption? anyControl');

  const layer0 = parseKeyMapLayer(keyMapSetXml, 0);
  const layerShift = parseKeyMapLayer(keyMapSetXml, shiftMapIndex);
  let layerCaps = parseKeyMapLayer(keyMapSetXml, capsMapIndex);
  let layerCapsShift = layerShift;

  if (capsLayerUsesLatinLetters(layerCaps, actions) && optionMapIndex !== undefined) {
    layerCaps = parseKeyMapLayer(keyMapSetXml, optionMapIndex);
    if (optionShiftMapIndex !== undefined) {
      layerCapsShift = parseKeyMapLayer(keyMapSetXml, optionShiftMapIndex);
    }
  }

  const byKey = new Map<string, KeyMap>();

  const allCodes = new Set<number>([...layer0.keys(), ...layerShift.keys(), ...layerCaps.keys()]);

  for (const code of allCodes) {
    const key = MAC_CODE_TO_KEY[code];
    if (!key) continue;

    const char = resolveOutput(layer0.get(code), actions, 'base');
    const shiftChar = resolveOutput(layerShift.get(code), actions, 'shift') || char;
    const capsChar = resolveOutput(layerCaps.get(code), actions, 'base');
    const capsShiftChar = resolveOutput(layerCapsShift.get(code), actions, 'base');

    if (!char && !shiftChar && !capsChar) continue;

    byKey.set(key, {
      key,
      char: char || shiftChar,
      shiftChar: shiftChar || char,
      label: labelForKey(key),
      wylie: key,
      shiftWylie: key,
      ...(capsChar ? { capsChar } : {}),
      ...(capsShiftChar && capsShiftChar !== capsChar ? { capsShiftChar } : {})
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
    const char = resolveOutput(layer0.get(spaceCode), actions, 'base') || '་';
    const shiftChar = resolveOutput(layerShift.get(spaceCode), actions, 'shift') || ' ';
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

/**
 * Compact zip for CDN upload: keylayout + plists + README only (not the full Bodyig tree).
 */
export async function buildBodyigStorageZip(
  data: ArrayBuffer | Uint8Array,
  filename = 'bundle.zip'
): Promise<Blob> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const lower = filename.toLowerCase();
  const out = new JSZip();

  if (lower.endsWith('.keylayout') || lower.endsWith('.keylayout.xml')) {
    const name = filename.split('/').pop() || 'keyboard.keylayout.xml';
    out.file(`Monlam-Keyboard/${name}`, bytes);
  } else {
    const src = await JSZip.loadAsync(bytes, { checkCRC32: false });
    const parts = await loadZipBundleParts(src);
    const keyName = parts.keylayoutPath.split('/').pop() || 'Monlam.keylayout.xml';
    out.file(`Monlam-Keyboard/${keyName}`, parts.keylayoutData);
    if (parts.infoPlist) out.file('Monlam-Keyboard/Info.plist', parts.infoPlist);
    if (parts.versionPlist) out.file('Monlam-Keyboard/version.plist', parts.versionPlist);
    const fontList = parts.fontFilenames.length
      ? parts.fontFilenames.join('\n  ')
      : '(none listed in bundle)';
    out.file(
      'Monlam-Keyboard/README.txt',
      [
        'Monlam Bodyig keyboard layout (compact download).',
        'Install the .keylayout / .keylayout.xml file on macOS (System Settings → Keyboard).',
        'Fonts from the full Bodyig package are on https://monlamfonts.com — use the font catalog.',
        '',
        `Layout source in original bundle: ${parts.keylayoutPath}`,
        '',
        'Font filenames referenced in the bundle:',
        `  ${fontList}`
      ].join('\n')
    );
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
