import React from 'react';
import { FontItem } from '../types/font';
import { GitCompare, Plus, X, Download, Check } from 'lucide-react';
import { PRESET_TEXTS } from '../data/fontsData';
import { downloadSingleFont } from '../utils/fontDownloader';
import { fontAssetLabel } from '../utils/fontDisplay';
import { useI18n } from '../i18n/I18nProvider';
import { useScriptStylesContext } from '../contexts/ScriptStylesContext';

interface ComparisonViewProps {
  allFonts: FontItem[];
  comparedFonts: FontItem[];
  onAddFont: (font: FontItem) => void;
  onRemoveFont: (fontId: string) => void;
  onSetComparedFonts: (fonts: FontItem[]) => void;
  selectedFonts: FontItem[];
  onToggleSelect: (font: FontItem) => void;
  fontWeight: number;
  onFontWeightChange: (weight: number) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  allFonts,
  comparedFonts,
  onAddFont,
  onRemoveFont,
  onSetComparedFonts,
  selectedFonts,
  onToggleSelect,
  fontWeight,
  onFontWeightChange
}) => {
  const { t, locale } = useI18n();
  const { labelForCategory } = useScriptStylesContext();
  const [syncText, setSyncText] = React.useState('ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ། བོད་ཀྱི་ཡི་གེ་དང་རིག་གཞུང་།');
  const [fontSize, setFontSize] = React.useState(42);
  const [lineHeight, setLineHeight] = React.useState(1.85);
  const comparedIds = React.useMemo(
    () => new Set(comparedFonts.map((f) => f.id)),
    [comparedFonts]
  );
  const canAddMore = comparedFonts.length < allFonts.length;

  const setGridFont = (slot: number, fontId: string) => {
    const font = allFonts.find((f) => f.id === fontId);
    if (!font || slot < 0) return;

    const next = [...comparedFonts];
    const otherIndex = next.findIndex((f) => f.id === fontId);

    if (otherIndex !== -1 && otherIndex !== slot) {
      const tmp = next[slot];
      next[slot] = next[otherIndex];
      next[otherIndex] = tmp;
    } else {
      next[slot] = font;
    }
    onSetComparedFonts(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 min-w-0 w-full">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-4 sm:p-5 shadow-xs mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 tibetan-text">{t('compare.title')}</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 tibetan-text">{t('compare.subtitle')}</p>
          </div>
        </div>

        {/* Global Synchronized Input & Sliders */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
                {t('compare.syncLabel')}
              </label>
              <input
                type="text"
                value={syncText}
                onChange={(e) => setSyncText(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 tibetan-text font-medium"
                placeholder={t('compare.syncPlaceholder')}
              />
            </div>

            {/* Quick Sample Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 max-w-full pt-4 sm:pt-0">
              {PRESET_TEXTS.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSyncText(p.content)}
                  className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-md whitespace-nowrap transition"
                >
                  {locale === 'bo' && p.tibetanTitle ? p.tibetanTitle : p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Size & Line Height Controls */}
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center pt-2 text-xs text-gray-600 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2 min-w-[min(100%,12rem)]">
                <span className="font-medium text-gray-700 dark:text-slate-300 shrink-0">{t('compare.size')}</span>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="flex-1 min-w-[5rem] max-w-28 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="font-mono font-bold text-gray-800 dark:text-slate-200 shrink-0">{fontSize}px</span>
              </div>

              <div className="flex items-center gap-2 min-w-[min(100%,12rem)]">
                <span className="font-medium text-gray-700 dark:text-slate-300 shrink-0">{t('compare.lineHeight')}</span>
                <input
                  type="range"
                  min="1.4"
                  max="2.6"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="flex-1 min-w-[5rem] max-w-28 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="font-mono font-bold text-gray-800 dark:text-slate-200 shrink-0">{lineHeight.toFixed(1)}x</span>
              </div>

              <div className="flex items-center gap-2 min-w-[min(100%,12rem)]">
                <span className="font-medium text-gray-700 dark:text-slate-300 shrink-0">{t('compare.boldness')}</span>
                <input
                  type="range"
                  min="300"
                  max="900"
                  step="100"
                  value={fontWeight}
                  onChange={(e) => onFontWeightChange(Number(e.target.value))}
                  className="flex-1 min-w-[5rem] max-w-28 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="font-mono font-bold text-gray-800 dark:text-slate-200 tabular-nums shrink-0">{fontWeight}</span>
              </div>
            </div>

            {/* Add Font to Compare Dropdown */}
            {allFonts.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto lg:ml-auto min-w-0">
                <span className="text-gray-500 dark:text-slate-400 shrink-0">{t('compare.addFont')}</span>
                <select
                  onChange={(e) => {
                    const found = allFonts.find((f) => f.id === e.target.value);
                    if (found && !comparedIds.has(found.id)) onAddFont(found);
                    e.target.value = '';
                  }}
                  defaultValue=""
                  disabled={!canAddMore}
                  className="w-full sm:max-w-xs min-w-0 px-2.5 py-1.5 text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    {t('compare.chooseTypeface', { count: allFonts.length })}
                  </option>
                  {allFonts.map((f) => (
                    <option key={f.id} value={f.id} disabled={comparedIds.has(f.id)}>
                      {fontAssetLabel(f)}
                      {comparedIds.has(f.id) ? ` — ${t('compare.alreadyInCompare')}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
          {comparedFonts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-8">
              <p className="text-gray-500 dark:text-slate-400 text-sm tibetan-text">{t('compare.emptyTitle')}</p>
              <button
                onClick={() => {
                  if (allFonts[0] && allFonts[1]) {
                    onSetComparedFonts([allFonts[0], allFonts[1]]);
                  }
                }}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg tibetan-text"
              >
                {t('compare.compareFirstTwo')}
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                comparedFonts.length === 1
                  ? 'grid-cols-1'
                  : comparedFonts.length === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3'
              }`}
            >
              {comparedFonts.map((font, index) => {
                const isSelected = selectedFonts.some((f) => f.id === font.id);
                return (
                  <div
                    key={`${font.id}-${index}`}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/50 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <select
                            value={font.id}
                            onChange={(e) => setGridFont(index, e.target.value)}
                            className="font-semibold text-gray-900 dark:text-slate-100 text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 dark:text-slate-100 max-w-full tibetan-text"
                          >
                            {allFonts.map((f) => (
                              <option key={f.id} value={f.id}>
                                {fontAssetLabel(f)}
                              </option>
                            ))}
                          </select>
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-md shrink-0">
                            {labelForCategory(font.category)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          ({font.name})
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleSelect(font)}
                          title={isSelected ? t('compare.selected') : t('compare.select')}
                          className={`p-1.5 rounded-md border text-xs transition ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 border-gray-200 dark:border-slate-700'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onRemoveFont(font.id)}
                          title={t('compare.removeFromCompare')}
                          className="p-1.5 rounded-md text-gray-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Text Display */}
                    <div className="p-6 flex-1 flex flex-col justify-center min-h-[160px]">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight,
                          fontWeight,
                          ...(font.fileUrl
                            ? { fontFamily: `'${font.name}', 'Noto Serif Tibetan', 'Jomolhari', serif` }
                            : {})
                        }}
                        className={`${font.cssClass} tibetan-text text-gray-900 dark:text-slate-100 break-words focus:outline-hidden p-2 rounded-lg`}
                      >
                        {syncText}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50/80 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end text-xs text-gray-500 dark:text-slate-400">
                      <button
                        onClick={() => downloadSingleFont(font)}
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        <Download className="w-3 h-3" />
                        <span>{t('compare.downloadTtf')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
    </div>
  );
};
