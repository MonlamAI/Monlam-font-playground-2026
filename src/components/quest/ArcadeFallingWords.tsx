import React, { useState, useEffect, useRef } from 'react';
import { Heart, Trophy, RotateCcw, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import { playKeyClick, playChime, playErrorSound, playVictorySound } from '../../utils/audioSynth';
import { wylieToTibetan } from '../../data/wylieTable';
import { normalizeTibetan } from '../../utils/tibetanEngine';

interface FallingWord {
  id: number;
  word: string;
  wylie: string;
  meaning: string;
  x: number; // percentage (10 to 80%)
  y: number; // percentage (0 to 100%)
  speed: number;
}

const ARCADE_VOCABULARY = [
  { word: 'ཀ་བ', wylie: 'ka ba', meaning: 'Pillar' },
  { word: 'ཁ་བ', wylie: 'kha ba', meaning: 'Snow' },
  { word: 'གངས་རི', wylie: 'gangs ri', meaning: 'Glacier Peak' },
  { word: 'ཉི་མ', wylie: 'nyi ma', meaning: 'Sun' },
  { word: 'ཟླ་བ', wylie: 'zla ba', meaning: 'Moon' },
  { word: 'སྐར་མ', wylie: 'skar ma', meaning: 'Star' },
  { word: 'ཆུ་བོ', wylie: 'chu bo', meaning: 'River' },
  { word: 'མེ་ཏོག', wylie: 'me tog', meaning: 'Flower' },
  { word: 'ཇ་དྭངས', wylie: 'ja dwangs', meaning: 'Pure Tea' },
  { word: 'རྩམ་པ', wylie: 'rtsam pa', meaning: 'Roasted Barley' },
  { word: 'བཀྲ་ཤིས', wylie: 'bkra shis', meaning: 'Auspicious' },
  { word: 'བདེ་ལེགས', wylie: 'bde legs', meaning: 'Excellence' },
  { word: 'སྤྲིན་པ', wylie: 'sprin pa', meaning: 'Cloud' },
  { word: 'རྒྱལ་པོ', wylie: 'rgyal po', meaning: 'King' },
  { word: 'སྙིང་རྗེ', wylie: 'snying rje', meaning: 'Compassion' },
  { word: 'བྱམས་པ', wylie: 'byams pa', meaning: 'Loving-kindness' },
];

export const ArcadeFallingWords: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('ttq_arcade_highscore') || '0');
    } catch {
      return 0;
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const nextWordId = useRef<number>(1);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Spawn words loop
  useEffect(() => {
    if (gameOver) return;

    const spawnInterval = setInterval(() => {
      setWords(prev => {
        if (prev.length >= 4) return prev; // max 4 falling words at once
        const item = ARCADE_VOCABULARY[Math.floor(Math.random() * ARCADE_VOCABULARY.length)];
        const newWord: FallingWord = {
          id: nextWordId.current++,
          word: item.word,
          wylie: item.wylie,
          meaning: item.meaning,
          x: 10 + Math.random() * 70,
          y: 0,
          speed: 0.6 + Math.min(score / 500, 1.2),
        };
        return [...prev, newWord];
      });
    }, 2800);

    return () => clearInterval(spawnInterval);
  }, [gameOver, score]);

  // Movement loop
  useEffect(() => {
    if (gameOver) return;

    const moveInterval = setInterval(() => {
      setWords(prev => {
        const nextWords: FallingWord[] = [];
        let lostLife = false;

        prev.forEach(w => {
          const nextY = w.y + w.speed;
          if (nextY >= 92) {
            // Hit bottom!
            lostLife = true;
          } else {
            nextWords.push({ ...w, y: nextY });
          }
        });

        if (lostLife) {
          playErrorSound();
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameOver(true);
            }
            return Math.max(0, nextL);
          });
        }

        return nextWords;
      });
    }, 60);

    return () => clearInterval(moveInterval);
  }, [gameOver]);

  // Check matching input
  const handleInputChange = (val: string) => {
    setCurrentInput(val);
    const cleanInput = val.trim();
    if (!cleanInput) return;

    // Direct Tibetan or Wylie
    const target = words.find(w => 
      normalizeTibetan(w.word) === normalizeTibetan(cleanInput) ||
      w.wylie.replace(/\s+/g, '') === cleanInput.toLowerCase().replace(/\s+/g, '')
    );

    if (target) {
      playChime();
      const points = 100 + Math.round((100 - target.y) * 2);
      setScore(s => {
        const nextScore = s + points;
        if (nextScore > highScore) {
          setHighScore(nextScore);
          try {
            localStorage.setItem('ttq_arcade_highscore', String(nextScore));
          } catch {}
        }
        return nextScore;
      });

      // Remove popped word
      setWords(prev => prev.filter(w => w.id !== target.id));
      setCurrentInput('');
    }
  };

  const handleRestart = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWords([]);
    setCurrentInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Modes
        </button>

        <div className="flex items-center gap-6">
          {/* Lives */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(h => (
              <Heart
                key={h}
                className={`w-5 h-5 ${h <= lives ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`}
              />
            ))}
          </div>

          {/* Score */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold">Score:</span>
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{score}</span>
          </div>

          {/* High Score */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 font-mono">
            <Trophy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>High: {highScore}</span>
          </div>
        </div>
      </div>

      {/* Arcade Sky Canvas */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="w-full h-[460px] rounded-3xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 relative overflow-hidden shadow-2xl flex flex-col justify-between p-4 cursor-crosshair"
      >
        {/* Background stars / snow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

        {/* Falling Words */}
        {words.map(w => (
          <div
            key={w.id}
            className="absolute -translate-x-1/2 p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-blue-300 dark:border-blue-500/40 shadow-lg text-center transition-transform pointer-events-none"
            style={{ left: `${w.x}%`, top: `${w.y}%` }}
          >
            <div className="tibetan-text font-app text-2xl font-bold text-blue-600 dark:text-blue-300">
              {w.word}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-slate-400 font-mono mt-0.5">
              {w.wylie} • <span className="text-gray-400 dark:text-slate-500">{w.meaning}</span>
            </div>
          </div>
        ))}

        {/* Danger bottom line */}
        <div className="absolute bottom-16 left-0 right-0 h-1 bg-rose-500/30 border-b border-rose-500/50" />

        {/* Typing Input Bar */}
        <div className="relative z-10 w-full max-w-md mx-auto mt-auto mb-2">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={e => handleInputChange(e.target.value)}
            disabled={gameOver}
            placeholder="Type falling Tibetan word or Wylie..."
            className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900/95 border border-blue-300 dark:border-blue-500/50 text-gray-900 dark:text-white tibetan-text font-app text-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xl"
          />
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-white dark:bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-6 z-20">
            <div className="text-center space-y-4">
              <div className="text-4xl">🏔️</div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">The Snow Has Fallen!</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">Final Score: <span className="text-blue-600 dark:text-blue-400 font-bold">{score}</span></p>
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
            </div>
          </div>
        )}

      </div>

      <p className="text-center text-xs text-gray-400 dark:text-slate-500">
        Type either direct Tibetan script or standard Latin Wylie (e.g. <code className="text-blue-600 dark:text-blue-400">ka ba</code> or <code className="text-blue-600 dark:text-blue-400">gangs ri</code>) before the words hit the red baseline!
      </p>
    </div>
  );
};
