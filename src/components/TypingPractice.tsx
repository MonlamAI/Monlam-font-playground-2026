import React from 'react';
import { Keyboard, Play, RotateCcw, CheckCircle2, Award, Sparkles, Copy, Check, ArrowRight, BookOpen, Monitor, Command } from 'lucide-react';
import { TYPING_DRILLS } from '../data/tibetanData';
import { convertWylieToTibetan } from '../utils/wylieConverter';
import { MONLAM_FONTS } from '../data/fontsData';
import { publicApi } from '../admin/api';
import type { KeyboardAsset } from '../types/cms';
import {
  detectKeyboardOs,
  layoutKeyFromCode,
  mappedCharFromKeyboardEvent,
  resolveKeyboardLayout,
  type KeyboardOsLayout
} from '../utils/keyboardLayout';

const BODYIG_KEYBOARD_ID = 'monlam-bodyig-2025';
const STORAGE_KEYBOARD = 'monlam-typing-keyboard-id';
const STORAGE_OS = 'monlam-typing-os';

interface TypingPracticeProps {
  onSendToPlayground: (text: string) => void;
}

export const TypingPractice: React.FC<TypingPracticeProps> = ({ onSendToPlayground }) => {
  const [activeTab, setActiveTab] = React.useState<'tutor' | 'wylie'>('tutor');
  const [currentDrillIndex, setCurrentDrillIndex] = React.useState(0);
  const [userInput, setUserInput] = React.useState('');
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [wpm, setWpm] = React.useState(0);
  const [accuracy, setAccuracy] = React.useState(100);
  const [isFinished, setIsFinished] = React.useState(false);
  const [shiftPressed, setShiftPressed] = React.useState(false);
  const [lastKeyPressed, setLastKeyPressed] = React.useState<string | null>(null);
  const [availableKeyboards, setAvailableKeyboards] = React.useState<KeyboardAsset[]>([]);
  const [selectedKeyboardId, setSelectedKeyboardId] = React.useState('');
  const [osLayout, setOsLayout] = React.useState<KeyboardOsLayout>(() => {
    if (typeof window === 'undefined') return 'windows';
    const stored = window.localStorage.getItem(STORAGE_OS);
    if (stored === 'mac' || stored === 'windows') return stored;
    return detectKeyboardOs();
  });

  // Wylie converter state
  const [wylieInput, setWylieInput] = React.useState('om ma ni pad me hum / bkra shis bde legs');
  const [convertedTibetan, setConvertedTibetan] = React.useState('');
  const [selectedFont, setSelectedFont] = React.useState(MONLAM_FONTS[0].id);
  const [copied, setCopied] = React.useState(false);

  const currentDrill = TYPING_DRILLS[currentDrillIndex];
  const practiceKeyboard =
    availableKeyboards.find((k) => k.id === selectedKeyboardId) || availableKeyboards[0] || null;
  const keyboardTitle = practiceKeyboard?.name || 'Monlam Bodyig 2025 Keyboard';
  const keyboardLayout = resolveKeyboardLayout(practiceKeyboard, osLayout);

  React.useEffect(() => {
    let cancelled = false;
    publicApi
      .keyboards()
      .then((keyboards) => {
        if (cancelled) return;
        setAvailableKeyboards(keyboards);
        const storedId = window.localStorage.getItem(STORAGE_KEYBOARD);
        const preferred =
          keyboards.find((k) => k.id === storedId) ||
          keyboards.find((k) => k.id === BODYIG_KEYBOARD_ID) ||
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
      window.localStorage.setItem(STORAGE_KEYBOARD, selectedKeyboardId);
    }
  }, [selectedKeyboardId]);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_OS, osLayout);
  }, [osLayout]);

  // Update converted Wylie on change
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
    const mapped = mappedCharFromKeyboardEvent(e.nativeEvent, keyboardLayout, shiftPressed);
    if (mapped === null) return;
    e.preventDefault();
    setLastKeyPressed(layoutKeyFromCode(e.nativeEvent.code) || null);
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
      {/* Top Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Tibetan Typography & Typing Tutor</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Master the selected keyboard layout or convert live Wylie transliteration into authentic Unicode.
              </p>
            </div>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'tutor' ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
            }`}
          >
            Typing Tutor Drills
          </button>
          <button
            onClick={() => setActiveTab('wylie')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'wylie' ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
            }`}
          >
            Live Wylie Converter
          </button>
        </div>
      </div>

      {activeTab === 'tutor' ? (
        /* =================== TAB 1: TYPING TUTOR =================== */
        <div className="space-y-6">
          {/* Practice Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-xs">
            {/* Level selection chips */}
            <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Drills:</span>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <span>Speed:</span>
                    <span className="text-sm font-mono font-bold">{wpm} WPM</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span>Accuracy:</span>
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
                    className={`px-2.5 py-1 text-xs rounded-md transition font-medium ${
                      currentDrillIndex === idx
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    {idx + 1}. {d.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Target text display */}
            <div className="py-6">
              <div className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                <span>Target Tibetan Script:</span>
                <span className="text-gray-400 dark:text-slate-500 font-mono text-[11px]">{currentDrill.wylieGuide}</span>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700 select-none overflow-x-auto">
                <div className="tibetan-text font-monlam-ouchan-1 text-3xl sm:text-4xl text-gray-800 dark:text-slate-100 tracking-wide flex flex-wrap gap-1 items-center">
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

            {/* Live Input Field */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleMappedKeyDown}
                  disabled={isFinished}
                  placeholder="Type the Tibetan characters above using your keyboard or click virtual keys below..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-blue-400 dark:border-blue-600 rounded-xl text-xl sm:text-2xl text-gray-900 dark:text-slate-100 tibetan-text font-monlam-ouchan-1 focus:outline-hidden focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition shadow-inner"
                  autoFocus
                />
                <button
                  onClick={handleResetDrill}
                  title="Reset typing drill"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 bg-gray-100 dark:bg-slate-800 rounded-lg transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Drill hint */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-700 dark:text-slate-300">Tip:</span>
                  <span>{currentDrill.hint}</span>
                </div>
                {isFinished && (
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Completed!
                    </span>
                    <button
                      onClick={handleNextDrill}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 transition"
                    >
                      Next Drill →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Visual Tibetan Keyboard */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg border border-slate-800">
            <div className="flex flex-col gap-3 pb-3 mb-3 border-b border-slate-800">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Keyboard className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-sky-300 truncate">{keyboardTitle}</h3>
                    {practiceKeyboard?.tibetanName ? (
                      <p className="text-[11px] text-slate-400 tibetan-text truncate">
                        {practiceKeyboard.tibetanName}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShiftPressed(!shiftPressed)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                      shiftPressed
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {shiftPressed ? 'SHIFT: ON' : 'SHIFT: OFF'}
                  </button>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Keys follow the selected OS layout
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
                    Keyboard
                  </span>
                  <select
                    value={selectedKeyboardId}
                    onChange={(e) => setSelectedKeyboardId(e.target.value)}
                    className="text-xs font-medium bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-100 max-w-[16rem]"
                  >
                    {availableKeyboards.length === 0 ? (
                      <option value="">Monlam Bodyig 2025 Keyboard</option>
                    ) : (
                      availableKeyboards.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))
                    )}
                  </select>
                </label>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Layout
                  </span>
                  <div className="flex items-center rounded-lg border border-slate-700 p-0.5 bg-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setOsLayout('windows')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                        osLayout === 'windows'
                          ? 'bg-sky-500 text-slate-950'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      Windows Layout
                    </button>
                    <button
                      type="button"
                      onClick={() => setOsLayout('mac')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                        osLayout === 'mac'
                          ? 'bg-sky-500 text-slate-950'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Command className="w-3.5 h-3.5" />
                      Mac Layout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Keys Rendering */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-flex flex-col gap-1.5 min-w-[720px] w-full">
                {keyboardLayout.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-1.5 justify-center">
                    {row.map((k) => {
                      const displayChar = shiftPressed ? k.shiftChar : k.char;
                      return (
                        <button
                          key={`${k.key}-${rIdx}`}
                          onClick={() => {
                            applyTypedValue(userInput + displayChar);
                            setLastKeyPressed(k.key);
                          }}
                          className={`flex-1 min-w-[38px] max-w-[56px] h-12 hover:bg-slate-700 active:bg-sky-700 border border-slate-700/80 rounded-lg flex flex-col justify-between p-1 transition shadow-xs group ${
                            lastKeyPressed === k.key ? 'bg-sky-700' : 'bg-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full px-0.5">
                            <span className="text-[10px] text-amber-400/80 group-hover:text-amber-300 font-mono">
                              {k.shiftChar}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">{k.label}</span>
                          </div>
                          <span className="tibetan-text font-monlam-ouchan-1 text-lg text-white font-bold self-center">
                            {displayChar}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =================== TAB 2: LIVE WYLIE TRANSLITERATOR =================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Wylie Input & Options */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Romanized Wylie Input:</h3>
              <span className="text-xs text-gray-400 dark:text-slate-500">Standard Extended Wylie (EWTS)</span>
            </div>

            <textarea
              rows={5}
              value={wylieInput}
              onChange={(e) => setWylieInput(e.target.value)}
              placeholder="Type in Wylie, e.g. 'bod yig', 'om mani padme hum', 'bkra shis bde legs'..."
              className="w-full p-3 font-mono text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />

            {/* Quick Wylie sample pills */}
            <div className="space-y-1.5">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Quick examples:</span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { label: 'Om Mani Padme Hum', val: 'om ma ni pad me hum' },
                  { label: 'Tashi Delek', val: 'bkra shis bde legs' },
                  { label: 'Bod Yig (Tibetan)', val: 'bod yig' },
                  { label: 'Buddha Dharma Sangha', val: 'sangs rgyas chos dge \'dun' },
                  { label: 'All Sentient Beings', val: 'sems can thams cad bde ba dang ldan par gyur cig' }
                ].map((sample) => (
                  <button
                    key={sample.label}
                    onClick={() => setWylieInput(sample.val)}
                    className="px-2.5 py-1 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-md transition"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wylie Cheat Sheet Card */}
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 rounded-lg text-xs space-y-2 text-blue-900 dark:text-blue-200">
              <div className="font-semibold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Wylie Quick Guide:</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[11px]">
                <div>ka = ཀ | kha = ཁ | ga = ག</div>
                <div>nga = ང | ca = ཅ | cha = ཆ</div>
                <div>kya = ཀྱ | kra = ཀྲ | kla = ཀླ</div>
                <div>rka = རྐ | ska = སྐ | lka = ལྐ</div>
                <div>i, u, e, o = ི, ུ, ེ, ོ</div>
                <div>space = ་ (tsheg) | / = ། (shad)</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Converted Unicode Output & Font Preview */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Converted Tibetan Unicode:</h3>
                </div>

                {/* Font Selector */}
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="text-xs font-semibold px-2 py-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md dark:text-slate-200"
                >
                  {MONLAM_FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Converted Output Display */}
              <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 min-h-[160px] flex items-center justify-center">
                <div
                  className={`${chosenFont.cssClass} tibetan-text text-3xl sm:text-4xl text-gray-900 dark:text-slate-100 leading-relaxed text-center break-words`}
                >
                  {convertedTibetan || '...'}
                </div>
              </div>
            </div>

            {/* Actions: Copy & Send to Font Playground */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleCopyConverted}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Unicode'}</span>
              </button>

              <button
                onClick={() => onSendToPlayground(convertedTibetan)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <span>Send to Font Playground</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
