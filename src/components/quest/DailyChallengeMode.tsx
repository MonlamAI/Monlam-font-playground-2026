import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Trophy, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { TypingArena } from './TypingArena';
import { QuestLevel } from '../../types/typing';

export const DailyChallengeMode: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [dailyBest, setDailyBest] = useState<{ wpm: number; accuracy: number } | null>(() => {
    try {
      const saved = localStorage.getItem(`ttq_daily_${todayStr}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const dailyLevel: QuestLevel = {
    id: 999,
    worldId: 5,
    name: `Daily Pilgrimage • ${todayStr}`,
    tibetanName: 'ཉིན་རེའི་ཉམས་ལེན།',
    isBoss: false,
    objective: 'Complete today\'s sacred Tibetan text with 95%+ accuracy and high speed.',
    content: '༄༅། །དགེ་བ་འདི་ཡིས་སྐྱེ་བོ་ཀུན། བསོད་ནམས་ཡེ་ཤེས་ཚོགས་བསགས་ཤིང་། བསོད་ནམས་ཡེ་ཤེས་ལས་བྱུང་བའི། དམ་པ་སྐུ་གཉིས་ཐོབ་པར་ཤོག',
    englishMeaning: 'By this merit may all beings accumulate virtue and wisdom, and attain the two sacred Buddha-bodies.',
    targetWpm: 25,
    starReqs: {
      oneStarMinAccuracy: 80,
      twoStarMinAccuracy: 90,
      threeStarMinAccuracy: 95,
      threeStarMinWpm: 25,
    },
    baseXp: 300,
    tags: ['daily'],
  };

  const handleStatsUpdated = () => {
    // Refresh daily best
    try {
      const saved = localStorage.getItem(`ttq_daily_${todayStr}`);
      if (saved) setDailyBest(JSON.parse(saved));
    } catch {}
  };

  if (isPlaying) {
    return (
      <TypingArena
        level={dailyLevel}
        onBackToMap={() => setIsPlaying(false)}
        hasNextLevel={false}
        onStatsUpdated={handleStatsUpdated}
      />
    );
  }

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
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Daily Tibetan Challenge</h2>
        </div>
      </div>

      {/* Daily Challenge Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-500/30 shadow-2xl space-y-6 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Today's Date: {todayStr}
        </div>

        <div>
          <p className="tibetan-text font-monlam-ouchan-1 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {dailyLevel.tibetanName}
          </p>
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 mt-1">
            Sacred Dedication Prayer
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400 max-w-lg mx-auto mt-2 leading-relaxed">
            {dailyLevel.objective}
          </p>
        </div>

        {/* Targets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800">
            <div className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-semibold">Target Accuracy</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">95%+</div>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800">
            <div className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-semibold">Target Speed</div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">25 WPM</div>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-semibold">XP Reward</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">+300 XP</div>
          </div>
        </div>

        {/* Best Score for today */}
        {dailyBest && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 max-w-sm mx-auto flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Completed Today!
            </span>
            <span className="text-gray-600 dark:text-slate-300 font-mono">
              Best: {dailyBest.wpm} WPM • {dailyBest.accuracy}% Acc
            </span>
          </div>
        )}

        {/* Start Button */}
        <div>
          <button
            onClick={() => setIsPlaying(true)}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
          >
            {dailyBest ? 'Beat Your Score Today' : 'Begin Daily Challenge'}
          </button>
        </div>

      </div>
    </div>
  );
};
