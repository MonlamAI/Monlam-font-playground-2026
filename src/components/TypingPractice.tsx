import React from 'react';
import { Keyboard, CheckCircle2, RotateCcw } from 'lucide-react';
import { TYPING_DRILLS } from '../data/tibetanData';
import { DynamicTibetanKeyboard } from './DynamicTibetanKeyboard';
import { useI18n } from '../i18n/I18nProvider';
import { useLocaleFormatters } from '../hooks/useLocaleFormatters';
import type { TypingDrill } from '../types/font';
import { useTypingKeyboard } from '../hooks/useTypingKeyboard';
import {
  layoutKeyFromCode,
  mappedCharFromKeyboardEvent
} from '../utils/keyboardLayout';
import { FEATURE_TYPING_WPM } from '../config/features';

function drillText(d: TypingDrill, field: 'title' | 'hint', t: (key: string) => string): string {
  const key = `typing.drills.${d.id}.${field}`;
  const localized = t(key);
  return localized === key ? d[field] : localized;
}

export const TypingPractice: React.FC = () => {
  const { t } = useI18n();
  const fmt = useLocaleFormatters();
  const [currentDrillIndex, setCurrentDrillIndex] = React.useState(0);
  const [userInput, setUserInput] = React.useState('');
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [wpm, setWpm] = React.useState(0);
  const [accuracy, setAccuracy] = React.useState(100);
  const [isFinished, setIsFinished] = React.useState(false);

  const kb = useTypingKeyboard();

  const currentDrill = TYPING_DRILLS[currentDrillIndex];

  const applyTypedValue = (val: string) => {
    if (!startTime && val.length === 1) {
      setStartTime(Date.now());
    }

    setUserInput(val);

    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === currentDrill.targetText[i]) {
        correct++;
      }
    }
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);

    if (startTime) {
      const elapsedMins = (Date.now() - startTime) / 60000;
      if (elapsedMins > 0.05) {
        const wordsTyped = val.length / 5;
        setWpm(Math.round(wordsTyped / elapsedMins));
      }
    }

    if (val === currentDrill.targetText) {
      setIsFinished(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyTypedValue(e.target.value);
  };

  const handleMappedKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const mapped = mappedCharFromKeyboardEvent(
      e.nativeEvent,
      kb.keyboardLayout,
      kb.shiftPressed,
      kb.capsLock
    );
    if (mapped === null) return;
    e.preventDefault();
    kb.setLastKeyPressed(layoutKeyFromCode(e.nativeEvent.code) || null);
    applyTypedValue(userInput + mapped);
  };

  const handleResetDrill = () => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
  };

  const handleNextDrill = () => {
    if (currentDrillIndex < TYPING_DRILLS.length - 1) {
      setCurrentDrillIndex(currentDrillIndex + 1);
      handleResetDrill();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 min-w-0 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 tibetan-text">{t('typing.title')}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-4 sm:p-6 shadow-xs min-w-0">
          <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 tibetan-text">
                {t('typing.drillsLabel')}
              </span>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold">
                {FEATURE_TYPING_WPM ? (
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <span className="tibetan-text">{t('typing.speed')}</span>
                    <span className={`text-sm font-bold ${fmt.numeralsClass}`}>{t('typing.wpm', { count: wpm })}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <span className="tibetan-text">{t('typing.accuracy')}</span>
                  <span className={`text-sm font-bold ${fmt.numeralsClass}`}>{fmt.pct(accuracy)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 max-w-full">
              {TYPING_DRILLS.map((d, idx) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setCurrentDrillIndex(idx);
                    handleResetDrill();
                  }}
                  className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs transition ${
                    currentDrillIndex === idx
                      ? 'bg-blue-600 font-bold text-white shadow-sm ring-2 ring-blue-400/40'
                      : 'border border-gray-200 bg-gray-50 font-medium text-gray-800 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className={fmt.numeralsClass}>{fmt.n(idx + 1)}.</span>{' '}
                  <span className="tibetan-text">{drillText(d, 'title', t)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 pb-6">
            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700 select-none overflow-x-auto">
              <div className="tibetan-text font-app text-3xl sm:text-4xl text-gray-800 dark:text-slate-100 tracking-wide flex flex-wrap gap-1 items-center">
                {currentDrill.targetText.split('').map((char, i) => {
                  let colorClass = 'text-gray-800 dark:text-slate-100';
                  let bgClass = '';

                  if (i < userInput.length) {
                    if (userInput[i] === char) {
                      colorClass = 'text-emerald-600';
                    } else {
                      colorClass = 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/50 rounded';
                    }
                  } else if (i === userInput.length) {
                    bgClass = 'bg-blue-200 dark:bg-blue-800 ring-2 ring-blue-500 rounded animate-pulse';
                  }

                  return (
                    <span key={i} className={`${colorClass} ${bgClass} px-0.5 transition-all`}>
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleMappedKeyDown}
                disabled={isFinished}
                placeholder={t('typing.inputPlaceholder')}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-blue-400 dark:border-blue-600 rounded-xl text-xl sm:text-2xl text-gray-900 dark:text-slate-100 tibetan-text font-app focus:outline-hidden focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition shadow-inner"
                autoFocus
              />
              <button
                onClick={handleResetDrill}
                title={t('typing.resetDrill')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 bg-gray-100 dark:bg-slate-800 rounded-lg transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {isFinished && (
              <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-gray-500 dark:text-slate-400">
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> <span className="tibetan-text">{t('typing.completed')}</span>
                </span>
                <button
                  onClick={handleNextDrill}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 transition tibetan-text"
                >
                  {t('typing.nextDrill')}
                </button>
              </div>
            )}
          </div>
        </div>

        <DynamicTibetanKeyboard
          keyboardTitle={kb.keyboardTitle}
          practiceKeyboard={kb.practiceKeyboard}
          availableKeyboards={kb.availableKeyboards}
          selectedKeyboardId={kb.selectedKeyboardId}
          onSelectKeyboard={kb.setSelectedKeyboardId}
          osLayout={kb.osLayout}
          onOsLayoutChange={kb.setOsLayout}
          shiftPressed={kb.shiftPressed}
          onToggleShift={() => kb.setShiftPressed((v) => !v)}
          capsLock={kb.capsLock}
          onToggleCaps={() => kb.setCapsLock((v) => !v)}
          keyboardLayout={kb.keyboardLayout}
          lastKeyPressed={kb.lastKeyPressed}
          onKeyClick={(char, layoutKey) => {
            kb.setLastKeyPressed(layoutKey);
            applyTypedValue(userInput + char);
          }}
        />
      </div>
    </div>
  );
};
