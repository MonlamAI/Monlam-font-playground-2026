import React from 'react';
import { X, Download } from 'lucide-react';
import { FontItem } from '../types/font';
import { downloadSingleFont } from '../utils/fontDownloader';
import { useI18n } from '../i18n/I18nProvider';
import { useScriptStylesContext } from '../contexts/ScriptStylesContext';
import { fontAssetLabel, uiTibetanClass } from '../utils/fontDisplay';
import { localizeDigitsInString } from '../utils/localeNumber';

interface GlyphModalProps {
  font: FontItem | null;
  onClose: () => void;
}

type GlyphCategoryKey = 'consonants' | 'vowels' | 'subjoined' | 'numerals' | 'punctuation';

const GLYPH_CATEGORIES: { key: GlyphCategoryKey; range: string[] }[] = [
  {
    key: 'consonants',
    range: [
      'ཀ', 'ཁ', 'ག', 'ང', 'ཅ', 'ཆ', 'ཇ', 'ཉ',
      'ཏ', 'ཐ', 'ད', 'ན', 'པ', 'ཕ', 'བ', 'མ',
      'ཙ', 'ཚ', 'ཛ', 'ཝ', 'ཞ', 'ཟ', 'འ', 'ཡ',
      'ར', 'ལ', 'ཤ', 'ས', 'ཧ', 'ཨ'
    ]
  },
  {
    key: 'vowels',
    range: [
      'ི', 'ུ', 'ེ', 'ོ', 'ཱ', 'ཱི', 'ཱུ', 'ཻ', 'ཽ', 'ྀ', 'ྂ', 'ྃ', '྄', 'ཿ'
    ]
  },
  {
    key: 'subjoined',
    range: [
      'ྐ', 'ྑ', 'ྒ', 'ྔ', 'ྕ', 'ྖ', 'ྗ', 'ྙ',
      'ྟ', 'ྠ', 'ྡ', 'ྣ', 'ྤ', 'ྥ', 'ྦ', 'ྨ',
      'ྩ', 'ྪ', 'ྫ', 'ྭ', 'ྮ', 'ྯ', 'ྰ', 'ྱ',
      'ྲ', 'ླ', 'ྴ', 'ྵ', 'ྶ', 'ྷ'
    ]
  },
  {
    key: 'numerals',
    range: ['༠', '༡', '༢', '༣', '༤', '༥', '༦', '༧', '༨', '༩']
  },
  {
    key: 'punctuation',
    range: ['༄', '༅', '༆', '༇', '༈', '༉', '༊', '་', '༌', '།', '༎', '༏', '༐', '༑', '༒', '༼', '༽']
  }
];

export const GlyphModal: React.FC<GlyphModalProps> = ({ font, onClose }) => {
  const { t, locale } = useI18n();
  const { labelForCategory } = useScriptStylesContext();
  const [copiedChar, setCopiedChar] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState(0);

  if (!font) return null;

  const handleCopy = (char: string) => {
    navigator.clipboard.writeText(char);
    setCopiedChar(char);
    setTimeout(() => setCopiedChar(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl max-w-3xl w-full border border-gray-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] min-w-0">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-slate-800 flex gap-3 sm:gap-4 items-start justify-between bg-gray-50/80 dark:bg-slate-900/80 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <p
                className={`font-bold text-gray-900 dark:text-slate-100 text-base sm:text-lg leading-snug break-words min-w-0 ${locale === 'bo' ? 'tibetan-text' : ''}`}
              >
                {fontAssetLabel(font, locale)}
              </p>
              <span
                className={`shrink-0 max-w-full px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 ${uiTibetanClass(locale, true)}`}
              >
                {labelForCategory(font.category)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => downloadSingleFont(font)}
              aria-label={t('glyph.downloadTtf')}
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95"
            >
              <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" aria-hidden />
              <span className={`hidden sm:inline ${uiTibetanClass(locale)}`}>{t('glyph.downloadTtf')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('common.close')}
              className="p-2 sm:p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto overflow-x-hidden space-y-4 sm:space-y-6 min-w-0">
          <div className={`text-xs text-gray-600 dark:text-slate-400 ${uiTibetanClass(locale)}`}>
            <span className="font-semibold text-gray-700 dark:text-slate-300">
              {t('glyph.size')}:
            </span>{' '}
            {localizeDigitsInString(font.fileSize, locale)}
          </div>

          {/* Glyphs Character Map */}
          <div className="space-y-3 min-w-0">
            <div className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-start sm:justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
              <span
                className={`text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide sm:tracking-wider break-words ${uiTibetanClass(locale, true)}`}
              >
                {t('glyph.characterMapTitle')}
              </span>
              <span
                className={`text-xs text-gray-400 dark:text-slate-500 break-words sm:max-w-[55%] sm:text-right ${uiTibetanClass(locale)}`}
              >
                {t('glyph.clickToCopyHint')}
              </span>
            </div>

            {/* Glyph Category Tabs */}
            <div
              className="flex flex-wrap gap-1.5 text-xs min-w-0"
              role="tablist"
              aria-label={t('glyph.characterMapTitle')}
            >
              {GLYPH_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === idx}
                  onClick={() => setActiveCategory(idx)}
                  className={`max-w-full px-2.5 sm:px-3 py-1.5 rounded-lg text-left font-medium transition break-words ${uiTibetanClass(locale)} ${
                    activeCategory === idx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {t(`glyph.categories.${cat.key}`)}
                </button>
              ))}
            </div>

            {/* Glyph Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 min-w-0">
              {GLYPH_CATEGORIES[activeCategory].range.map((char) => {
                const hexCode = 'U+' + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
                const isJustCopied = copiedChar === char;

                return (
                  <button
                    key={char}
                    onClick={() => handleCopy(char)}
                    title={t('glyph.clickToCopyTitle', { char, hex: hexCode })}
                    className={`h-14 sm:h-16 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/50 border rounded-lg flex flex-col items-center justify-center p-0.5 sm:p-1 transition shadow-xs group min-w-0 ${
                      isJustCopied ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' : 'border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    <span
                      className={`${font.cssClass} tibetan-text text-xl sm:text-2xl text-gray-900 dark:text-slate-100 group-hover:scale-110 transition-transform`}
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
