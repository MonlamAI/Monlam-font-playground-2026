import React from 'react';
import { Keyboard, Monitor, Command } from 'lucide-react';
import type { KeyboardAsset } from '../types/cms';
import { keyMapOutput, type KeyMap } from '../data/tibetanData';
import {
  findLayoutKeyForChar,
  resolveSpaceChars,
  type KeyboardOsLayout
} from '../utils/keyboardLayout';
import { useI18n } from '../i18n/I18nProvider';

export interface DynamicTibetanKeyboardProps {
  keyboardTitle: string;
  practiceKeyboard: KeyboardAsset | null;
  availableKeyboards: KeyboardAsset[];
  selectedKeyboardId: string;
  onSelectKeyboard: (id: string) => void;
  osLayout: KeyboardOsLayout;
  onOsLayoutChange: (os: KeyboardOsLayout) => void;
  shiftPressed: boolean;
  onToggleShift: () => void;
  capsLock?: boolean;
  onToggleCaps?: () => void;
  keyboardLayout: KeyMap[][];
  lastKeyPressed: string | null;
  onKeyClick: (char: string, layoutKey: string) => void;
  /** Optional: highlight the physical key that produces this Tibetan character */
  expectedChar?: string;
}

/** US QWERTY shift glyphs for the Latin side of each physical key. */
const LATIN_SHIFT: Record<string, string> = {
  '`': '~',
  '1': '!',
  '2': '@',
  '3': '#',
  '4': '$',
  '5': '%',
  '6': '^',
  '7': '&',
  '8': '*',
  '9': '(',
  '0': ')',
  '-': '_',
  '=': '+',
  '[': '{',
  ']': '}',
  '\\': '|',
  ';': ':',
  "'": '"',
  ',': '<',
  '.': '>',
  '/': '?'
};

function latinPair(key: string): { upper: string; lower: string } {
  if (/^[a-z]$/i.test(key)) {
    return { upper: key.toUpperCase(), lower: key.toLowerCase() };
  }
  return { upper: LATIN_SHIFT[key] ?? key, lower: key };
}

type KeyVisualState = 'idle' | 'hint' | 'last' | 'shiftOn';

/** Shared widths so `~`, letter keys, and space-row blanks stay aligned. */
const CHAR_KEY_WIDTH = 'w-[54px] shrink-0';
const BACKSPACE_KEY_WIDTH = 'w-[72px] sm:w-[88px] shrink-0';
const KEY_HEIGHT = 'h-[56px] sm:h-[62px]';

function charKeyClass(state: KeyVisualState): string {
  const base = `relative ${CHAR_KEY_WIDTH} ${KEY_HEIGHT} rounded border text-left transition select-none p-1.5 box-border`;
  if (state === 'hint') {
    return `${base} bg-[#f9a888] border-[#e8896a] dark:bg-[#c45c3a] dark:border-[#e8896a] z-10`;
  }
  if (state === 'last') {
    return `${base} bg-sky-100 border-sky-400 dark:bg-sky-900/60 dark:border-sky-500`;
  }
  if (state === 'shiftOn') {
    return `${base} bg-amber-100 border-amber-400 dark:bg-amber-900/50 dark:border-amber-500`;
  }
  return `${base} bg-white border-gray-400 hover:bg-gray-50 active:bg-sky-50 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 dark:active:bg-slate-600`;
}

function modifierKeyClass(active = false): string {
  const base = `flex flex-col items-center justify-center gap-0.5 ${KEY_HEIGHT} px-1.5 rounded border text-[10px] sm:text-[11px] font-medium transition select-none`;
  if (active) {
    return `${base} bg-amber-100 border-amber-400 text-amber-950 dark:bg-amber-900/50 dark:border-amber-500 dark:text-amber-100`;
  }
  return `${base} bg-white border-gray-400 text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700`;
}

function BlankKey({ match = 'char' }: { match?: 'char' | 'backspace' }) {
  const width = match === 'backspace' ? BACKSPACE_KEY_WIDTH : CHAR_KEY_WIDTH;

  return (
    <div
      aria-hidden
      className={`${width} ${KEY_HEIGHT} rounded border border-gray-400 bg-white dark:bg-slate-800 dark:border-slate-600`}
    />
  );
}

function ModifierKey({
  label,
  symbol,
  wide = 'md',
  active = false,
  onClick
}: {
  label: string;
  symbol: string;
  wide?: 'sm' | 'md' | 'lg' | 'xl';
  active?: boolean;
  onClick?: () => void;
}) {
  const width =
    wide === 'sm'
      ? 'w-[48px] sm:w-[56px] shrink-0'
      : wide === 'lg'
        ? BACKSPACE_KEY_WIDTH
        : wide === 'xl'
          ? 'w-[88px] sm:w-[108px] shrink-0'
          : 'w-[60px] sm:w-[72px] shrink-0';

  return (
    <button type="button" onClick={onClick} className={`${modifierKeyClass(active)} ${width}`}>
      <span>{label}</span>
      <span className="text-base leading-none opacity-80">{symbol}</span>
    </button>
  );
}

function CharKey({
  keyMap,
  capsLock,
  state,
  onClick
}: {
  keyMap: KeyMap;
  capsLock: boolean;
  state: KeyVisualState;
  onClick: () => void;
}) {
  const { upper, lower } = latinPair(keyMap.key);
  const hintLatin = state === 'hint';
  const tibetanBase = capsLock ? (keyMap.capsChar ?? keyMap.char) : keyMap.char;
  const tibetanShift = capsLock
    ? (keyMap.capsShiftChar ?? keyMap.capsChar ?? keyMap.shiftChar)
    : keyMap.shiftChar;

  const latinClass = `font-mono text-[9px] sm:text-[10px] leading-none block ${
    hintLatin ? 'text-red-600 dark:text-red-300 font-bold' : 'text-gray-600 dark:text-slate-400'
  }`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${charKeyClass(state)} flex flex-col justify-between`}
    >
      <div className="flex justify-between items-start gap-0.5 w-full min-h-0">
        <span className={latinClass}>{upper}</span>
        <span className="tibetan-text font-app text-[11px] sm:text-[13px] text-gray-900 dark:text-slate-100 leading-none shrink-0">
          {tibetanShift}
        </span>
      </div>
      <div className="flex justify-between items-end gap-0.5 w-full min-h-0">
        <span className={latinClass}>{lower}</span>
        <span className="tibetan-text font-app text-[13px] sm:text-[15px] font-semibold text-gray-950 dark:text-white leading-none shrink-0">
          {tibetanBase}
        </span>
      </div>
    </button>
  );
}

export const DynamicTibetanKeyboard: React.FC<DynamicTibetanKeyboardProps> = ({
  keyboardTitle,
  practiceKeyboard,
  availableKeyboards,
  selectedKeyboardId,
  onSelectKeyboard,
  osLayout,
  onOsLayoutChange,
  shiftPressed,
  onToggleShift,
  capsLock = false,
  onToggleCaps,
  keyboardLayout,
  lastKeyPressed,
  onKeyClick,
  expectedChar
}) => {
  const { t, locale } = useI18n();
  const space = resolveSpaceChars(keyboardLayout);
  const spaceChar = shiftPressed ? space.shiftChar : space.char;
  const spaceIsTsheg = space.char === '་' || space.char === '༌';

  const hintKey = expectedChar
    ? findLayoutKeyForChar(keyboardLayout, expectedChar, shiftPressed, capsLock) ||
      findLayoutKeyForChar(keyboardLayout, expectedChar, !shiftPressed, capsLock)
    : null;

  const hintMapped =
    hintKey && hintKey !== ' '
      ? keyboardLayout.flat().find((k) => k.key === hintKey)
      : undefined;
  const hintNeedsShift =
    !!expectedChar &&
    !!hintKey &&
    (hintKey === ' '
      ? expectedChar === space.shiftChar && space.shiftChar !== space.char
      : !!hintMapped &&
        keyMapOutput(hintMapped, false, capsLock) !== expectedChar &&
        keyMapOutput(hintMapped, true, capsLock) === expectedChar);

  const spaceHinted = hintKey === ' ';
  const letterRows = keyboardLayout.map((row) => row.filter((k) => k.key !== ' '));
  const numberRow = letterRows[0] ?? [];
  const qwertyRow = letterRows[1] ?? [];
  const asdfRow = letterRows[2] ?? [];
  const zxcvRow = letterRows[3] ?? [];

  const keyState = (key: string): KeyVisualState => {
    if (hintKey === key) return 'hint';
    if (lastKeyPressed === key) return 'last';
    return 'idle';
  };

  const renderCharRow = (row: KeyMap[]) =>
    row.map((k) => (
      <CharKey
        key={k.key}
        keyMap={k}
        capsLock={capsLock}
        state={keyState(k.key)}
        onClick={() => onKeyClick(keyMapOutput(k, shiftPressed, capsLock), k.key)}
      />
    ));

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#eef5fc] p-4 sm:p-5 text-gray-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      {/* Controls */}
      <div className="flex flex-col gap-3 pb-3 mb-3 border-b border-blue-100 dark:border-slate-700">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Keyboard className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-sky-700 dark:text-sky-300 truncate">{keyboardTitle}</h3>
              {practiceKeyboard?.tibetanName ? (
                <p className="text-[11px] text-gray-500 dark:text-slate-400 tibetan-text truncate">
                  {practiceKeyboard.tibetanName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleShift}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition border ${
                shiftPressed || hintNeedsShift
                  ? 'bg-amber-400 border-amber-500 text-slate-950 font-bold'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {shiftPressed
                ? t('typing.shiftOn')
                : hintNeedsShift
                  ? t('typing.shiftNeeded')
                  : t('typing.shiftOff')}
            </button>
            <span className="text-xs text-gray-500 dark:text-slate-400 hidden sm:inline tibetan-text">
              {t('typing.keysFollowOs')}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide shrink-0">
              {t('typing.keyboardLabel')}
            </span>
            <select
              value={selectedKeyboardId}
              onChange={(e) => onSelectKeyboard(e.target.value)}
              className="text-xs font-medium bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-gray-900 max-w-[16rem] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
            >
              {availableKeyboards.length === 0 ? (
                <option value="">{t('typing.fallbackKeyboard')}</option>
              ) : (
                availableKeyboards.map((k) => (
                  <option key={k.id} value={k.id}>
                    {locale === 'bo' && k.tibetanName ? k.tibetanName : k.name}
                  </option>
                ))
              )}
            </select>
          </label>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
              {t('typing.layoutLabel')}
            </span>
            <div className="flex items-center rounded-lg border border-gray-300 p-0.5 bg-white dark:border-slate-600 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => onOsLayoutChange('windows')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  osLayout === 'windows'
                    ? 'bg-sky-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                {t('typing.layoutWindows')}
              </button>
              <button
                type="button"
                onClick={() => onOsLayoutChange('mac')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  osLayout === 'mac'
                    ? 'bg-sky-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <Command className="w-3.5 h-3.5" />
                {t('typing.layoutMac')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Physical-style keyboard board — centered as one unit */}
      <div className="overflow-x-auto pb-1">
        <div className="mx-auto w-fit">
          <div className="flex flex-col gap-1.5">
            {/* Number row + Backspace */}
            <div className="flex gap-1.5 items-stretch">
              {renderCharRow(numberRow)}
              <ModifierKey label={t('typing.keyBackspace')} symbol="←" wide="lg" />
            </div>

            {/* Tab + QWERTY */}
            <div className="flex gap-1.5 items-stretch">
              <ModifierKey label={t('typing.keyTab')} symbol="⇥" wide="md" />
              {renderCharRow(qwertyRow)}
            </div>

            {/* Caps + ASDF + Enter */}
            <div className="flex gap-1.5 items-stretch">
              <ModifierKey
                label={t('typing.keyCapsLock')}
                symbol="⇪"
                wide="lg"
                active={capsLock}
                onClick={onToggleCaps}
              />
              {renderCharRow(asdfRow)}
              <ModifierKey label={t('typing.keyEnter')} symbol="↵" wide="lg" />
            </div>

            {/* Shift + ZXCV + Shift */}
            <div className="flex gap-1.5 items-stretch">
              <ModifierKey
                label={t('typing.keyShift')}
                symbol="↑"
                wide="xl"
                active={shiftPressed || hintNeedsShift}
                onClick={onToggleShift}
              />
              {renderCharRow(zxcvRow)}
              <ModifierKey
                label={t('typing.keyShift')}
                symbol="↑"
                wide="xl"
                active={shiftPressed || hintNeedsShift}
                onClick={onToggleShift}
              />
            </div>

            {/* Bottom: left blanks = `~` width; right blanks = Backspace width */}
            <div className="flex gap-1.5 items-stretch pt-0.5">
              <BlankKey match="char" />
              <BlankKey match="char" />
              <BlankKey match="char" />
              <BlankKey match="char" />
              <button
                type="button"
                onClick={() => onKeyClick(spaceChar, ' ')}
                className={`flex-1 min-w-[220px] ${KEY_HEIGHT} rounded border flex items-center justify-center gap-2 px-3 transition ${
                  spaceHinted
                    ? 'bg-[#f9a888] border-[#e8896a] dark:bg-[#c45c3a] dark:border-[#e8896a]'
                    : lastKeyPressed === ' '
                      ? 'bg-sky-100 border-sky-400 dark:bg-sky-900/60 dark:border-sky-500'
                      : 'bg-white border-gray-400 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-sm font-medium text-gray-800 dark:text-slate-100">
                  {t('typing.keySpace')}{' '}
                  <span className="tibetan-text font-app">ཚེག་དང་བར་སྟོང་།</span>
                </span>
              </button>
              <BlankKey match="backspace" />
              <BlankKey match="backspace" />
              <BlankKey match="backspace" />
              <BlankKey match="backspace" />
            </div>
          </div>
        </div>
      </div>

      {/* Space behavior note (Bodyig 2025 / tsheg-on-space layouts) */}
      {spaceIsTsheg ? (
        <div className="mt-3 flex flex-col items-center text-center gap-1">
          <span className="text-gray-700 dark:text-slate-300 text-sm leading-none">↓</span>
          <p className="tibetan-text font-app text-xs sm:text-sm text-gray-800 dark:text-slate-200 max-w-xl leading-relaxed">
            ཚེག་ནི་ནམ་རྒྱུན་གྱི་ Space མནན་ན་ཡོང་།
            <br />
            བར་སྟོང་འཇོག་སྐབས་ Shift དང་མཉམ་དུ་ Space གནོན་དགོས།
          </p>
        </div>
      ) : null}

      {expectedChar && hintKey ? (
        <div className="mt-3 text-center text-xs text-gray-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-2">
          <span className="tibetan-text">{t('typing.nextKey')}</span>
          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold border border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30">
            {hintKey === ' ' ? t('typing.nextKeySpace') : hintKey.toUpperCase()}
            {hintNeedsShift ? t('typing.nextKeyShiftSuffix') : ''}
          </span>
          <span className="tibetan-text font-app text-sky-800 dark:text-sky-200 text-sm">
            {expectedChar}
          </span>
        </div>
      ) : null}
    </div>
  );
};
