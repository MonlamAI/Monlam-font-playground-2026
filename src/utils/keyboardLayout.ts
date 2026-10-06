import {
  TIBETAN_KEYBOARD_LAYOUT,
  TIBETAN_KEYBOARD_LAYOUT_WINDOWS,
  toWindowsKeyboardLayout,
  type KeyMap
} from '../data/tibetanData';
import type { KeyboardAsset } from '../types/cms';

export type KeyboardOsLayout = 'mac' | 'windows';

const CODE_TO_LAYOUT_KEY: Record<string, string> = {
  Backquote: '`',
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  Digit0: '0',
  Minus: '-',
  Equal: '=',
  KeyQ: 'q',
  KeyW: 'w',
  KeyE: 'e',
  KeyR: 'r',
  KeyT: 't',
  KeyY: 'y',
  KeyU: 'u',
  KeyI: 'i',
  KeyO: 'o',
  KeyP: 'p',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  KeyA: 'a',
  KeyS: 's',
  KeyD: 'd',
  KeyF: 'f',
  KeyG: 'g',
  KeyH: 'h',
  KeyJ: 'j',
  KeyK: 'k',
  KeyL: 'l',
  Semicolon: ';',
  Quote: "'",
  KeyZ: 'z',
  KeyX: 'x',
  KeyC: 'c',
  KeyV: 'v',
  KeyB: 'b',
  KeyN: 'n',
  KeyM: 'm',
  Comma: ',',
  Period: '.',
  Slash: '/',
  IntlBackslash: '\\'
};

export function isKeyMapLayout(value: unknown): value is KeyMap[][] {
  if (!Array.isArray(value) || value.length === 0) return false;
  return value.every(
    (row) =>
      Array.isArray(row) &&
      row.every(
        (k) =>
          k &&
          typeof k === 'object' &&
          typeof (k as KeyMap).key === 'string' &&
          typeof (k as KeyMap).char === 'string' &&
          typeof (k as KeyMap).shiftChar === 'string' &&
          typeof (k as KeyMap).label === 'string'
      )
  );
}

export function detectKeyboardOs(): KeyboardOsLayout {
  if (typeof navigator === 'undefined') return 'windows';
  const platform = navigator.platform || '';
  const ua = navigator.userAgent || '';
  if (/Mac|iPhone|iPad|iPod/.test(platform) || /Mac OS X/.test(ua)) return 'mac';
  return 'windows';
}

export function resolveKeyboardLayout(
  keyboard: KeyboardAsset | null,
  os: KeyboardOsLayout
): KeyMap[][] {
  if (os === 'windows') {
    if (keyboard && isKeyMapLayout(keyboard.layoutJsonWindows)) return keyboard.layoutJsonWindows;
    if (keyboard && isKeyMapLayout(keyboard.layoutJsonMac)) {
      return toWindowsKeyboardLayout(keyboard.layoutJsonMac);
    }
    if (keyboard && isKeyMapLayout(keyboard.layoutJson)) {
      return toWindowsKeyboardLayout(keyboard.layoutJson);
    }
    return TIBETAN_KEYBOARD_LAYOUT_WINDOWS;
  }
  if (keyboard && isKeyMapLayout(keyboard.layoutJsonMac)) return keyboard.layoutJsonMac;
  if (keyboard && isKeyMapLayout(keyboard.layoutJson)) return keyboard.layoutJson;
  return TIBETAN_KEYBOARD_LAYOUT;
}

export function findMappedKey(layout: KeyMap[][], layoutKey: string): KeyMap | undefined {
  for (const row of layout) {
    const match = row.find((k) => k.key === layoutKey);
    if (match) return match;
  }
  return undefined;
}

export function layoutKeyFromCode(code: string): string | undefined {
  return CODE_TO_LAYOUT_KEY[code];
}

export function mappedCharFromKeyboardEvent(
  event: Pick<KeyboardEvent, 'code' | 'key' | 'shiftKey' | 'metaKey' | 'ctrlKey' | 'altKey'>,
  layout: KeyMap[][],
  shiftLatched: boolean
): string | null {
  if (event.metaKey || event.ctrlKey || event.altKey) return null;
  const layoutKey = CODE_TO_LAYOUT_KEY[event.code];
  if (!layoutKey) return null;
  const mapped = findMappedKey(layout, layoutKey);
  if (!mapped) return null;
  return event.shiftKey || shiftLatched ? mapped.shiftChar : mapped.char;
}
