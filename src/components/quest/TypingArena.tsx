import React, { useState, useEffect, useRef } from 'react';
import { QuestLevel, TypingResult, Achievement, RankInfo } from '../../types/typing';
import { MONLAM_FONTS } from '../../data/fontsData';
import { fontAssetLabel } from '../../utils/fontDisplay';
import { normalizeTibetan, calculateTypingMetrics, TSEK } from '../../utils/tibetanEngine';
import { playKeyClick, playChime, playErrorSound, playVictorySound } from '../../utils/audioSynth';
import { recordLevelResult } from '../../utils/questStorage';
import { LevelCompleteModal } from './LevelCompleteModal';
import { DynamicTibetanKeyboard } from '../DynamicTibetanKeyboard';
import { useTypingKeyboard } from '../../hooks/useTypingKeyboard';
import {
  layoutKeyFromCode,
  mappedCharFromKeyboardEvent
} from '../../utils/keyboardLayout';
import {
  Flame,
  RotateCcw,
  Map,
  Clock,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

interface TypingArenaProps {
  level: QuestLevel;
  onBackToMap: () => void;
  onNextLevel?: () => void;
  hasNextLevel: boolean;
  activeFontId?: string;
  onStatsUpdated?: () => void;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  level,
  onBackToMap,
  onNextLevel,
  hasNextLevel,
  activeFontId,
  onStatsUpdated
}) => {
  const normalizedTarget = normalizeTibetan(level.content);
  const targetChars = Array.from(normalizedTarget);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [missedChars, setMissedChars] = useState<string[]>([]);
  const [selectedFontId, setSelectedFontId] = useState(
    () => MONLAM_FONTS.find((f) => f.id === activeFontId)?.id || MONLAM_FONTS[0].id
  );

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(level.timeLimitSec || null);
  const [isFinished, setIsFinished] = useState(false);
  const [finishModalOpen, setFinishModalOpen] = useState(false);

  const [finalResult, setFinalResult] = useState<TypingResult | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [promotedRank] = useState<RankInfo | undefined>();

  const inputRef = useRef<HTMLInputElement>(null);
  const kb = useTypingKeyboard();

  const selectedFont = MONLAM_FONTS.find((f) => f.id === selectedFontId) || MONLAM_FONTS[0];

  useEffect(() => {
    inputRef.current?.focus();
  }, [level.id]);

  useEffect(() => {
    if (!startTime || isFinished) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const currentElapsed = Math.floor((now - startTime) / 1000);
      setElapsedSec(currentElapsed);

      if (level.timeLimitSec) {
        const remaining = Math.max(0, level.timeLimitSec - currentElapsed);
        setTimeLeft(remaining);
        if (remaining === 0) {
          finishGame(currentIndex, errorsCount, true);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [startTime, isFinished, level.timeLimitSec, currentIndex, errorsCount]);

  const handleStartTyping = () => {
    if (!startTime) setStartTime(Date.now());
  };

  const finishGame = (finalIndex: number, finalErrors: number, timedOut = false) => {
    if (isFinished) return;
    setIsFinished(true);
    const duration = Math.max(elapsedSec, 1);
    const { wpm, accuracy } = calculateTypingMetrics(finalIndex, finalErrors, duration);

    let stars = 0;
    if (!timedOut || finalIndex >= targetChars.length * 0.9) {
      if (accuracy >= level.starReqs.oneStarMinAccuracy) stars = 1;
      if (accuracy >= level.starReqs.twoStarMinAccuracy) stars = 2;
      if (
        accuracy >= level.starReqs.threeStarMinAccuracy &&
        wpm >= level.starReqs.threeStarMinWpm
      ) {
        stars = 3;
      }
    }

    const comboBonus = Math.round(maxCombo * 2);
    const starsBonus = stars * 40;
    const bossBonus = level.isBoss ? 150 : 0;
    const totalXp = level.baseXp + comboBonus + starsBonus + bossBonus;
    const finalScore = Math.round(accuracy * 10 + wpm * 15 + stars * 100 + maxCombo * 5);

    const result: TypingResult = {
      accuracy,
      wpm,
      timeElapsed: duration,
      starsEarned: stars,
      xpEarned: totalXp,
      rawErrors: finalErrors,
      maxCombo,
      score: finalScore,
      missedTokens: missedChars
    };

    setFinalResult(result);

    const { newlyUnlockedAchievements } = recordLevelResult(
      level.id,
      accuracy,
      wpm,
      stars,
      totalXp,
      duration,
      finalErrors,
      finalIndex,
      missedChars
    );

    setUnlockedAchievements(newlyUnlockedAchievements);
    onStatsUpdated?.();

    if (stars > 0) playVictorySound();
    else playErrorSound();

    setFinishModalOpen(true);
  };

  const processKeystroke = (char: string) => {
    if (isFinished) return;
    handleStartTyping();
    const expectedChar = targetChars[currentIndex];
    if (!expectedChar) return;

    // Non-breaking tsheg → standard tsheg. Latin space is kept as-is (Shift+Space).
    const normalized = char === '༌' ? TSEK : char;

    if (normalized === expectedChar) {
      playKeyClick();
      const nextIdx = currentIndex + 1;
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);

      if (nextCombo % 10 === 0 || expectedChar === TSEK) {
        playChime();
      }

      setCurrentIndex(nextIdx);

      if (nextIdx >= targetChars.length) {
        finishGame(nextIdx, errorsCount);
      }
    } else {
      playErrorSound();
      setErrorsCount((prev) => prev + 1);
      setCombo(0);
      setMissedChars((prev) => [...prev, expectedChar]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const mapped = mappedCharFromKeyboardEvent(
      e.nativeEvent,
      kb.keyboardLayout,
      kb.shiftPressed,
      kb.capsLock
    );
    if (mapped !== null) {
      e.preventDefault();
      kb.setLastKeyPressed(layoutKeyFromCode(e.nativeEvent.code) || null);
      processKeystroke(mapped);
      return;
    }

    // Fallback: native Tibetan Unicode (OS IME)
    if (e.key.length === 1 && e.key.charCodeAt(0) >= 0x0f00 && e.key.charCodeAt(0) <= 0x0fff) {
      e.preventDefault();
      processKeystroke(e.key);
      return;
    }

    if (e.key === ' ') {
      e.preventDefault();
      // Unshifted Space → tsheg; Shift+Space → Latin space
      processKeystroke(e.shiftKey || kb.shiftPressed ? ' ' : TSEK);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setErrorsCount(0);
    setCombo(0);
    setMaxCombo(0);
    setMissedChars([]);
    setStartTime(null);
    setElapsedSec(0);
    setTimeLeft(level.timeLimitSec || null);
    setIsFinished(false);
    setFinishModalOpen(false);
    setFinalResult(null);
    inputRef.current?.focus();
  };

  const liveMetrics = calculateTypingMetrics(currentIndex, errorsCount, elapsedSec);
  const expectedNextChar = targetChars[currentIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white text-xs font-semibold transition-colors"
          >
            <Map className="w-3.5 h-3.5" />
            World Map
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50">
                World {level.worldId}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-slate-100">
                {level.name}
              </h2>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 tibetan-text font-app">
              {level.tibetanName}
            </p>
          </div>
        </div>

        <select
          value={selectedFont.id}
          onChange={(e) => {
            setSelectedFontId(e.target.value);
            inputRef.current?.focus();
          }}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
        >
          {MONLAM_FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {fontAssetLabel(f)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Accuracy
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {liveMetrics.accuracy}%
            </div>
          </div>
          <Target className="w-5 h-5 text-emerald-500/50" />
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Speed
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {liveMetrics.wpm} <span className="text-xs font-normal">WPM</span>
            </div>
          </div>
          <Zap className="w-5 h-5 text-blue-500/50" />
        </div>

        <div
          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
            combo >= 10
              ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/40 text-orange-600 dark:text-orange-400 animate-pulse'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400'
          }`}
        >
          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider">Streak Combo</div>
            <div className="text-xl sm:text-2xl font-extrabold text-orange-500">x{combo}</div>
          </div>
          <Flame className={`w-5 h-5 ${combo >= 10 ? 'text-orange-500' : 'text-gray-300 dark:text-slate-600'}`} />
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              {level.timeLimitSec ? 'Time Remaining' : 'Time Elapsed'}
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">
              {level.timeLimitSec && timeLeft !== null ? `${timeLeft}s` : `${elapsedSec}s`}
            </div>
          </div>
          <Clock className="w-5 h-5 text-cyan-500/50" />
        </div>
      </div>

      <div
        onClick={() => inputRef.current?.focus()}
        className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-xs relative cursor-text min-h-[220px] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 pb-3 border-b border-gray-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>{level.objective}</span>
          </div>
          <div className="text-gray-400 dark:text-slate-500 font-mono text-[11px]">
            {currentIndex} / {targetChars.length} characters
          </div>
        </div>

        <div
          className={`${selectedFont.cssClass} tibetan-text text-3xl sm:text-4xl md:text-5xl leading-relaxed sm:leading-loose text-center select-none my-4 tracking-wide`}
        >
          {targetChars.map((char, idx) => {
            let color = 'text-gray-300 dark:text-slate-600';
            let bg = '';

            if (idx < currentIndex) {
              color = 'text-emerald-600 dark:text-emerald-400 font-semibold';
            } else if (idx === currentIndex) {
              color = 'text-blue-700 dark:text-blue-300 font-bold';
              bg =
                'bg-blue-100 dark:bg-blue-500/20 px-1 py-0.5 rounded-lg border-b-2 border-blue-500 shadow-sm animate-pulse';
            }

            return (
              <span key={idx} className={`${color} ${bg} transition-colors inline-block`}>
                {char === ' ' ? '␣' : char}
              </span>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
          <span>Type with the selected keyboard layout, or tap virtual keys below.</span>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Level
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          className="opacity-0 absolute top-0 left-0 w-full h-full cursor-default"
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label="Tibetan typing input"
        />
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
        expectedChar={expectedNextChar}
        onKeyClick={(char, layoutKey) => {
          kb.setLastKeyPressed(layoutKey);
          processKeystroke(char);
          inputRef.current?.focus();
        }}
      />

      {finishModalOpen && finalResult && (
        <LevelCompleteModal
          level={level}
          starsEarned={finalResult.starsEarned}
          accuracy={finalResult.accuracy}
          wpm={finalResult.wpm}
          xpEarned={finalResult.xpEarned}
          score={finalResult.score}
          newAchievements={unlockedAchievements}
          newRank={promotedRank}
          onNextLevel={onNextLevel}
          onRetry={handleReset}
          onBackToMap={onBackToMap}
          hasNextLevel={hasNextLevel}
        />
      )}
    </div>
  );
};
