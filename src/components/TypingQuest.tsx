import React, { useState, useCallback } from 'react';
import { Gamepad2 } from 'lucide-react';
import { QuestApp } from './quest/QuestApp';
import {
  loadUserStats,
  loadLevelProgress,
  loadAchievements
} from '../utils/questStorage';

/** Shell for Typing Quest — loads progress and mounts the quest module. */
export const TypingQuest: React.FC = () => {
  const [userStats, setUserStats] = useState(() => loadUserStats());
  const [progress, setProgress] = useState(() => loadLevelProgress());
  const [achievements, setAchievements] = useState(() => loadAchievements());

  const refreshProgress = useCallback(() => {
    setUserStats(loadUserStats());
    setProgress(loadLevelProgress());
    setAchievements(loadAchievements());
  }, []);

  return (
    <div className="pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Typing Quest</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              100-level Tibetan typing adventure — uses the same dynamic keyboard as Typing Practice.
            </p>
          </div>
        </div>
      </div>

      <QuestApp
        stats={userStats}
        progress={progress}
        achievements={achievements}
        onStatsUpdated={refreshProgress}
      />
    </div>
  );
};
