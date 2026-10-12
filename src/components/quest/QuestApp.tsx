import React, { useState } from 'react';
import { GameMode, QuestLevel, UserStats, LevelProgress, Achievement } from '../../types/typing';
import { WorldMap } from './WorldMap';
import { TypingArena } from './TypingArena';
import { AssessmentModal } from './AssessmentModal';
import { ArcadeFallingWords } from './ArcadeFallingWords';
import { StackPuzzleMode } from './StackPuzzleMode';
import { BattleAiMode } from './BattleAiMode';
import { DailyChallengeMode } from './DailyChallengeMode';
import { WeakAreasPractice } from './WeakAreasPractice';
import { LearnCurriculum } from './LearnCurriculum';
import { UserDashboard } from './UserDashboard';
import { getAllQuestLevels } from '../../data/questLevels';
import { 
  Map, 
  Gamepad2, 
  BookOpen, 
  Layers, 
  Swords, 
  Calendar, 
  Target, 
  Trophy
} from 'lucide-react';

interface QuestAppProps {
  stats: UserStats;
  progress: Record<number, LevelProgress>;
  achievements: Achievement[];
  onStatsUpdated: () => void;
  activeFontId?: string;
}

export const QuestApp: React.FC<QuestAppProps> = ({
  stats,
  progress,
  achievements,
  onStatsUpdated,
  activeFontId,
}) => {
  const [currentMode, setCurrentMode] = useState<GameMode>('quest');
  const [activeLevel, setActiveLevel] = useState<QuestLevel | null>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);

  const allLevels = getAllQuestLevels();

  const handleSelectLevel = (level: QuestLevel) => {
    setActiveLevel(level);
  };

  const handleNextLevel = () => {
    if (!activeLevel) return;
    const nextId = activeLevel.id + 1;
    const nextLvl = allLevels.find(l => l.id === nextId);
    if (nextLvl) {
      setActiveLevel(nextLvl);
    } else {
      setActiveLevel(null);
    }
  };

  // If a level is currently active, render the TypingArena
  if (activeLevel) {
    return (
      <TypingArena
        level={activeLevel}
        onBackToMap={() => setActiveLevel(null)}
        onNextLevel={handleNextLevel}
        hasNextLevel={activeLevel.id < 100}
        activeFontId={activeFontId}
        onStatsUpdated={onStatsUpdated}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Sub-mode Navigation Pill Bar — matches Typing Practice tab styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl border border-gray-200 dark:border-slate-700 overflow-x-auto">
          {(
            [
              { id: 'quest' as const, icon: Map, label: '100 Levels Map' },
              { id: 'learn' as const, icon: BookOpen, label: 'Learn' },
              { id: 'arcade' as const, icon: Gamepad2, label: 'Arcade Falling Words' },
              { id: 'puzzle' as const, icon: Layers, label: 'Stack Puzzle' },
              { id: 'battle' as const, icon: Swords, label: 'AI Duel' },
              { id: 'daily' as const, icon: Calendar, label: 'Daily Challenge' },
              { id: 'weak_areas' as const, icon: Target, label: 'Weak Areas Drill' },
              { id: 'dashboard' as const, icon: Trophy, label: 'Progress Dashboard' }
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentMode(id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                currentMode === id
                  ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Mode View */}
      {currentMode === 'quest' && (
        <WorldMap
          progress={progress}
          onSelectLevel={handleSelectLevel}
          onOpenAssessment={() => setIsAssessmentOpen(true)}
        />
      )}

      {currentMode === 'learn' && (
        <LearnCurriculum
          onBack={() => setCurrentMode('quest')}
          onLaunchLevel={(lvlId) => {
            const found = allLevels.find(l => l.id === lvlId);
            if (found) setActiveLevel(found);
          }}
        />
      )}

      {currentMode === 'arcade' && (
        <ArcadeFallingWords onBack={() => setCurrentMode('quest')} />
      )}

      {currentMode === 'puzzle' && (
        <StackPuzzleMode onBack={() => setCurrentMode('quest')} />
      )}

      {currentMode === 'battle' && (
        <BattleAiMode onBack={() => setCurrentMode('quest')} />
      )}

      {currentMode === 'daily' && (
        <DailyChallengeMode onBack={() => setCurrentMode('quest')} />
      )}

      {currentMode === 'weak_areas' && (
        <WeakAreasPractice onBack={() => setCurrentMode('quest')} />
      )}

      {currentMode === 'dashboard' && (
        <UserDashboard
          stats={stats}
          progress={progress}
          achievements={achievements}
          onDataResetOrImported={onStatsUpdated}
        />
      )}

      {/* Placement Assessment Modal */}
      {isAssessmentOpen && (
        <AssessmentModal
          onClose={() => setIsAssessmentOpen(false)}
          onRecommendedWorld={(worldId) => {
            onStatsUpdated();
          }}
        />
      )}

    </div>
  );
};
