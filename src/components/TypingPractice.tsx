import React from 'react';
import { Keyboard, CheckCircle2, Sparkles, Copy, Check, ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import { TYPING_DRILLS } from '../data/tibetanData';
import { convertWylieToTibetan } from '../utils/wylieConverter';
import { MONLAM_FONTS } from '../data/fontsData';
import { fontAssetLabel } from '../utils/fontDisplay';
import { DynamicTibetanKeyboard } from './DynamicTibetanKeyboard';
import { useI18n } from '../i18n/I18nProvider';
import type { TypingDrill } from '../types/font';
import { useTypingKeyboard } from '../hooks/useTypingKeyboard';
import {
  layoutKeyFromCode,
  mappedCharFromKeyboardEvent
} from '../utils/keyboardLayout';

interface TypingPracticeProps {
  onSendToPlayground: (text: string) => void;
}

function drillText(d: TypingDrill, field: 'title' | 'hint', t: (key: string) => string): string {
  const key = `typing.drills.${d.id}.${field}`;
  const localized = t(key);
  return localized === key ? d[field] : localized;
}

export const TypingPractice: React.FC<TypingPracticeProps> = ({ onSendToPlayground }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState<'tutor' | 'wylie'>('tutor');
  const [currentDrillIndex, setCurrentDrillIndex] = React.useState(0);
  const [userInput, setUserInput] = React.useState('');
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [wpm, setWpm] = React.useState(0);
  const [accuracy, setAccuracy] = React.useState(100);
  const [isFinished, setIsFinished] = React.useState(false);

  const kb = useTypingKeyboard();

  // Wylie converter state
  const [wylieInput, setWylieInput] = React.useState('om ma ni pad me hum / bkra shis bde legs');
  const [convertedTibetan, setConvertedTibetan] = React.useState('');
  const [selectedFont, setSelectedFont] = React.useState(MONLAM_FONTS[0].id);
  const [copied, setCopied] = React.useState(false);

  const currentDrill = TYPING_DRILLS[currentDrillIndex];

  React.useEffect(() => {
    setConvertedTibetan(convertWylieToTibetan(wylieInput));
  }, [wylieInput]);

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

  const handleCopyConverted = () => {
    navigator.clipboard.writeText(convertedTibetan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chosenFont = MONLAM_FONTS.find((f) => f.id === selectedFont) || MONLAM_FONTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 tibetan-text">{t('typing.title')}</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 tibetan-text">{t('typing.subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'tutor'
                ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
            }`}
          >
            <span className="tibetan-text">{t('typing.tabTutor')}</span>
          </button>
          <button
            onClick={() => setActiveTab('wylie')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'wylie'
                ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
            }`}
          >
            <span className="tibetan-text">{t('typing.tabWylie')}</span>
          </button>
        </div>
      </div>

      {activeTab === 'tutor' ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-xs">
            <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 tibetan-text">
                  {t('typing.drillsLabel')}
                </span>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <span className="tibetan-text">{t('typing.speed')}</span>
                    <span className="text-sm font-mono font-bold">{t('typing.wpm', { count: wpm })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span className="tibetan-text">{t('typing.accuracy')}</span>
                    <span className="text-sm font-mono font-bold">{accuracy}%</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {TYPING_DRILLS.map((d, idx) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setCurrentDrillIndex(idx);
                      handleResetDrill();
                    }}
                    className={`px-2.5 py-1 text-xs rounded-md transition font-medium tibetan-text ${
                      currentDrillIndex === idx
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    {idx + 1}. {drillText(d, 'title', t)}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-6">
              <div className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                <span className="tibetan-text">{t('typing.targetLabel')}</span>
                <span className="text-gray-400 dark:text-slate-500 font-mono text-[11px]">{currentDrill.wylieGuide}</span>
              </div>

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

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-700 dark:text-slate-300 tibetan-text">{t('typing.tipLabel')}</span>
                  <span className="tibetan-text">{drillText(currentDrill, 'hint', t)}</span>
                </div>
                {isFinished && (
                  <div className="flex items-center gap-2">
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm tibetan-text">{t('typing.wylieInputLabel')}</h3>
              <span className="text-xs text-gray-400 dark:text-slate-500">{t('typing.wylieStandard')}</span>
            </div>

            <textarea
              rows={5}
              value={wylieInput}
              onChange={(e) => setWylieInput(e.target.value)}
              placeholder={t('typing.wyliePlaceholder')}
              className="w-full p-3 font-mono text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />

            <div className="space-y-1.5">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium tibetan-text">
                {t('typing.quickExamples')}
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {(
                  [
                    { labelKey: 'typing.samples.omMani', val: 'om ma ni pad me hum' },
                    { labelKey: 'typing.samples.tashiDelek', val: 'bkra shis bde legs' },
                    { labelKey: 'typing.samples.bodYig', val: 'bod yig' },
                    { labelKey: 'typing.samples.buddhaDharma', val: "sangs rgyas chos dge 'dun" },
                    {
                      labelKey: 'typing.samples.sentientBeings',
                      val: 'sems can thams cad bde ba dang ldan par gyur cig'
                    }
                  ] as const
                ).map((sample) => (
                  <button
                    key={sample.labelKey}
                    onClick={() => setWylieInput(sample.val)}
                    className="px-2.5 py-1 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-md transition"
                  >
                    {t(sample.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 rounded-lg text-xs space-y-2 text-blue-900 dark:text-blue-200">
              <div className="font-semibold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="tibetan-text">{t('typing.wylieGuideTitle')}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[11px]">
                <div>ka = ཀ | kha = ཁ | ga = ག</div>
                <div>nga = ང | ca = ཅ | cha = ཆ</div>
                <div>kya = ཀྱ | kra = ཀྲ | kla = ཀླ</div>
                <div>rka = རྐ | ska = སྐ | lka = ལྐ</div>
                <div>i, u, e, o = ི, ུ, ེ, ོ</div>
                <div>space = ་ | shift+space = space | / = །</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm tibetan-text">{t('typing.convertedLabel')}</h3>
                </div>

                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="text-xs font-semibold px-2 py-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md dark:text-slate-200"
                >
                  {MONLAM_FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {fontAssetLabel(f)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 min-h-[160px] flex items-center justify-center">
                <div
                  className={`${chosenFont.cssClass} tibetan-text text-3xl sm:text-4xl text-gray-900 dark:text-slate-100 leading-relaxed text-center break-words`}
                >
                  {convertedTibetan || t('typing.convertedEmpty')}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleCopyConverted}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span className="tibetan-text">{copied ? t('typing.copiedUnicode') : t('typing.copyUnicode')}</span>
              </button>

              <button
                onClick={() => onSendToPlayground(convertedTibetan)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <span className="tibetan-text">{t('typing.sendPlayground')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
