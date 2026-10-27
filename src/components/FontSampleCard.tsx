import React from 'react';
import { Check, Plus, Download, GitCompare } from 'lucide-react';
import { FontItem } from '../types/font';
import { useI18n } from '../i18n/I18nProvider';
import { fontCardTitlePair } from '../utils/fontDisplay';
import { useScriptStylesContext } from '../contexts/ScriptStylesContext';
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

type PosterThemeColors = {
  surface: string;
  text: string;
  meta: string;
  name: string;
  border: string;
  accentBackground: string;
  accentText: string;
  accentBorder: string;
  ghostButtonBg: string;
};

/** Golden-angle hues so each card gets a distinct color (no short repeat cycle). */
function posterThemeForIndex(index: number): PosterThemeColors {
  const hue = (index * 137.508) % 360;
  const accentHue = (hue + 47) % 360;
  const lightBand = index % 7 === 6;

  if (lightBand) {
    return {
      surface: `hsl(${hue} 44% 91%)`,
      text: `hsl(${hue} 50% 13%)`,
      meta: `hsl(${hue} 28% 38%)`,
      name: `hsl(${hue} 55% 9%)`,
      border: `hsl(${hue} 32% 76%)`,
      accentBackground: `hsla(${accentHue}, 65%, 40%, 0.18)`,
      accentText: `hsl(${accentHue} 60% 24%)`,
      accentBorder: `hsla(${accentHue}, 65%, 40%, 0.34)`,
      ghostButtonBg: `hsla(${hue}, 35%, 86%, 0.9)`
    };
  }

  return {
    surface: `hsl(${hue} 40% 11%)`,
    text: `hsl(${hue} 34% 93%)`,
    meta: `hsl(${hue} 22% 66%)`,
    name: `hsl(${hue} 32% 97%)`,
    border: `hsl(${hue} 30% 21%)`,
    accentBackground: `hsla(${accentHue}, 58%, 55%, 0.26)`,
    accentText: `hsl(${accentHue} 48% 84%)`,
    accentBorder: `hsla(${accentHue}, 58%, 55%, 0.4)`,
    ghostButtonBg: `hsla(${hue}, 28%, 16%, 0.75)`
  };
}

const ghostBtnClass =
  'rounded-lg border p-1.5 transition opacity-70 group-hover:opacity-100 hover:opacity-100';

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
  const { labelForCategory } = useScriptStylesContext();
  const titles = fontCardTitlePair(font, locale);
  const theme = React.useMemo(() => posterThemeForIndex(posterIndex), [posterIndex]);
  const sampleSize = Math.max(fontSize, 48);

  const ghostBtnStyle: React.CSSProperties = {
    borderColor: theme.border,
    color: theme.meta,
    backgroundColor: theme.ghostButtonBg
  };

  return (
    <article
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      className={`group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500/50 shadow-lg' : 'shadow-xs hover:shadow-md'
      }`}
    >
      <header className="flex min-h-[4.75rem] shrink-0 items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              style={{ color: theme.name }}
              className={`truncate text-base font-semibold tracking-tight ${
                titles.primaryIsTibetan ? 'tibetan-text' : ''
              }`}
            >
              {titles.primary}
            </h3>
            <span
              style={{
                backgroundColor: theme.accentBackground,
                color: theme.accentText,
                borderColor: theme.accentBorder
              }}
              className="shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium"
            >
              {labelForCategory(font.category)}
            </span>
          </div>
          {titles.secondary ? (
            <div style={{ color: theme.meta }} className="mt-1 min-h-[1.25rem] text-xs">
              <span className={`block truncate ${!titles.primaryIsTibetan ? 'tibetan-text' : ''}`}>
                {titles.secondary}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleCompare(font)}
            title={isCompared ? t('catalog.removeCompare') : t('catalog.addCompare')}
            className={
              isCompared
                ? `${ghostBtnClass} border-indigo-600 bg-indigo-600 text-white`
                : ghostBtnClass
            }
            style={isCompared ? undefined : ghostBtnStyle}
          >
            <GitCompare className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => downloadSingleFont(font)}
            title={`${t('catalog.cardActionDownload')} ${font.filename}`}
            className={ghostBtnClass}
            style={ghostBtnStyle}
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onToggleSelect(font)}
            title={isSelected ? t('catalog.removeFromBag') : t('catalog.addToBag')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
              isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'opacity-70 group-hover:opacity-100'
            }`}
            style={isSelected ? undefined : ghostBtnStyle}
          >
            {isSelected ? <Check className="h-4 w-4 stroke-[3]" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <div
        style={{ color: theme.meta }}
        className="relative flex min-h-[200px] flex-1 items-center justify-center px-5 pb-6 sm:min-h-[240px]"
      >
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
            color: theme.text,
            ...(font.fileUrl
              ? { fontFamily: `'${font.name}', 'Noto Serif Tibetan', 'Jomolhari', serif` }
              : {})
          }}
          className={`${font.cssClass} tibetan-text w-full select-text break-words whitespace-pre-line text-center`}
        >
          {previewText}
        </p>
      </div>
    </article>
  );
};
