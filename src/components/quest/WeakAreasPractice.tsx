import React, { useState } from 'react';
import { ArrowLeft, Target, AlertCircle, Sparkles, Play, RotateCcw } from 'lucide-react';
import { loadUserStats } from '../../utils/questStorage';
import { TypingArena } from './TypingArena';
import { QuestLevel } from '../../types/typing';

export const WeakAreasPractice: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const stats = loadUserStats();
  const weakMap = stats.weakTokens || {};

  // Sort weak tokens by error frequency
  const sortedWeak = Object.entries(weakMap)
    .sort((a, b) => b[1] - a[1])
    .filter(([token]) => token.trim().length > 0)
    .slice(0, 10);

  const [activeDrill, setActiveDrill] = useState<QuestLevel | null>(null);

  const handleStartCustomDrill = () => {
    // Collect the tokens to practice
    const tokens = sortedWeak.length > 0 
      ? sortedWeak.map(([t]) => t)
      : ['རྒྱ', 'བསྒྲ', 'སྤྲ', 'བསྐྱ', 'ཕྱ', 'ཀྲ'];

    // Generate repetitive practice string with tsek
    const content = tokens.map(t => `${t}་ ${t}་ ${t}`).join('་ ') + '།';

    const drillLevel: QuestLevel = {
      id: 888,
      worldId: 4,
      name: 'Personalized Weak Areas Drill',
      tibetanName: 'ནོར་འཛོལ་དམིགས་སྦྱོང་།',
      isBoss: false,
      objective: 'Practice your most frequently missed Tibetan characters and stacks until muscle memory is perfected.',
      content,
      targetWpm: 15,
      starReqs: {
        oneStarMinAccuracy: 85,
        twoStarMinAccuracy: 92,
        threeStarMinAccuracy: 97,
        threeStarMinWpm: 18,
      },
      baseXp: 150,
      tags: ['targeted_practice'],
    };

    setActiveDrill(drillLevel);
  };

  if (activeDrill) {
    return (
      <TypingArena
        level={activeDrill}
        onBackToMap={() => setActiveDrill(null)}
        hasNextLevel={false}
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
          <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Targeted Weak Areas Practice</h2>
        </div>
      </div>

      {/* Overview Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Adaptive Diagnostic Engine
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Mistake Frequency & Targeted Drills
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-xl">
            We continuously log keystroke errors across all worlds. Below are the specific Tibetan letters and stacks where your fingers have hesitated or slipped.
          </p>
        </div>

        {/* Weak tokens list */}
        {sortedWeak.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sortedWeak.map(([token, count]) => (
              <div
                key={token}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-rose-500/30 flex items-center justify-between"
              >
                <div>
                  <span className="tibetan-text font-monlam-ouchan-1 text-3xl text-blue-600 dark:text-blue-300 font-bold block">
                    {token}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-mono">
                    {count} {count === 1 ? 'mistake' : 'mistakes'}
                  </span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 text-center space-y-2">
            <div className="text-3xl">✨</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">No Significant Weak Areas Logged Yet!</div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              As you play levels in the Quest, any difficult stacks will appear here for targeted training.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={handleStartCustomDrill}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Generate Custom Targeted Drill
          </button>
        </div>
      </div>
    </div>
  );
};
