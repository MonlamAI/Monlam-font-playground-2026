import React from 'react';
import { FontItem, PresetText } from '../types/font';
import { FontCard } from './FontCard';
import { FontSampleCard } from './FontSampleCard';
import { Sparkles, Info } from 'lucide-react';
import { resolveFontPreviewText } from '../utils/resolvePreviewText';
import { useI18n } from '../i18n/I18nProvider';

interface FontCatalogProps {
  fonts: FontItem[];
  previewText: string;
  activePresetId: string;
  presets: PresetText[];
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  viewMode: 'grid' | 'list' | 'sample';
  selectedFonts: FontItem[];
  onToggleSelect: (font: FontItem) => void;
  comparedFonts: FontItem[];
  onToggleCompare: (font: FontItem) => void;
  onOpenGlyphs: (font: FontItem) => void;
  onResetFilters: () => void;
}

export const FontCatalog: React.FC<FontCatalogProps> = ({
  fonts,
  previewText,
  activePresetId,
  presets,
  fontSize,
  lineHeight,
  fontWeight,
  viewMode,
  selectedFonts,
  onToggleSelect,
  comparedFonts,
  onToggleCompare,
  onOpenGlyphs,
  onResetFilters
}) => {
  const { t } = useI18n();
  const isSelected = (id: string) => selectedFonts.some((f) => f.id === id);
  const isCompared = (id: string) => comparedFonts.some((f) => f.id === id);

  const tipText =
    viewMode === 'sample' ? t('catalog.tipSample') : t('catalog.tipRealtime');

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 w-full min-w-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-gray-500 dark:text-slate-400">
        <div>
          {t('catalog.typefacesFound', { count: fonts.length })}
          <span className="ml-2 text-xs text-gray-400 dark:text-slate-500">
            • {t('catalog.collectionHint')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/60 dark:border-amber-800/50 px-3 py-1.5 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{tipText}</span>
        </div>
      </div>

      {fonts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-8">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-gray-400 dark:text-slate-500 mb-3">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">{t('catalog.noMatchTitle')}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-md mx-auto">{t('catalog.noMatchBody')}</p>
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
          >
            {t('common.resetFilters')}
          </button>
        </div>
      ) : viewMode === 'sample' ? (
        <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-2 gap-5">
          {fonts.map((font, index) => (
            <FontSampleCard
              key={font.id}
              font={font}
              previewText={resolveFontPreviewText(font, activePresetId, presets, previewText)}
              fontSize={fontSize}
              lineHeight={lineHeight}
              fontWeight={fontWeight}
              posterIndex={index}
              isSelected={isSelected(font.id)}
              onToggleSelect={onToggleSelect}
              isCompared={isCompared(font.id)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'w-full min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'w-full min-w-0 space-y-4'
          }
        >
          {fonts.map((font) => (
            <FontCard
              key={font.id}
              font={font}
              previewText={resolveFontPreviewText(font, activePresetId, presets, previewText)}
              activePresetId={activePresetId}
              fontSize={fontSize}
              lineHeight={lineHeight}
              fontWeight={fontWeight}
              isSelected={isSelected(font.id)}
              onToggleSelect={onToggleSelect}
              isCompared={isCompared(font.id)}
              onToggleCompare={onToggleCompare}
              onOpenGlyphs={onOpenGlyphs}
              centerPreview={viewMode === 'grid'}
            />
          ))}
        </div>
      )}
    </div>
  );
};
