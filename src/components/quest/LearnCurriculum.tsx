import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Layers, Type, Sparkles, CheckCircle2 } from 'lucide-react';
import { QuestLevel } from '../../types/typing';

interface LearnCurriculumProps {
  onBack: () => void;
  onLaunchLevel: (levelId: number) => void;
}

export const LearnCurriculum: React.FC<LearnCurriculumProps> = ({
  onBack,
  onLaunchLevel,
}) => {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'vowels' | 'stacks' | 'punctuation'>('alphabet');

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
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
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Tibetan Typing Curriculum</h2>
        </div>
      </div>

      {/* Curriculum Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('alphabet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'alphabet' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          1. The 30 Consonants (ཀ་མད)
        </button>

        <button
          onClick={() => setActiveTab('vowels')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'vowels' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          2. The 4 Vowels (དབྱངས)
        </button>

        <button
          onClick={() => setActiveTab('stacks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stacks' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          3. Stacks & Conjuncts (མགོ་འདོགས)
        </button>

        <button
          onClick={() => setActiveTab('punctuation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'punctuation' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          4. Punctuation (ཚེག་དང་ཤད)
        </button>
      </div>

      {/* Alphabet Tab */}
      {activeTab === 'alphabet' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">The 30 Root Consonants</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Arranged in 8 physiological rows by place of articulation (velar, palatal, dental, labial, etc.). Each consonant carries an inherent vowel sound "a".
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { row: 'Velars (Gutteral)', letters: 'ཀ་ ཁ་ ག་ ང་', wylie: 'ka, kha, ga, nga', lvl: 1 },
                { row: 'Palatals', letters: 'ཅ་ ཆ་ ཇ་ ཉ་', wylie: 'ca, cha, ja, nya', lvl: 2 },
                { row: 'Dentals', letters: 'ཏ་ ཐ་ ད་ ན་', wylie: 'ta, tha, da, na', lvl: 3 },
                { row: 'Labials', letters: 'པ་ ཕ་ བ་ མ་', wylie: 'pa, pha, ba, ma', lvl: 4 },
                { row: 'Affricates', letters: 'ཙ་ ཚ་ ཛ་ ཝ་', wylie: 'tsa, tsha, dza, wa', lvl: 5 },
                { row: 'Sibilants', letters: 'ཞ་ ཟ་ འ་ ཡ་', wylie: 'zha, za, \'a, ya', lvl: 6 },
                { row: 'Liquids', letters: 'ར་ ལ་ ཤ་ ས་', wylie: 'ra, la, sha, sa', lvl: 7 },
                { row: 'Aspirate & Base', letters: 'ཧ་ ཨ་', wylie: 'ha, a', lvl: 8 },
              ].map((group, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800/80 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500">{group.row}</div>
                  <div className="tibetan-text font-app text-2xl text-blue-600 dark:text-blue-300 font-bold">{group.letters}</div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400 font-mono">{group.wylie}</div>
                  <button
                    onClick={() => onLaunchLevel(group.lvl)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-600 dark:text-blue-300 font-bold flex items-center gap-1 mt-1"
                  >
                    Practice in Level {group.lvl} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vowels Tab */}
      {activeTab === 'vowels' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">The Four Vowel Signs (དབྱངས་བཞི)</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              In Tibetan, when a root consonant takes a vowel other than "a", one of four combining marks is attached above or below the letter.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                { name: 'Gigu (གི་གུ)', symbol: 'ི', example: 'ཀི (Ki)', sound: 'i as in "sea"', wylie: 'i', lvl: 11 },
                { name: 'Zhabkyu (ཞབས་ཀྱུ)', symbol: 'ུ', example: 'ཀུ (Ku)', sound: 'u as in "flute"', wylie: 'u', lvl: 12 },
                { name: 'Drengbu (འགྲེང་བུ)', symbol: 'ེ', example: 'ཀེ (Ke)', sound: 'e as in "play"', wylie: 'e', lvl: 13 },
                { name: 'Naro (ན་རོ)', symbol: 'ོ', example: 'ཀོ (Ko)', sound: 'o as in "home"', wylie: 'o', lvl: 14 },
              ].map((v, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 text-center space-y-2">
                  <div className="tibetan-text font-app text-4xl text-blue-600 dark:text-blue-300 font-bold">{v.example}</div>
                  <div className="font-bold text-gray-900 dark:text-white text-xs">{v.name}</div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">{v.sound}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">Wylie: {v.wylie}</div>
                  <button
                    onClick={() => onLaunchLevel(v.lvl)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline pt-2 inline-block font-semibold"
                  >
                    Practice in Level {v.lvl} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stacks Tab */}
      {activeTab === 'stacks' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Superscripts & Subjoined Stacks</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Tibetan is written vertically in stacks. A stack consists of a root letter crowned by a superscript (Ra-go, La-go, Sa-go) and underpinned by subjoined consonants (Ya-tag, Ra-tag, La-tag, Wa-zur).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-cyan-400">Superscripts (མགོ་ཅན)</div>
                <div className="tibetan-text font-app text-2xl text-blue-600 dark:text-blue-300">རྐ ལྐ སྐ</div>
                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                  Letters ར (Ra), ལ (La), and ས (Sa) can sit as the crown above root letters.
                </p>
                <button
                  onClick={() => onLaunchLevel(35)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  World 4 Stack Levels →
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-rose-400">Subjoined (འདོགས་ཅན)</div>
                <div className="tibetan-text font-app text-2xl text-blue-600 dark:text-blue-300">ཀྱ ཀྲ ཀླ ཀྭ</div>
                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                  Ya-tag (ྱ), Ra-tag (ྲ), La-tag (ླ), and Wa-zur (ྭ) attach below.
                </p>
                <button
                  onClick={() => onLaunchLevel(31)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  World 4 Subjoined Levels →
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400">Complex Conjuncts</div>
                <div className="tibetan-text font-app text-2xl text-blue-600 dark:text-blue-300">བསྒྲ སྤྲ རྒྱ</div>
                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                  Multiple layers combining prefixes, heads, roots, subjoined forms, and suffixes.
                </p>
                <button
                  onClick={() => onLaunchLevel(40)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Stack Guardian Trial →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Punctuation Tab */}
      {activeTab === 'punctuation' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Tibetan Punctuation Marks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 space-y-1">
                <span className="tibetan-text font-app text-3xl text-blue-600 dark:text-blue-300">་</span>
                <div className="font-bold text-gray-900 dark:text-white text-xs">Tsek (ཚེག)</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">The sacred dot dividing each syllable. Typed with SPACE.</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 space-y-1">
                <span className="tibetan-text font-app text-3xl text-blue-600 dark:text-blue-300">།</span>
                <div className="font-bold text-gray-900 dark:text-white text-xs">Shad (ཤད)</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">Vertical bar acting as comma, colon, or period.</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 space-y-1">
                <span className="tibetan-text font-app text-3xl text-blue-600 dark:text-blue-300">༄༅། །</span>
                <div className="font-bold text-gray-900 dark:text-white text-xs">Yigo & Head Marks (མགོ་རྒྱན)</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">Decorative opening flourishes for sacred manuscripts.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
