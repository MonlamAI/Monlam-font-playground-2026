import React from 'react';
import { X, Copy, Check, Download, Info, Sparkles } from 'lucide-react';
import { FontItem } from '../types/font';
import { downloadSingleFont } from '../utils/fontDownloader';

interface GlyphModalProps {
  font: FontItem | null;
  onClose: () => void;
}

// Generate the primary Tibetan Unicode glyphs
const GLYPH_CATEGORIES = [
  {
    title: 'Consonants (ཀ་མད་སུམ་ཅུ)',
    range: [
      'ཀ', 'ཁ', 'ག', 'ང', 'ཅ', 'ཆ', 'ཇ', 'ཉ',
      'ཏ', 'ཐ', 'ད', 'ན', 'པ', 'ཕ', 'བ', 'མ',
      'ཙ', 'ཚ', 'ཛ', 'ཝ', 'ཞ', 'ཟ', 'འ', 'ཡ',
      'ར', 'ལ', 'ཤ', 'ས', 'ཧ', 'ཨ'
    ]
  },
  {
    title: 'Vowels & Diacritics (དབྱངས་དང་རྟགས)',
    range: [
      'ི', 'ུ', 'ེ', 'ོ', 'ཱ', 'ཱི', 'ཱུ', 'ཻ', 'ཽ', 'ྀ', 'ྂ', 'ྃ', '྄', 'ཿ'
    ]
  },
  {
    title: 'Subjoined Consonants (འདོགས་ཅན)',
    range: [
      'ྐ', 'ྑ', 'ྒ', 'ྔ', 'ྕ', 'ྖ', 'ྗ', 'ྙ',
      'ྟ', 'ྠ', 'ྡ', 'ྣ', 'ྤ', 'ྥ', 'ྦ', 'ྨ',
      'ྩ', 'ྪ', 'ྫ', 'ྭ', 'ྮ', 'ྯ', 'ྰ', 'ྱ',
      'ྲ', 'ླ', 'ྴ', 'ྵ', 'ྶ', 'ྷ'
    ]
  },
  {
    title: 'Numerals & Digits (བོད་ཀྱི་ཨང་ཀི)',
    range: ['༠', '༡', '༢', '༣', '༤', '༥', '༦', '༧', '༨', '༩']
  },
  {
    title: 'Punctuation & Head Marks (ཡིག་མགོ་དང་ཤད)',
    range: ['༄', '༅', '༆', '༇', '༈', '༉', '༊', '་', '༌', '།', '༎', '༏', '༐', '༑', '༒', '༼', '༽']
  }
];

export const GlyphModal: React.FC<GlyphModalProps> = ({ font, onClose }) => {
  const [copiedChar, setCopiedChar] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState(0);

  if (!font) return null;

  const handleCopy = (char: string) => {
    navigator.clipboard.writeText(char);
    setCopiedChar(char);
    setTimeout(() => setCopiedChar(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-gray-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-start justify-between bg-gray-50/80 dark:bg-slate-900/80">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 dark:text-slate-100 text-lg tibetan-text">{font.tibetanName}</p>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300">
                {font.category}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>({font.name})</span>
              <span>•</span>
              <span>By {font.designer}</span>
              <span>•</span>
              <span>{font.releaseYear}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadSingleFont(font)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ttf</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Font Description */}
          <div className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed bg-blue-50/40 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
            <p className="font-medium text-blue-950 dark:text-blue-200 mb-1">{font.description}</p>
            <p className="tibetan-text text-blue-800/80 dark:text-blue-300/80 mt-2">{font.tibetanDescription}</p>
          </div>

          {/* Specs & Features Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
              OpenType & Technical Features:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {font.features.map((feat) => (
                <span
                  key={feat}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-md text-xs font-medium"
                >
                  ✓ {feat}
                </span>
              ))}
              <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-md text-xs font-medium">
                Size: {font.fileSize}
              </span>
            </div>
          </div>

          {/* Glyphs Character Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800 flex-wrap gap-2">
              <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                Character Map & Glyphs:
              </span>
              <span className="text-xs text-gray-400 dark:text-slate-500">Click any character to copy to clipboard</span>
            </div>

            {/* Glyph Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {GLYPH_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.title}
                  onClick={() => setActiveCategory(idx)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                    activeCategory === idx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Glyph Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
              {GLYPH_CATEGORIES[activeCategory].range.map((char) => {
                const hexCode = 'U+' + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
                const isJustCopied = copiedChar === char;

                return (
                  <button
                    key={char}
                    onClick={() => handleCopy(char)}
                    title={`Click to copy ${char} (${hexCode})`}
                    className={`h-16 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/50 border rounded-lg flex flex-col items-center justify-center p-1 transition shadow-xs group ${
                      isJustCopied ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' : 'border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    <span
                      className={`${font.cssClass} tibetan-text text-2xl text-gray-900 dark:text-slate-100 group-hover:scale-110 transition-transform`}
                    >
                      {char}
                    </span>
                    <span className="text-[9px] font-mono text-gray-400 dark:text-slate-500 mt-1">
                      {isJustCopied ? 'COPIED' : hexCode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
