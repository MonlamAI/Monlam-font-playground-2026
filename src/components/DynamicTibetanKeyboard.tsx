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
import { localeBilingualPair } from '../utils/fontDisplay';
import { TibetanPhysicalKeyboard } from './TibetanPhysicalKeyboard';

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

  const keyboardTitles = practiceKeyboard
    ? localeBilingualPair(practiceKeyboard.name, practiceKeyboard.tibetanName, locale)
    : localeBilingualPair(keyboardTitle, undefined, locale);

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#eef5fc] p-3 sm:p-5 text-gray-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 min-w-0 max-w-full">
      <div className="flex flex-col gap-3 pb-3 mb-3 border-b border-blue-100 dark:border-slate-700">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Keyboard className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <div className="min-w-0">
              <h3
                className={`font-semibold text-sm text-sky-700 dark:text-sky-300 truncate ${
                  keyboardTitles.primaryIsTibetan ? 'tibetan-text' : ''
                }`}
              >
                {keyboardTitles.primary}
              </h3>
              {keyboardTitles.secondary !== keyboardTitles.primary ? (
                <p
                  className={`text-[11px] text-gray-500 dark:text-slate-400 truncate ${
                    !keyboardTitles.primaryIsTibetan ? 'tibetan-text' : ''
                  }`}
                >
                  {keyboardTitles.secondary}
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
              className="text-xs font-medium bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-gray-900 w-full max-w-[16rem] min-w-0 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
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

      <TibetanPhysicalKeyboard
        keyboardLayout={keyboardLayout}
        shiftPressed={shiftPressed}
        capsLock={capsLock}
        onToggleShift={onToggleShift}
        onToggleCaps={onToggleCaps}
        lastKeyPressed={lastKeyPressed}
        onKeyClick={onKeyClick}
        expectedChar={expectedChar}
        size="default"
        showSpaceNote
      />
    </div>
  );
};
