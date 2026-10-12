export type GameMode =
  | 'quest'
  | 'learn'
  | 'arcade'
  | 'puzzle'
  | 'battle'
  | 'daily'
  | 'weak_areas'
  | 'assessment'
  | 'dashboard';

export type InputMethod = 'direct' | 'wylie' | 'onscreen';

export interface LevelStarRequirements {
  oneStarMinAccuracy: number; // e.g. 75
  twoStarMinAccuracy: number; // e.g. 88
  threeStarMinAccuracy: number; // e.g. 95
  threeStarMinWpm: number; // e.g. 20
}

export interface QuestLevel {
  id: number; // 1 to 100
  worldId: number; // 1 to 10
  name: string;
  tibetanName: string;
  isBoss: boolean;
  bossTitle?: string;
  objective: string;
  content: string; // The Tibetan text to type
  englishMeaning?: string;
  pronunciation?: string;
  targetWpm: number;
  timeLimitSec?: number; // optional time countdown
  starReqs: LevelStarRequirements;
  baseXp: number;
  tags: string[]; // e.g. ['consonants', 'vowels', 'stacks']
}

export interface WorldDefinition {
  id: number; // 1 to 10
  name: string;
  tibetanName: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  themeColor: string;
  bgGradient: string;
  levelsRange: [number, number];
  bossLevelId: number;
}

export interface LevelProgress {
  levelId: number;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
  bestAccuracy: number;
  bestWpm: number;
  highScore: number;
  attempts: number;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  tibetanTitle: string;
  description: string;
  icon: string;
  category: 'progression' | 'speed' | 'accuracy' | 'combo' | 'mastery';
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserStats {
  xp: number;
  totalTimeSeconds: number;
  totalKeysTyped: number;
  totalErrors: number;
  currentStreak: number;
  longestStreak: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  levelsCompleted: number;
  threeStarLevels: number;
  lastPlayedDate: string;
  dailyStreakDays: number;
  completedDailyDates: string[];
  weakTokens: Record<string, number>; // token -> error count
}

export interface RankInfo {
  title: string;
  tibetanTitle: string;
  icon: string;
  minXp: number;
  maxXp: number;
  color: string;
}

export interface TypingResult {
  accuracy: number;
  wpm: number;
  timeElapsed: number;
  starsEarned: number;
  xpEarned: number;
  rawErrors: number;
  maxCombo: number;
  score: number;
  missedTokens: string[];
}
