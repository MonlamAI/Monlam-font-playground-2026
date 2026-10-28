import React from 'react';
import { keyMapOutput, type KeyMap } from '../data/tibetanData';
import { findLayoutKeyForChar, resolveSpaceChars } from '../utils/keyboardLayout';
import { useI18n } from '../i18n/I18nProvider';

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

type KeyDimensions = {
  charWidth: string;
  backspaceWidth: string;
  keyHeight: string;
  modifierMd: string;
  modifierXl: string;
  spaceMinWidth: string;
  gap: string;
};

const KEY_DIMS: Record<'default' | 'compact', KeyDimensions> = {
  default: {
    charWidth: 'w-[42px] sm:w-[48px] md:w-[54px] shrink-0',
    backspaceWidth: 'w-[60px] sm:w-[72px] md:w-[88px] shrink-0',
    keyHeight: 'h-[48px] sm:h-[56px] md:h-[62px]',
    modifierMd: 'w-[60px] sm:w-[72px] shrink-0',
    modifierXl: 'w-[88px] sm:w-[108px] shrink-0',
    spaceMinWidth: 'min-w-[220px]',
    gap: 'gap-1.5'
  },
  compact: {
    charWidth: 'w-[34px] shrink-0',
    backspaceWidth: 'w-[52px] shrink-0',
    keyHeight: 'h-[42px]',
    modifierMd: 'w-[52px] shrink-0',
    modifierXl: 'w-[72px] shrink-0',
    spaceMinWidth: 'min-w-[160px]',
    gap: 'gap-1'
  }
};

export type TibetanPhysicalKeyboardProps = {
  keyboardLayout: KeyMap[][];
  shiftPressed?: boolean;
  capsLock?: boolean;
  onToggleShift?: () => void;
  onToggleCaps?: () => void;
  lastKeyPressed?: string | null;
  onKeyClick?: (char: string, layoutKey: string) => void;
  expectedChar?: string;
  size?: 'default' | 'compact';
  showSpaceNote?: boolean;
};

function CharKey({
  keyMap,
  capsLock,
  state,
  dims,
  onClick
}: {
  keyMap: KeyMap;
  capsLock: boolean;
  state: KeyVisualState;
  dims: KeyDimensions;
  onClick: () => void;
}) {
  const { upper, lower } = latinPair(keyMap.key);
  const hintLatin = state === 'hint';
  const tibetanBase = capsLock ? (keyMap.capsChar ?? keyMap.char) : keyMap.char;
  const tibetanShift = capsLock
    ? (keyMap.capsShiftChar ?? keyMap.capsChar ?? keyMap.shiftChar)
    : keyMap.shiftChar;

  const latinClass = `font-mono text-[8px] sm:text-[9px] leading-none block ${
    hintLatin ? 'text-red-600 dark:text-red-300 font-bold' : 'text-gray-600 dark:text-slate-400'
  }`;

  let stateClass =
    'bg-white border-gray-400 hover:bg-gray-50 active:bg-sky-50 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 dark:active:bg-slate-600';
  if (state === 'hint') {
    stateClass =
      'bg-[#f9a888] border-[#e8896a] dark:bg-[#c45c3a] dark:border-[#e8896a] z-10';
  } else if (state === 'last') {
    stateClass = 'bg-sky-100 border-sky-400 dark:bg-sky-900/60 dark:border-sky-500';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${dims.charWidth} ${dims.keyHeight} rounded border text-left transition select-none p-1 box-border flex flex-col justify-between ${stateClass}`}
    >
      <div className="flex justify-between items-start gap-0.5 w-full min-h-0">
        <span className={latinClass}>{upper}</span>
        <span className="tibetan-text font-app text-[10px] sm:text-[12px] text-gray-900 dark:text-slate-100 leading-none shrink-0">
          {tibetanShift}
        </span>
      </div>
      <div className="flex justify-between items-end gap-0.5 w-full min-h-0">
        <span className={latinClass}>{lower}</span>
        <span className="tibetan-text font-app text-[11px] sm:text-[14px] font-semibold text-gray-950 dark:text-white leading-none shrink-0">
          {tibetanBase}
        </span>
      </div>
    </button>
  );
}

function ModifierKey({
  label,
  symbol,
  wide,
  active,
  dims,
  onClick
}: {
  label: string;
  symbol: string;
  wide: 'md' | 'lg' | 'xl';
  active?: boolean;
  dims: KeyDimensions;
  onClick?: () => void;
}) {
  const width =
    wide === 'lg' ? dims.backspaceWidth : wide === 'xl' ? dims.modifierXl : dims.modifierMd;
  const base = `flex flex-col items-center justify-center gap-0.5 ${dims.keyHeight} px-1 rounded border text-[9px] sm:text-[10px] font-medium transition select-none ${width}`;
  const tone = active
    ? 'bg-amber-100 border-amber-400 text-amber-950 dark:bg-amber-900/50 dark:border-amber-500 dark:text-amber-100'
    : 'bg-white border-gray-400 text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700';

  return (
    <button type="button" onClick={onClick} className={`${base} ${tone}`}>
      <span className="leading-tight text-center">{label}</span>
      <span className="text-sm leading-none opacity-80">{symbol}</span>
    </button>
  );
}

function BlankKey({ dims, match = 'char' }: { dims: KeyDimensions; match?: 'char' | 'backspace' }) {
  const width = match === 'backspace' ? dims.backspaceWidth : dims.charWidth;
  return (
    <div
      aria-hidden
      className={`${width} ${dims.keyHeight} rounded border border-gray-400 bg-white dark:bg-slate-800 dark:border-slate-600`}
    />
  );
}

export const TibetanPhysicalKeyboard: React.FC<TibetanPhysicalKeyboardProps> = ({
  keyboardLayout,
  shiftPressed = false,
  capsLock = false,
  onToggleShift,
  onToggleCaps,
  lastKeyPressed = null,
  onKeyClick,
  expectedChar,
  size = 'default',
  showSpaceNote = true
}) => {
  const { t } = useI18n();
  const dims = KEY_DIMS[size];
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

  const handleKeyClick = (char: string, layoutKey: string) => {
    onKeyClick?.(char, layoutKey);
  };

  const renderCharRow = (row: KeyMap[]) =>
    row.map((k) => (
      <CharKey
        key={k.key}
        keyMap={k}
        capsLock={capsLock}
        state={keyState(k.key)}
        dims={dims}
        onClick={() => handleKeyClick(keyMapOutput(k, shiftPressed, capsLock), k.key)}
      />
    ));

  return (
    <div className="min-w-0 max-w-full">
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="mx-auto w-fit">
          <div className={`flex flex-col ${dims.gap}`}>
            <div className={`flex ${dims.gap} items-stretch`}>
              {renderCharRow(numberRow)}
              <ModifierKey
                label={t('typing.keyBackspace')}
                symbol="←"
                wide="lg"
                dims={dims}
              />
            </div>

            <div className={`flex ${dims.gap} items-stretch`}>
              <ModifierKey label={t('typing.keyTab')} symbol="⇥" wide="md" dims={dims} />
              {renderCharRow(qwertyRow)}
            </div>

            <div className={`flex ${dims.gap} items-stretch`}>
              <ModifierKey
                label={t('typing.keyCapsLock')}
                symbol="⇪"
                wide="lg"
                active={capsLock}
                dims={dims}
                onClick={onToggleCaps}
              />
              {renderCharRow(asdfRow)}
              <ModifierKey label={t('typing.keyEnter')} symbol="↵" wide="lg" dims={dims} />
            </div>

            <div className={`flex ${dims.gap} items-stretch`}>
              <ModifierKey
                label={t('typing.keyShift')}
                symbol="↑"
                wide="xl"
                active={shiftPressed || hintNeedsShift}
                dims={dims}
                onClick={onToggleShift}
              />
              {renderCharRow(zxcvRow)}
              <ModifierKey
                label={t('typing.keyShift')}
                symbol="↑"
                wide="xl"
                active={shiftPressed || hintNeedsShift}
                dims={dims}
                onClick={onToggleShift}
              />
            </div>

            <div className={`flex ${dims.gap} items-stretch pt-0.5`}>
              <BlankKey dims={dims} match="char" />
              <BlankKey dims={dims} match="char" />
              <BlankKey dims={dims} match="char" />
              <BlankKey dims={dims} match="char" />
              <button
                type="button"
                onClick={() => handleKeyClick(spaceChar, ' ')}
                className={`flex-1 ${dims.spaceMinWidth} ${dims.keyHeight} rounded border flex items-center justify-center gap-1 px-2 transition text-[10px] sm:text-xs ${
                  spaceHinted
                    ? 'bg-[#f9a888] border-[#e8896a] dark:bg-[#c45c3a] dark:border-[#e8896a]'
                    : lastKeyPressed === ' '
                      ? 'bg-sky-100 border-sky-400 dark:bg-sky-900/60 dark:border-sky-500'
                      : 'bg-white border-gray-400 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700'
                }`}
              >
                <span className="font-medium text-gray-800 dark:text-slate-100">
                  {t('typing.keySpace')}
                </span>
                <span className="tibetan-text font-app hidden sm:inline">ཚེག་དང་བར་སྟོང་།</span>
              </button>
              <BlankKey dims={dims} match="backspace" />
              <BlankKey dims={dims} match="backspace" />
              <BlankKey dims={dims} match="backspace" />
              <BlankKey dims={dims} match="backspace" />
            </div>
          </div>
        </div>
      </div>

      {showSpaceNote && spaceIsTsheg ? (
        <p className="mt-2 text-[11px] text-gray-600 dark:text-slate-400 tibetan-text font-app leading-relaxed">
          ཚེག་ Space · བར་སྟོང་ Shift+Space
        </p>
      ) : null}

      {expectedChar && hintKey ? (
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-2">
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
