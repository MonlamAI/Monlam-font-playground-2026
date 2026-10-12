import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw, Map, Zap, CheckCircle2, Award } from 'lucide-react';
import { QuestLevel, Achievement, RankInfo } from '../../types/typing';

interface LevelCompleteModalProps {
  level: QuestLevel;
  starsEarned: number;
  accuracy: number;
  wpm: number;
  xpEarned: number;
  score: number;
  newAchievements: Achievement[];
  newRank?: RankInfo;
  onNextLevel?: () => void;
  onRetry: () => void;
  onBackToMap: () => void;
  hasNextLevel: boolean;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  starsEarned,
  accuracy,
  wpm,
  xpEarned,
  score,
  newAchievements,
  newRank,
  onNextLevel,
  onRetry,
  onBackToMap,
  hasNextLevel,
}) => {
  useEffect(() => {
    // Launch celebratory confetti
    if (starsEarned >= 2 || level.isBoss) {
      confetti({
        particleCount: level.isBoss ? 120 : 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899'],
      });
    }
  }, [starsEarned, level.isBoss]);

  const isSuccess = starsEarned > 0;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow ambient background */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none ${
          isSuccess ? 'bg-blue-600' : 'bg-rose-500'
        }`} />

        {/* Header Title */}
        <div className="relative mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300">
            {level.isBoss ? '👑 Boss Guardian Trial' : `World ${level.worldId} • Level ${level.id}`}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {isSuccess ? (level.isBoss ? 'Guardian Defeated!' : 'Level Cleared!') : 'Keep Practicing!'}
          </h2>
          <p className="text-blue-600 dark:text-blue-400 tibetan-text font-monlam-ouchan-1 text-lg mt-1">{level.tibetanName}</p>
        </div>

        {/* Three-Star Rating Display */}
        <div className="flex justify-center items-center gap-4 my-6">
          {[1, 2, 3].map((starIdx) => {
            const hasStar = starsEarned >= starIdx;
            return (
              <div
                key={starIdx}
                className={`relative transition-all duration-500 transform ${
                  hasStar ? 'scale-110' : 'scale-90 opacity-40'
                }`}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border shadow-lg ${
                  hasStar
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 text-white shadow-amber-500/30'
                    : 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-600'
                }`}>
                  <Star className={`w-8 h-8 sm:w-9 sm:h-9 ${hasStar ? 'fill-white text-white' : 'text-gray-400 dark:text-slate-600'}`} />
                </div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400 font-bold mt-1.5">
                  {starIdx === 1 ? 'Clear' : starIdx === 2 ? 'Accuracy' : 'Speed'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-950/70 border border-gray-200 dark:border-slate-800">
            <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">Accuracy</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-0.5">{accuracy}%</div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Target: {level.starReqs.oneStarMinAccuracy}%</div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-950/70 border border-gray-200 dark:border-slate-800">
            <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">Speed</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{wpm} <span className="text-xs">WPM</span></div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Target: {level.targetWpm} WPM</div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-950/70 border border-gray-200 dark:border-slate-800">
            <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">XP Reward</div>
            <div className="text-xl sm:text-2xl font-bold text-cyan-400 mt-0.5">+{xpEarned}</div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Score: {score}</div>
          </div>
        </div>

        {/* Achievements / Rank popups if any */}
        {newAchievements.length > 0 && (
          <div className="my-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-left flex items-center gap-3">
            <div className="text-2xl">{newAchievements[0].icon}</div>
            <div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-300">New Achievement Unlocked!</div>
              <div className="text-xs text-gray-900 dark:text-white font-medium">{newAchievements[0].title}</div>
              <div className="text-[11px] text-gray-500 dark:text-slate-400">{newAchievements[0].description}</div>
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
          <button
            onClick={onBackToMap}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-slate-750 text-gray-600 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            <Map className="w-4 h-4" />
            World Map
          </button>

          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-slate-750 text-gray-600 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>

          {isSuccess && hasNextLevel && onNextLevel && (
            <button
              onClick={onNextLevel}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 hover:scale-102 transition-all"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
