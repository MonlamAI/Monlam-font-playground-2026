import { UserStats, LevelProgress, Achievement, RankInfo } from '../types/typing';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';
import { RANKS_CONFIG } from '../data/questLevels';

const STORAGE_KEY_PROGRESS = 'ttq_user_progress_v1';
const STORAGE_KEY_STATS = 'ttq_user_stats_v1';
const STORAGE_KEY_ACHIEVEMENTS = 'ttq_achievements_v1';

export function getInitialStats(): UserStats {
  return {
    xp: 0,
    totalTimeSeconds: 0,
    totalKeysTyped: 0,
    totalErrors: 0,
    currentStreak: 0,
    longestStreak: 0,
    bestWpm: 0,
    averageWpm: 0,
    averageAccuracy: 100,
    levelsCompleted: 0,
    threeStarLevels: 0,
    lastPlayedDate: new Date().toISOString().split('T')[0],
    dailyStreakDays: 1,
    completedDailyDates: [],
    weakTokens: {},
  };
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (raw) {
      return { ...getInitialStats(), ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed to load stats', err);
  }
  return getInitialStats();
}

export function saveUserStats(stats: UserStats) {
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats', err);
  }
}

export function loadLevelProgress(): Record<number, LevelProgress> {
  const defaults: Record<number, LevelProgress> = {
    1: {
      levelId: 1,
      unlocked: true,
      completed: false,
      stars: 0,
      bestAccuracy: 0,
      bestWpm: 0,
      highScore: 0,
      attempts: 0,
    },
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure level 1 is always unlocked
      parsed[1] = { ...(parsed[1] || defaults[1]), unlocked: true };
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load level progress', err);
  }

  return defaults;
}

export function saveLevelProgress(progress: Record<number, LevelProgress>) {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save level progress', err);
  }
}

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACHIEVEMENTS);
    if (raw) {
      const savedMap = new Map<string, Achievement>();
      const parsed: Achievement[] = JSON.parse(raw);
      parsed.forEach(a => savedMap.set(a.id, a));

      return INITIAL_ACHIEVEMENTS.map(initial => {
        const saved = savedMap.get(initial.id);
        return saved || initial;
      });
    }
  } catch (err) {
    console.error('Failed to load achievements', err);
  }
  return [...INITIAL_ACHIEVEMENTS];
}

export function saveAchievements(achievements: Achievement[]) {
  try {
    localStorage.setItem(STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (err) {
    console.error('Failed to save achievements', err);
  }
}

export function getRankForXp(xp: number): RankInfo {
  for (let i = RANKS_CONFIG.length - 1; i >= 0; i--) {
    if (xp >= RANKS_CONFIG[i].minXp) {
      return RANKS_CONFIG[i];
    }
  }
  return RANKS_CONFIG[0];
}

export function recordLevelResult(
  levelId: number,
  accuracy: number,
  wpm: number,
  stars: number,
  xpEarned: number,
  timeSec: number,
  errors: number,
  typedCount: number,
  missedTokens: string[]
): {
  newStats: UserStats;
  newProgress: Record<number, LevelProgress>;
  newlyUnlockedAchievements: Achievement[];
} {
  const currentStats = loadUserStats();
  const currentProgress = loadLevelProgress();
  const currentAchievements = loadAchievements();
  const newlyUnlockedAchievements: Achievement[] = [];

  // Update level progress
  const prevLevel = currentProgress[levelId] || {
    levelId,
    unlocked: true,
    completed: false,
    stars: 0,
    bestAccuracy: 0,
    bestWpm: 0,
    highScore: 0,
    attempts: 0,
  };

  const isFirstCompletion = !prevLevel.completed && stars > 0;
  const newStars = Math.max(prevLevel.stars, stars);
  const newBestAcc = Math.max(prevLevel.bestAccuracy, accuracy);
  const newBestWpm = Math.max(prevLevel.bestWpm, wpm);
  const calculatedScore = Math.round(accuracy * 10 + wpm * 15 + newStars * 100);

  currentProgress[levelId] = {
    levelId,
    unlocked: true,
    completed: prevLevel.completed || stars > 0,
    stars: newStars,
    bestAccuracy: newBestAcc,
    bestWpm: newBestWpm,
    highScore: Math.max(prevLevel.highScore, calculatedScore),
    attempts: prevLevel.attempts + 1,
    completedAt: new Date().toISOString(),
  };

  // Unlock next level if this level completed with at least 1 star
  if (stars > 0 && levelId < 100) {
    const nextId = levelId + 1;
    if (!currentProgress[nextId]) {
      currentProgress[nextId] = {
        levelId: nextId,
        unlocked: true,
        completed: false,
        stars: 0,
        bestAccuracy: 0,
        bestWpm: 0,
        highScore: 0,
        attempts: 0,
      };
    } else {
      currentProgress[nextId].unlocked = true;
    }
  }

  // Record weak tokens
  const weak = { ...(currentStats.weakTokens || {}) };
  missedTokens.forEach(t => {
    if (t.trim()) {
      weak[t] = (weak[t] || 0) + 1;
    }
  });

  // Count total completed and 3-stars
  let totalComp = 0;
  let totalThreeStars = 0;
  let totalStars = 0;
  Object.values(currentProgress).forEach(p => {
    if (p.completed) totalComp++;
    if (p.stars === 3) totalThreeStars++;
    totalStars += p.stars;
  });

  const updatedStats: UserStats = {
    ...currentStats,
    xp: currentStats.xp + xpEarned,
    totalTimeSeconds: currentStats.totalTimeSeconds + timeSec,
    totalKeysTyped: currentStats.totalKeysTyped + typedCount,
    totalErrors: currentStats.totalErrors + errors,
    bestWpm: Math.max(currentStats.bestWpm, wpm),
    averageWpm: Math.round(
      currentStats.averageWpm === 0 ? wpm : (currentStats.averageWpm * 4 + wpm) / 5
    ),
    averageAccuracy: Math.round(
      currentStats.averageAccuracy === 0 ? accuracy : (currentStats.averageAccuracy * 4 + accuracy) / 5
    ),
    levelsCompleted: totalComp,
    threeStarLevels: totalThreeStars,
    weakTokens: weak,
  };

  // Check achievements
  function checkUnlock(id: string, condition: boolean) {
    const ach = currentAchievements.find(a => a.id === id);
    if (ach && !ach.unlockedAt && condition) {
      ach.unlockedAt = new Date().toISOString();
      newlyUnlockedAchievements.push(ach);
    }
  }

  checkUnlock('first_steps', totalComp >= 1);
  checkUnlock('vowel_virtuoso', currentProgress[20]?.completed === true);
  checkUnlock('stack_slayer', currentProgress[40]?.completed === true);
  checkUnlock('scribe_initiate', currentProgress[50]?.completed === true);
  checkUnlock('mountain_climber', currentProgress[70]?.completed === true);
  checkUnlock('master_scribe', currentProgress[100]?.completed === true);
  checkUnlock('speed_demon_25', wpm >= 25);
  checkUnlock('speed_demon_40', wpm >= 40);
  checkUnlock('accuracy_master', accuracy >= 99);
  checkUnlock('star_collector', totalStars >= 50);

  saveUserStats(updatedStats);
  saveLevelProgress(currentProgress);
  saveAchievements(currentAchievements);

  return {
    newStats: updatedStats,
    newProgress: currentProgress,
    newlyUnlockedAchievements,
  };
}

export function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY_PROGRESS);
  localStorage.removeItem(STORAGE_KEY_STATS);
  localStorage.removeItem(STORAGE_KEY_ACHIEVEMENTS);
}

export function exportProgressJson(): string {
  const data = {
    stats: loadUserStats(),
    progress: loadLevelProgress(),
    achievements: loadAchievements(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importProgressJson(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.stats && data.progress) {
      saveUserStats(data.stats);
      saveLevelProgress(data.progress);
      if (data.achievements) saveAchievements(data.achievements);
      return true;
    }
  } catch (err) {
    console.error('Failed to import JSON', err);
  }
  return false;
}
