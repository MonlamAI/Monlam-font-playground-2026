import React from 'react';
import { publicApi } from '../admin/api';
import type { KeyboardAsset } from '../types/cms';
import {
  detectKeyboardOs,
  resolveKeyboardLayout,
  type KeyboardOsLayout
} from '../utils/keyboardLayout';
import type { KeyMap } from '../data/tibetanData';
import { useI18n } from '../i18n/I18nProvider';

/** Default on-screen keyboard: Monlam Bodyig 2025. */
export const DEFAULT_KEYBOARD_ID = 'monlam-bodyig-2025';
/** Previous default — migrate stored 3.1 → 2025 unless the user picked something else. */
const LEGACY_DEFAULT_KEYBOARD_ID = 'monlam-bodyig-3.1';
export const TYPING_KEYBOARD_STORAGE_ID = 'monlam-typing-keyboard-id';
export const TYPING_OS_STORAGE = 'monlam-typing-os';

export interface UseTypingKeyboardResult {
  availableKeyboards: KeyboardAsset[];
  selectedKeyboardId: string;
  setSelectedKeyboardId: (id: string) => void;
  osLayout: KeyboardOsLayout;
  setOsLayout: (os: KeyboardOsLayout) => void;
  shiftPressed: boolean;
  setShiftPressed: React.Dispatch<React.SetStateAction<boolean>>;
  capsLock: boolean;
  setCapsLock: React.Dispatch<React.SetStateAction<boolean>>;
  lastKeyPressed: string | null;
  setLastKeyPressed: (key: string | null) => void;
  practiceKeyboard: KeyboardAsset | null;
  keyboardTitle: string;
  keyboardLayout: KeyMap[][];
}

/** Shared CMS keyboard + OS layout state (synced via localStorage with Typing Practice). */
export function useTypingKeyboard(): UseTypingKeyboardResult {
  const { locale, t } = useI18n();
  const [availableKeyboards, setAvailableKeyboards] = React.useState<KeyboardAsset[]>([]);
  const [selectedKeyboardId, setSelectedKeyboardId] = React.useState('');
  const [osLayout, setOsLayout] = React.useState<KeyboardOsLayout>(() => {
    if (typeof window === 'undefined') return 'windows';
    const stored = window.localStorage.getItem(TYPING_OS_STORAGE);
    if (stored === 'mac' || stored === 'windows') return stored;
    return detectKeyboardOs();
  });
  const [shiftPressed, setShiftPressed] = React.useState(false);
  const [capsLock, setCapsLock] = React.useState(false);
  const [lastKeyPressed, setLastKeyPressed] = React.useState<string | null>(null);

  const practiceKeyboard =
    availableKeyboards.find((k) => k.id === selectedKeyboardId) || availableKeyboards[0] || null;
  const keyboardTitle =
    locale === 'bo' && practiceKeyboard?.tibetanName
      ? practiceKeyboard.tibetanName
      : practiceKeyboard?.name || t('typing.fallbackKeyboard');
  const keyboardLayout = resolveKeyboardLayout(practiceKeyboard, osLayout);

  React.useEffect(() => {
    let cancelled = false;
    publicApi
      .keyboards()
      .then((keyboards) => {
        if (cancelled) return;
        setAvailableKeyboards(keyboards);
        const storedId = window.localStorage.getItem(TYPING_KEYBOARD_STORAGE_ID);
        // Keep a manual choice, but migrate the old default (3.1) → Bodyig 2025
        const storedIsManual =
          !!storedId &&
          storedId !== LEGACY_DEFAULT_KEYBOARD_ID &&
          keyboards.some((k) => k.id === storedId);
        const preferred =
          (storedIsManual ? keyboards.find((k) => k.id === storedId) : undefined) ||
          keyboards.find((k) => k.id === DEFAULT_KEYBOARD_ID) ||
          keyboards.find((k) => k.id === LEGACY_DEFAULT_KEYBOARD_ID) ||
          keyboards[0];
        if (preferred) setSelectedKeyboardId(preferred.id);
      })
      .catch(() => {
        if (!cancelled) setAvailableKeyboards([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (selectedKeyboardId) {
      window.localStorage.setItem(TYPING_KEYBOARD_STORAGE_ID, selectedKeyboardId);
    }
  }, [selectedKeyboardId]);

  React.useEffect(() => {
    window.localStorage.setItem(TYPING_OS_STORAGE, osLayout);
  }, [osLayout]);

  return {
    availableKeyboards,
    selectedKeyboardId,
    setSelectedKeyboardId,
    osLayout,
    setOsLayout,
    shiftPressed,
    setShiftPressed,
    capsLock,
    setCapsLock,
    lastKeyPressed,
    setLastKeyPressed,
    practiceKeyboard,
    keyboardTitle,
    keyboardLayout
  };
}
