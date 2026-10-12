import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Target, 
  Zap, 
  Star, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { UserStats, LevelProgress, Achievement, RankInfo } from '../../types/typing';
import { getRankForXp, exportProgressJson, importProgressJson, resetAllProgress } from '../../utils/questStorage';
import { RANKS_CONFIG } from '../../data/questLevels';

interface UserDashboardProps {
  stats: UserStats;
  progress: Record<number, LevelProgress>;
  achievements: Achievement[];
  onDataResetOrImported: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  stats,
  progress,
  achievements,
  onDataResetOrImported,
}) => {
  const currentRank = getRankForXp(stats.xp);
  const nextRankIdx = RANKS_CONFIG.findIndex(r => r.title === currentRank.title) + 1;
  const nextRank = RANKS_CONFIG[nextRankIdx] || currentRank;

  const xpIntoCurrentRank = Math.max(0, stats.xp - currentRank.minXp);
  const xpNeededForNext = Math.max(1, currentRank.maxXp - currentRank.minXp);
  const rankPercent = Math.min(100, Math.round((xpIntoCurrentRank / xpNeededForNext) * 100));

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = exportProgressJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tibetan-typing-quest-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importProgressJson(content);
        if (success) {
          setImportStatus('Progress restored successfully!');
          onDataResetOrImported();
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Failed to read valid backup JSON.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all Tibetan Typing Quest progress, stars, and XP? This cannot be undone.')) {
      resetAllProgress();
      onDataResetOrImported();
    }
  };

  const minutesTyped = Math.round(stats.totalTimeSeconds / 60);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile & Rank Banner */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20">
            {currentRank.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                Rank Status
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400">Total XP: <strong className="text-gray-900 dark:text-white">{stats.xp.toLocaleString()}</strong></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              {currentRank.title}
            </h2>
            <div className="tibetan-text font-monlam-ouchan-1 text-base text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
              {currentRank.tibetanTitle}
            </div>
          </div>
        </div>

        {/* Rank Progress Bar */}
        <div className="min-w-[240px] space-y-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-slate-300">
            <span>Next: <strong>{nextRank.title}</strong></span>
            <span className="font-mono text-blue-600 dark:text-blue-400">{rankPercent}%</span>
          </div>
          <div className="w-full bg-white dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-gray-200 dark:border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${rankPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-gray-400 dark:text-slate-500 text-right">
            {stats.xp} / {currentRank.maxXp} XP
          </div>
        </div>

      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800">
          <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase">Levels Cleared</div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.levelsCompleted} <span className="text-xs text-gray-400 dark:text-slate-500">/ 100</span></div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800">
          <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase">3-Star Levels</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{stats.threeStarLevels}</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800">
          <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase">Best Speed</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{stats.bestWpm} <span className="text-xs">WPM</span></div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800">
          <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase">Avg Speed</div>
          <div className="text-2xl font-extrabold text-gray-700 dark:text-slate-200 mt-1">{stats.averageWpm} <span className="text-xs">WPM</span></div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800">
          <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase">Avg Accuracy</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.averageAccuracy}%</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800">
          <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase">Total Practice</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">{minutesTyped} <span className="text-xs">mins</span></div>
        </div>
      </div>

      {/* Badges / Achievements Collection */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Achievements & Badges
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Unlock prestigious Tibetan lotsawa honors across your journey.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-semibold">
            {achievements.filter(a => a.unlockedAt).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-gray-900 dark:text-white'
                    : 'bg-white dark:bg-slate-950/40 border-slate-900 opacity-40 text-gray-400 dark:text-slate-500'
                }`}
              >
                <div className="text-3xl p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex-shrink-0">
                  {ach.icon}
                </div>
                <div>
                  <div className="font-bold text-xs">{ach.title}</div>
                  <div className="tibetan-text font-monlam-ouchan-1 text-[11px] text-blue-600 dark:text-blue-400">{ach.tibetanTitle}</div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 leading-snug">
                    {ach.description}
                  </p>
                  {isUnlocked && (
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Unlocked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup / Export / Reset Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Data Management & Cloud Sync Backup</h4>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Export your quest levels, stars, and XP as a portable JSON file to preserve your journey across browsers.
          </p>
          {importStatus && (
            <div className="text-xs font-semibold text-emerald-400 mt-1">
              {importStatus}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-slate-750 text-gray-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Backup
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-slate-750 text-gray-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Import Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Progress
          </button>
        </div>
      </div>

    </div>
  );
};
