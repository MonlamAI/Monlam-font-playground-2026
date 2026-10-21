import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles, Layers, HelpCircle } from 'lucide-react';
import { analyzeTibetanStack } from '../../utils/tibetanEngine';
import { playKeyClick, playChime, playErrorSound, playVictorySound } from '../../utils/audioSynth';
import { wylieToTibetan } from '../../data/wylieTable';

interface StackPuzzleItem {
  id: number;
  stack: string;
  wylie: string;
  meaning: string;
  breakdown: {
    prefix?: string;
    superscript?: string;
    root: string;
    subjoined?: string;
    vowel?: string;
    suffix?: string;
  };
  explanation: string;
}

const STACK_PUZZLES: StackPuzzleItem[] = [
  {
    id: 1,
    stack: 'ཀྲ',
    wylie: 'kra',
    meaning: 'Kra (Subjoined Ra-tag)',
    breakdown: { root: 'ཀ (Ka)', subjoined: 'ྲ (Ra-tag)' },
    explanation: 'Basic Subjoined: The root consonant ཀ is joined at the bottom with ྲ (Ra-tag).',
  },
  {
    id: 2,
    stack: 'ཕྱ',
    wylie: 'phya',
    meaning: 'Phya (Subjoined Ya-tag)',
    breakdown: { root: 'ཕ (Pha)', subjoined: 'ྱ (Ya-tag)' },
    explanation: 'Subjoined Ya: The letter ཕ is combined with ྱ (Ya-tag), curving gracefully beneath.',
  },
  {
    id: 3,
    stack: 'རྒྱ',
    wylie: 'rgya',
    meaning: 'Rgya (Superscript Ra + Subjoined Ya)',
    breakdown: { superscript: 'ར (Ra-go)', root: 'ག (Ga)', subjoined: 'ྱ (Ya-tag)' },
    explanation: 'Tri-element stack: Superscript ར sits atop root ག, which carries subjoined ྱ.',
  },
  {
    id: 4,
    stack: 'སྤྲ',
    wylie: 'spra',
    meaning: 'Spra (Superscript Sa + Subjoined Ra)',
    breakdown: { superscript: 'ས (Sa-go)', root: 'པ (Pa)', subjoined: 'ྲ (Ra-tag)' },
    explanation: 'Superscript + Subjoined: The head is ས (Sa-go), root is པ, and foot is ྲ (Ra-tag).',
  },
  {
    id: 5,
    stack: 'སྒྲ',
    wylie: 'sgra',
    meaning: 'Sgra (Sound / Voice)',
    breakdown: { superscript: 'ས (Sa-go)', root: 'ག (Ga)', subjoined: 'ྲ (Ra-tag)' },
    explanation: 'Harmonic Stack: Sa-go ས + root ག + Ra-tag ྲ. Found in words like སྒྲ་དབྱངས (melody).',
  },
  {
    id: 6,
    stack: 'བསྒྲ',
    wylie: 'bsgra',
    meaning: 'Bsgra (Prefix Ba + Sa-go + Ga + Ra-tag)',
    breakdown: { prefix: 'བ (Ba)', superscript: 'ས (Sa-go)', root: 'ག (Ga)', subjoined: 'ྲ (Ra-tag)' },
    explanation: 'The Quad Stack: Prefix བ sits ahead of the vertical stack of Sa-go, root Ga, and Ra-tag.',
  },
  {
    id: 7,
    stack: 'བསྒྲུབས',
    wylie: 'bsgrubs',
    meaning: 'Accomplished / Perfected',
    breakdown: {
      prefix: 'བ (Ba)',
      superscript: 'ས (Sa-go)',
      root: 'ག (Ga)',
      subjoined: 'ྲ (Ra-tag)',
      vowel: 'ུ (Zhabkyu / u)',
      suffix: 'བ (Ba) + ས (Sa)',
    },
    explanation: 'The Master Stack: Contains all 6 anatomical Tibetan positions: Prefix, Superscript, Root, Subjoined, Vowel, and Suffixes!',
  },
];

export const StackPuzzleMode: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>('');
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentPuzzle = STACK_PUZZLES[currentIdx];

  const handleInputChange = (val: string) => {
    setTypedInput(val);
    const clean = val.trim();

    if (
      clean === currentPuzzle.stack ||
      clean.toLowerCase() === currentPuzzle.wylie.toLowerCase() ||
      wylieToTibetan(clean) === currentPuzzle.stack
    ) {
      setIsSolved(true);
      playVictorySound();
      setScore(s => s + 150);
    } else {
      playKeyClick();
    }
  };

  const handleNext = () => {
    setIsSolved(false);
    setTypedInput('');
    if (currentIdx < STACK_PUZZLES.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Modes
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 dark:text-slate-400">Puzzle {currentIdx + 1} of {STACK_PUZZLES.length}</span>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-bold">
            Score: {score} XP
          </span>
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6">
        
        {/* Giant Stack Display */}
        <div className="text-center py-6">
          <div className="inline-block p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-blue-200 dark:border-blue-500/30 shadow-xl">
            <span className="tibetan-text font-app text-7xl sm:text-8xl text-blue-600 dark:text-blue-300 font-bold">
              {currentPuzzle.stack}
            </span>
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white mt-3">{currentPuzzle.meaning}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400 font-mono">Wylie: {currentPuzzle.wylie}</div>
        </div>

        {/* Anatomical Breakdown Grid */}
        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
            <Layers className="w-4 h-4" />
            Anatomy of the Stack
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            {currentPuzzle.breakdown.prefix && (
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800">
                <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase">Prefix (སྔོན་འཇུག)</span>
                <span className="font-bold text-gray-900 dark:text-white">{currentPuzzle.breakdown.prefix}</span>
              </div>
            )}
            {currentPuzzle.breakdown.superscript && (
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800">
                <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase">Superscript (མགོ་ཅན)</span>
                <span className="font-bold text-cyan-400">{currentPuzzle.breakdown.superscript}</span>
              </div>
            )}
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800">
              <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase">Root Letter (མིང་གཞི)</span>
              <span className="font-bold text-blue-600 dark:text-blue-300">{currentPuzzle.breakdown.root}</span>
            </div>
            {currentPuzzle.breakdown.subjoined && (
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800">
                <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase">Subjoined (འདོགས་ཅན)</span>
                <span className="font-bold text-rose-400">{currentPuzzle.breakdown.subjoined}</span>
              </div>
            )}
            {currentPuzzle.breakdown.vowel && (
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800">
                <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase">Vowel (དབྱངས)</span>
                <span className="font-bold text-emerald-400">{currentPuzzle.breakdown.vowel}</span>
              </div>
            )}
            {currentPuzzle.breakdown.suffix && (
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800">
                <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase">Suffix (རྗེས་འཇུག)</span>
                <span className="font-bold text-purple-400">{currentPuzzle.breakdown.suffix}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 pt-2 leading-relaxed">
            {currentPuzzle.explanation}
          </p>
        </div>

        {/* Input & Solved State */}
        <div className="pt-2 text-center space-y-4">
          {!isSolved ? (
            <div className="max-w-xs mx-auto">
              <input
                type="text"
                value={typedInput}
                onChange={e => handleInputChange(e.target.value)}
                placeholder="Type this stack here..."
                className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-500/50 text-gray-900 dark:text-white tibetan-text font-app text-xl text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                autoFocus
              />
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-2">
                Type directly or use Wylie (<code className="text-blue-600 dark:text-blue-400">{currentPuzzle.wylie}</code>)
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 max-w-sm mx-auto space-y-3">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Stack Mastered! (+150 XP)
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-lg hover:bg-emerald-400 transition-colors"
              >
                Next Stack Puzzle →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
