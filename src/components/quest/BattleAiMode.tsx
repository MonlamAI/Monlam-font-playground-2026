import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Swords, RotateCcw, Trophy, Zap, User } from 'lucide-react';
import { normalizeTibetan, calculateTypingMetrics } from '../../utils/tibetanEngine';
import { playKeyClick, playChime, playErrorSound, playVictorySound } from '../../utils/audioSynth';
import { wylieToTibetan } from '../../data/wylieTable';

interface BotProfile {
  id: string;
  name: string;
  tibetanName: string;
  wpm: number;
  avatar: string;
  description: string;
}

const BOTS: BotProfile[] = [
  { id: 'novice', name: 'Novice Monk', tibetanName: 'གྲྭ་ཕྲུག', wpm: 15, avatar: '🐣', description: 'Just arrived at the monastic courtyard. Gentle and steady.' },
  { id: 'scribe', name: 'Scholarly Scribe', tibetanName: 'དཔེ་ཆ་བ།', wpm: 28, avatar: '📜', description: 'Experienced scriptorium copyist with swift fingers.' },
  { id: 'lotsawa', name: 'Grand Lotsawa', tibetanName: 'ལོ་ཙཱ་བ།', wpm: 45, avatar: '👑', description: 'Legendary master translator of sacred sutras.' },
];

const BATTLE_TEXT = 'བཀྲ་ཤིས་བདེ་ལེགས་ཕུན་སུམ་ཚོགས། འགྲོ་བ་ཀུན་བདེ་སྐྱིད་དང་ལྡན་པར་གྱུར་ཅིག';

export const BattleAiMode: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedBot, setSelectedBot] = useState<BotProfile>(BOTS[1]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playerProgress, setPlayerProgress] = useState<number>(0);
  const [botProgress, setBotProgress] = useState<number>(0);
  const [winner, setWinner] = useState<'player' | 'bot' | null>(null);
  const [wyliePending, setWyliePending] = useState<string>('');

  const targetChars = Array.from(normalizeTibetan(BATTLE_TEXT));
  const inputRef = useRef<HTMLInputElement>(null);

  // Bot progress interval
  useEffect(() => {
    if (!isPlaying || winner) return;

    // Bot speed interval: 1 character every (60 / (wpm * 4)) seconds
    const intervalMs = Math.round((60000 / (selectedBot.wpm * 4)));
    const botInterval = setInterval(() => {
      setBotProgress(p => {
        const next = p + 1;
        if (next >= targetChars.length) {
          setWinner('bot');
          playErrorSound();
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(botInterval);
  }, [isPlaying, winner, selectedBot.wpm, targetChars.length]);

  const handleStart = () => {
    setIsPlaying(true);
    setPlayerProgress(0);
    setBotProgress(0);
    setWinner(null);
    setWyliePending('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPlaying || winner) return;

    const expected = targetChars[playerProgress];
    if (!expected) return;

    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (expected === '་') {
        recordCorrect();
      }
      return;
    }

    if (/[a-zA-Z]/.test(e.key)) {
      e.preventDefault();
      const nextPending = wyliePending + e.key.toLowerCase();
      const converted = wylieToTibetan(nextPending);

      if (converted === expected) {
        setWyliePending('');
        recordCorrect();
      } else {
        setWyliePending(nextPending);
      }
      return;
    }

    if (e.key.length === 1 && e.key === expected) {
      e.preventDefault();
      recordCorrect();
    }
  };

  const recordCorrect = () => {
    playKeyClick();
    const next = playerProgress + 1;
    setPlayerProgress(next);

    if (next >= targetChars.length) {
      setWinner('player');
      playVictorySound();
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

        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Lotsawa Typing Duel</h2>
        </div>
      </div>

      {/* Opponent Selection (if not playing) */}
      {!isPlaying && !winner && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 space-y-6 text-center">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Select Your Scribe Rival</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BOTS.map(bot => (
              <div
                key={bot.id}
                onClick={() => setSelectedBot(bot)}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                  selectedBot.id === bot.id
                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-white dark:bg-slate-950/60 border-gray-200 dark:border-slate-800 hover:border-gray-200 dark:border-slate-700'
                }`}
              >
                <div className="text-3xl mb-2">{bot.avatar}</div>
                <div className="text-sm tibetan-text font-app font-bold text-gray-900 dark:text-white">{bot.tibetanName}</div>
                <div className="text-[11px] font-medium text-gray-500 dark:text-slate-400">{bot.name}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400 mt-2 font-mono">{bot.wpm} WPM Pace</div>
                <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">{bot.description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
          >
            Start Race Duel!
          </button>
        </div>
      )}

      {/* Race Track Screen */}
      {(isPlaying || winner) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-8">
          
          {/* Dual Progress Tracks */}
          <div className="space-y-4">
            {/* Player Track */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-300 font-medium mb-1.5">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <User className="w-3.5 h-3.5" />
                  You (Typist)
                </span>
                <span>{Math.round((playerProgress / targetChars.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white dark:bg-slate-950 h-3 rounded-full overflow-hidden relative">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-150"
                  style={{ width: `${(playerProgress / targetChars.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Bot Track */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-300 font-medium mb-1.5">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                  <span>{selectedBot.avatar}</span>
                  {selectedBot.name} ({selectedBot.wpm} WPM)
                </span>
                <span>{Math.round((botProgress / targetChars.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white dark:bg-slate-950 h-3 rounded-full overflow-hidden relative">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(botProgress / targetChars.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Typing Target Stream */}
          <div 
            onClick={() => inputRef.current?.focus()}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 text-center select-none cursor-text"
          >
            <div className="tibetan-text font-app text-2xl sm:text-3xl leading-relaxed text-gray-400 dark:text-slate-500">
              {targetChars.map((ch, idx) => {
                let color = 'text-gray-400 dark:text-slate-600';
                if (idx < playerProgress) color = 'text-emerald-400 font-bold';
                else if (idx === playerProgress) color = 'text-blue-600 dark:text-blue-300 font-extrabold underline';
                return <span key={idx} className={color}>{ch}</span>;
              })}
            </div>
            <div className="text-xs text-gray-400 dark:text-slate-500 font-mono mt-3">
              Type directly or using Wylie. Space = Tsek (་).
            </div>
          </div>

          {/* Winner Banner */}
          {winner && (
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-3">
              <div className="text-4xl">{winner === 'player' ? '🏆' : '🕯️'}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {winner === 'player' ? 'Victory! You Outpaced the Rival!' : `${selectedBot.name} Finished First!`}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {winner === 'player' ? '+250 XP Awarded' : 'Practice your combinations to increase speed.'}
              </p>
              <button
                onClick={handleStart}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
              >
                Race Again
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            className="opacity-0 absolute"
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      )}

    </div>
  );
};
