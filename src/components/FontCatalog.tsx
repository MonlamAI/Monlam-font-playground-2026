import React from 'react';
import { FontItem, PresetText } from '../types/font';
import { FontCard } from './FontCard';
import { FontSampleCard } from './FontSampleCard';
import { Sparkles, Info } from 'lucide-react';
import { resolveFontPreviewText } from '../utils/resolvePreviewText';

interface FontCatalogProps {
  fonts: FontItem[];
  previewText: string;
  activePresetId: string;
  presets: PresetText[];
  fontSize: number;
  lineHeight: number;
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
  viewMode,
  selectedFonts,
  onToggleSelect,
  comparedFonts,
  onToggleCompare,
  onOpenGlyphs,
  onResetFilters
}) => {
  const isSelected = (id: string) => selectedFonts.some((f) => f.id === id);
  const isCompared = (id: string) => comparedFonts.some((f) => f.id === id);

  const tipText =
    viewMode === 'sample'
      ? 'Sample posters update live when you change the preview text or presets above'
      : 'Click on any preview text inside cards to type & test directly in real-time';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-gray-500 dark:text-slate-400">
        <div>
          <span className="font-semibold text-gray-900 dark:text-slate-100">{fonts.length}</span> typefaces found
          <span className="ml-2 text-xs text-gray-400 dark:text-slate-500">
            • Curated Monlam IT & Himalayan Unicode Collection
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
          <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">No typefaces match your filter</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Try searching for a different keyword like "Uchen", "Cursive", "Drutsa", or reset your search filter.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'sample' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fonts.map((font, index) => (
            <FontSampleCard
              key={font.id}
              font={font}
              previewText={resolveFontPreviewText(font, activePresetId, presets, previewText)}
              fontSize={fontSize}
              lineHeight={lineHeight}
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
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
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
