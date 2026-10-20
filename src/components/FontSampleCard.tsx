import React from 'react';
import { Check, Plus, Download, GitCompare } from 'lucide-react';
import { FontItem } from '../types/font';
import { useI18n } from '../i18n/I18nProvider';
import { fontCardTitlePair, fontCategoryLabel } from '../utils/fontDisplay';
import { downloadSingleFont } from '../utils/fontDownloader';

interface FontSampleCardProps {
  font: FontItem;
  previewText: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  posterIndex: number;
  isSelected: boolean;
  onToggleSelect: (font: FontItem) => void;
  isCompared: boolean;
  onToggleCompare: (font: FontItem) => void;
}

/** Quiet poster palettes — cycle per card for easy visual comparison */
const POSTER_THEMES = [
  {
    surface: 'bg-[#1a2332]',
    text: 'text-[#f2ebe3]',
    meta: 'text-[#a8b4c4]',
    name: 'text-[#f7f3ee]',
    border: 'border-[#2a3545]',
    accent: 'bg-[#c4a574]/20 text-[#e8d5b5] border-[#c4a574]/30'
  },
  {
    surface: 'bg-[#243028]',
    text: 'text-[#eef5ef]',
    meta: 'text-[#9db5a6]',
    name: 'text-[#f4faf5]',
    border: 'border-[#334238]',
    accent: 'bg-[#7d9b82]/25 text-[#c5d9c8] border-[#7d9b82]/35'
  },
  {
    surface: 'bg-[#2c2420]',
    text: 'text-[#f5ebe3]',
    meta: 'text-[#c4a99a]',
    name: 'text-[#faf4ef]',
    border: 'border-[#3d322c]',
    accent: 'bg-[#d4a07a]/20 text-[#f0d0b8] border-[#d4a07a]/30'
  },
  {
    surface: 'bg-[#1e2a32]',
    text: 'text-[#e8f1f5]',
    meta: 'text-[#8fb0c0]',
    name: 'text-[#f2f8fb]',
    border: 'border-[#2d3d48]',
    accent: 'bg-[#6a9bb0]/25 text-[#b8d4e0] border-[#6a9bb0]/35'
  },
  {
    surface: 'bg-[#2a2430]',
    text: 'text-[#f3eef5]',
    meta: 'text-[#b5a8c4]',
    name: 'text-[#faf7fc]',
    border: 'border-[#3a3342]',
    accent: 'bg-[#9b87b0]/25 text-[#d4c8e4] border-[#9b87b0]/35'
  },
  {
    surface: 'bg-[#f4f0e8]',
    text: 'text-[#2a241c]',
    meta: 'text-[#6b6258]',
    name: 'text-[#1c1814]',
    border: 'border-[#ddd5c8]',
    accent: 'bg-[#8b6914]/15 text-[#5c4810] border-[#8b6914]/25'
  },
  {
    surface: 'bg-[#e8eef2]',
    text: 'text-[#1a2830]',
    meta: 'text-[#5a6e7a]',
    name: 'text-[#122028]',
    border: 'border-[#c8d4dc]',
    accent: 'bg-[#3d6a80]/15 text-[#2a4a5c] border-[#3d6a80]/25'
  },
  {
    surface: 'bg-[#ece8e0]',
    text: 'text-[#2c2218]',
    meta: 'text-[#6e5e4e]',
    name: 'text-[#1a140e]',
    border: 'border-[#d4cbc0]',
    accent: 'bg-[#a06040]/15 text-[#6a3a28] border-[#a06040]/25'
  }
] as const;

export const FontSampleCard: React.FC<FontSampleCardProps> = ({
  font,
  previewText,
  fontSize,
  lineHeight,
  fontWeight,
  posterIndex,
  isSelected,
  onToggleSelect,
  isCompared,
  onToggleCompare
}) => {
  const { t, locale } = useI18n();
  const titles = fontCardTitlePair(font, locale);
  const theme = POSTER_THEMES[posterIndex % POSTER_THEMES.length];
  const sampleSize = Math.max(fontSize, 48);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 ${theme.surface} ${theme.border} ${
        isSelected ? 'ring-2 ring-blue-500/50 shadow-lg' : 'shadow-xs hover:shadow-md'
      }`}
    >
      {/* Poster header — Google Fonts–style name strip */}
      <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-base font-semibold tracking-tight truncate ${theme.name} ${
                titles.primaryIsTibetan ? 'tibetan-text' : ''
              }`}
            >
              {titles.primary}
            </h3>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border shrink-0 ${theme.accent}`}
            >
              {fontCategoryLabel(font.category, t)}
            </span>
          </div>
          <div className={`mt-1 flex items-center gap-2 text-xs ${theme.meta}`}>
            <span className={!titles.primaryIsTibetan ? 'tibetan-text' : ''}>{titles.secondary}</span>
            <span className="opacity-50">·</span>
            <span>
              {font.stylesCount} {font.stylesCount === 1 ? 'style' : 'styles'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onToggleCompare(font)}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
            className={`p-1.5 rounded-lg border transition opacity-70 group-hover:opacity-100 ${
              isCompared
                ? 'bg-indigo-600 text-white border-indigo-600'
                : `${theme.border} ${theme.meta} hover:opacity-100`
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => downloadSingleFont(font)}
            title={`Download ${font.filename}`}
            className={`p-1.5 rounded-lg border transition opacity-70 group-hover:opacity-100 ${theme.border} ${theme.meta}`}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onToggleSelect(font)}
            title={isSelected ? 'Remove from cart' : 'Add to cart'}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border transition ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600'
                : `${theme.border} ${theme.meta} opacity-70 group-hover:opacity-100`
            }`}
          >
            {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Large sample poster plane */}
      <div className="relative flex-1 min-h-[200px] sm:min-h-[240px] px-5 pb-6 flex items-center justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-5 top-0 h-px opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent, currentColor 20%, currentColor 80%, transparent)'
          }}
        />
        <p
          style={{
            fontSize: `${sampleSize}px`,
            lineHeight,
            fontWeight,
            ...(font.fileUrl
              ? { fontFamily: `'${font.name}', 'Noto Serif Tibetan', 'Jomolhari', serif` }
              : {})
          }}
          className={`${font.cssClass} tibetan-text ${theme.text} break-words w-full select-text text-center`}
        >
          {previewText}
        </p>
      </div>
    </article>
  );
};
