import React, { useState } from 'react';
import { WORLDS_CONFIG, getAllQuestLevels } from '../../data/questLevels';
import { LevelProgress, QuestLevel } from '../../types/typing';
import { Star, Lock, ShieldAlert, Award, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface WorldMapProps {
  progress: Record<number, LevelProgress>;
  onSelectLevel: (level: QuestLevel) => void;
  onOpenAssessment: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  progress,
  onSelectLevel,
  onOpenAssessment,
}) => {
  const allLevels = getAllQuestLevels();
  const [selectedWorldId, setSelectedWorldId] = useState<number>(1);

  const selectedWorld = WORLDS_CONFIG.find(w => w.id === selectedWorldId) || WORLDS_CONFIG[0];
  const levelsInWorld = allLevels.filter(l => l.worldId === selectedWorldId);

  // Calculate world completion
  const completedInWorld = levelsInWorld.filter(l => progress[l.id]?.completed).length;
  const starsInWorld = levelsInWorld.reduce((acc, l) => acc + (progress[l.id]?.stars || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            10 Worlds • 100 Levels Quest Map
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            The Himalayan Typing Expedition
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base mt-1 max-w-2xl font-normal">
            Journey from the 30 root consonants created by Thonmi Sambhota in ancient Lhasa, through sacred vowels and stacks, up to the legendary throne of the Master Scribe.
          </p>
        </div>

        {/* Adaptive Assessment Button */}
        <button
          onClick={onOpenAssessment}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-slate-750 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 text-xs font-semibold transition-all shadow-sm hover:scale-102"
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Take Typing Placement Assessment
        </button>
      </div>

      {/* Worlds Ribbon / Stepper (10 Worlds) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {WORLDS_CONFIG.map((world) => {
          const isSelected = world.id === selectedWorldId;
          const [startLvl, endLvl] = world.levelsRange;
          const worldLevels = allLevels.filter(l => l.worldId === world.id);
          const clearedCount = worldLevels.filter(l => progress[l.id]?.completed).length;
          const isWorldUnlocked = world.id === 1 || progress[startLvl]?.unlocked;

          return (
            <button
              key={world.id}
              onClick={() => setSelectedWorldId(world.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl text-left border transition-all relative ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 shadow-md shadow-blue-500/10 scale-102'
                  : 'bg-gray-50 dark:bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800 hover:border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'
              } ${!isWorldUnlocked ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-xl">{world.icon}</span>
                <span className="text-[10px] font-mono text-gray-500 dark:text-slate-400">
                  {clearedCount}/{worldLevels.length}
                </span>
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
                World {world.id}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-slate-400 tibetan-text font-monlam-ouchan-1 truncate max-w-[110px]">
                {world.tibetanName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected World Spotlight Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${selectedWorld.bgGradient} relative overflow-hidden shadow-2xl`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>{selectedWorld.icon} World {selectedWorld.id}</span>
              <span>•</span>
              <span className="tibetan-text font-monlam-ouchan-1 text-sm">{selectedWorld.tibetanName}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {selectedWorld.name}
            </h2>
            <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              {selectedWorld.description}
            </p>
          </div>

          {/* World Progress Pill */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-gray-200 dark:border-slate-800/80 min-w-[200px] space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-300 font-medium">
              <span>World Progress</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{completedInWorld} / {levelsInWorld.length}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedInWorld / levelsInWorld.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-300">
                <Star className="w-3 h-3 fill-amber-300" />
                {starsInWorld} Stars
              </span>
              <span>Boss: Level {selectedWorld.bossLevelId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Levels Grid (10 levels per world) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {levelsInWorld.map((level) => {
          const lvlProgress = progress[level.id];
          const isUnlocked = lvlProgress?.unlocked ?? (level.id === 1);
          const isCompleted = lvlProgress?.completed ?? false;
          const stars = lvlProgress?.stars || 0;

          return (
            <button
              key={level.id}
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(level)}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[170px] relative group ${
                level.isBoss
                  ? isUnlocked
                    ? 'bg-gradient-to-b from-blue-50 dark:from-blue-950/40 to-slate-900 border-blue-300 dark:border-blue-500/50 hover:border-blue-400 shadow-lg shadow-blue-500/10'
                    : 'bg-white dark:bg-slate-900/40 border-gray-200 dark:border-slate-800 opacity-50'
                  : isUnlocked
                  ? isCompleted
                    ? 'bg-white dark:bg-slate-900/80 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-white dark:bg-slate-900/80 border-gray-200 dark:border-slate-700/80 hover:border-blue-500/60 shadow-sm'
                  : 'bg-white dark:bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
              }`}
            >
              <div>
                {/* Top Level Number & Boss Pin */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    level.isBoss
                      ? 'bg-blue-600 text-white font-extrabold'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300'
                  }`}>
                    {level.isBoss ? '👑 BOSS' : `LVL ${level.id}`}
                  </span>

                  {!isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-600" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : null}
                </div>

                {/* Level Title */}
                <h3 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:text-blue-300 transition-colors line-clamp-1">
                  {level.name}
                </h3>
                <div className="text-sm tibetan-text font-monlam-ouchan-1 text-blue-600 dark:text-blue-400 font-semibold truncate mt-0.5">
                  {level.tibetanName}
                </div>

                <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-snug">
                  {level.objective}
                </p>
              </div>

              {/* Bottom Stars & Target */}
              <div className="pt-3 border-t border-gray-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                {/* 3-Star Badges */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(s => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        stars >= s
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">
                  {level.targetWpm} WPM
                </div>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
