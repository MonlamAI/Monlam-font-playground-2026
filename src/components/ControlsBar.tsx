import React from 'react';
import {
  Search,
  LayoutGrid,
  List,
  GalleryThumbnails,
  X,
  Type,
  Filter,
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeft,
  ChevronDown
} from 'lucide-react';
import { FontCategory, PresetText, FontKind, FontItem } from '../types/font';
import { getSpecialPresetOptions } from '../utils/resolvePreviewText';

export type FontKindFilter = FontKind | 'all';

interface ControlsBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: FontCategory;
  setSelectedCategory: (cat: FontCategory) => void;
  selectedFontKind: FontKindFilter;
  setSelectedFontKind: (kind: FontKindFilter) => void;
  previewText: string;
  setPreviewText: (text: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  lineHeight: number;
  setLineHeight: (lh: number) => void;
  viewMode: 'grid' | 'list' | 'sample';
  setViewMode: (mode: 'grid' | 'list' | 'sample') => void;
  activePresetId: string;
  setActivePresetId: (id: string) => void;
  presets: PresetText[];
  /** Fonts currently shown in the catalog (after filters) — used for Special/Custom presets */
  catalogFonts: FontItem[];
  onReset: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const FONT_KIND_OPTIONS: { label: string; value: FontKindFilter }[] = [
  { label: 'Normal', value: 'normal' },
  { label: 'Special', value: 'special' },
  { label: 'All', value: 'all' }
];

const CATEGORIES: { label: string; value: FontCategory; tibetan: string }[] = [
  { label: 'All', value: 'All', tibetan: 'ཚང་མ།' },
  { label: 'Uchen', value: 'Uchen', tibetan: 'དབུ་ཅན' },
  { label: 'Umê & Chug', value: 'Umê', tibetan: 'འཁྱུག་ཡིག' },
  { label: 'Drutsa', value: 'Drutsa', tibetan: 'འབྲུ་ཚ' },
  { label: 'Tsugring', value: 'Tsugring', tibetan: 'ཚུགས་རིང' },
  { label: 'Petsug', value: 'Petsug', tibetan: 'དཔེ་ཚུགས' },
  { label: 'Modern & Sans', value: 'Modern', tibetan: 'མགོ་མེད' },
  { label: 'Standard', value: 'Standard', tibetan: 'ཚད་ལྡན' },
];

export const ControlsBar: React.FC<ControlsBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedFontKind,
  setSelectedFontKind,
  previewText,
  setPreviewText,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  viewMode,
  setViewMode,
  activePresetId,
  setActivePresetId,
  presets,
  catalogFonts,
  onReset,
  sidebarOpen,
  setSidebarOpen,
  children
}) => {
  const [presetsOpen, setPresetsOpen] = React.useState(true);
  const [scriptStyleOpen, setScriptStyleOpen] = React.useState(false);

  const isSpecialMode = selectedFontKind === 'special';
  const specialOptions = React.useMemo(
    () => (isSpecialMode ? getSpecialPresetOptions(catalogFonts, presets) : []),
    [isSpecialMode, catalogFonts, presets]
  );

  const handleSelectPreset = (preset: PresetText) => {
    setActivePresetId(preset.id);
    setPreviewText(preset.content);
  };

  const handleSelectFontSample = () => {
    setActivePresetId('custom');
    const sample =
      catalogFonts.find((f) => (f.fontKind || 'normal') === 'special')?.sampleText ||
      catalogFonts[0]?.sampleText ||
      previewText;
    setPreviewText(sample);
  };

  return (
    <div className="flex items-start w-full relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-label="Close filters"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left filter panel — only in layout flow when open so content can expand */}
      <aside
        className={`fixed top-16 z-50 h-[calc(100vh-4rem)] w-[min(100vw-2.5rem,20rem)] bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-out left-0 ${
          sidebarOpen
            ? 'translate-x-0 lg:sticky lg:z-20 lg:w-72 lg:shrink-0'
            : '-translate-x-full pointer-events-none lg:hidden'
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex flex-col h-full w-full lg:w-72">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800 shrink-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">Preview</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Reset all
              </button>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            <section className="space-y-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                <Type className="w-3.5 h-3.5" />
                Sample text
              </label>
              <textarea
                value={previewText}
                onChange={(e) => {
                  setPreviewText(e.target.value);
                  setActivePresetId('custom');
                }}
                rows={3}
                placeholder="Type something to preview..."
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100/80 dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent tibetan-text resize-none transition"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 dark:text-slate-300">Size</span>
                  <span className="font-mono text-gray-600 dark:text-slate-400 tabular-nums">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="84"
                  step="2"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex flex-wrap gap-1.5">
                  {[24, 36, 48, 64].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`px-2 py-0.5 rounded-md text-[11px] border transition ${
                        fontSize === sz
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                          : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 dark:text-slate-300 inline-flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3" />
                    Line height
                  </span>
                  <span className="font-mono text-gray-600 dark:text-slate-400 tabular-nums">{lineHeight.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="1.4"
                  max="2.6"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-snug">
                  Extra space prevents clipping of high vowels &amp; subjoined letters.
                </p>
              </div>
            </section>

            <section className="space-y-2.5">
              <button
                type="button"
                onClick={() => setPresetsOpen((open) => !open)}
                aria-expanded={presetsOpen}
                className="w-full flex items-center justify-between gap-2 text-left group"
              >
                <h3
                  className={`text-xs font-semibold uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-slate-300 ${
                    isSpecialMode
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-gray-500 dark:text-slate-400'
                  }`}
                >
                  {isSpecialMode ? 'Custom' : 'Presets'}
                </h3>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 dark:text-slate-500 transition-transform ${
                    presetsOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>
              {presetsOpen && (
                <div className="flex flex-col gap-1">
                  {isSpecialMode ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSelectFontSample}
                        className={`text-left px-3 py-2 rounded-lg text-xs transition border ${
                          activePresetId === 'custom'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800 font-semibold'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-100 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className="block">Font sample</span>
                        <span className="block mt-0.5 text-gray-500 dark:text-slate-400 opacity-80">
                          Each special font’s own configured sample text
                        </span>
                      </button>
                      {specialOptions.map((preset) => {
                        const isActive = activePresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`text-left px-3 py-2 rounded-lg text-xs transition border ${
                              isActive
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800 font-semibold'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-100 dark:hover:border-slate-700'
                            }`}
                          >
                            <span className="block">
                              {preset.title}
                              {preset.customized ? ' · custom' : ''}
                            </span>
                            <span className="block mt-0.5 tibetan-text text-gray-500 dark:text-slate-400 opacity-80 line-clamp-2">
                              {preset.tibetanTitle || preset.content}
                            </span>
                          </button>
                        );
                      })}
                      {specialOptions.length === 0 && (
                        <p className="px-1 text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                          No custom presets configured yet. Assign presets for this special font in Admin → Fonts.
                        </p>
                      )}
                    </>
                  ) : (
                    presets.map((preset) => {
                      const isActive = activePresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          className={`text-left px-3 py-2 rounded-lg text-xs transition border ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-semibold'
                              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-100 dark:hover:border-slate-700'
                          }`}
                        >
                          <span className="block">{preset.title}</span>
                          <span className="block mt-0.5 tibetan-text text-gray-500 dark:text-slate-400 opacity-80">
                            {preset.tibetanTitle}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </section>

            <section className="space-y-2.5 pb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Font kind
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {FONT_KIND_OPTIONS.map((opt) => {
                  const isSelected = selectedFontKind === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedFontKind(opt.value)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                        isSelected
                          ? opt.value === 'special'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-2.5 pb-4">
              <button
                type="button"
                onClick={() => setScriptStyleOpen((open) => !open)}
                aria-expanded={scriptStyleOpen}
                className="w-full flex items-center justify-between gap-2 text-left group"
              >
                <span className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-300">
                    Script style
                  </h3>
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 dark:text-slate-500 transition-transform ${
                    scriptStyleOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>
              {scriptStyleOpen && (
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {cat.value !== 'All' && (
                          <span
                            className={`ml-1 tibetan-text ${
                              isSelected ? 'text-blue-100' : 'text-gray-400 dark:text-slate-500'
                            }`}
                          >
                            {cat.tibetan}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </aside>

      {/* Main column: toolbar + catalog */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="sticky top-16 z-30 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                sidebarOpen
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
              title={sidebarOpen ? 'Hide filters' : 'Show filters'}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-3.5 h-3.5" />
              ) : (
                <PanelLeft className="w-3.5 h-3.5" />
              )}
              <span>Filters</span>
            </button>

            <div
              className="inline-flex items-center p-0.5 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs"
              role="group"
              aria-label="Font kind filter"
            >
              {FONT_KIND_OPTIONS.map((opt) => {
                const isSelected = selectedFontKind === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedFontKind(opt.value)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      isSelected
                        ? opt.value === 'special'
                          ? 'bg-amber-600 text-white'
                          : 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="relative flex-1 min-w-[200px] max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fonts by name, script, tag..."
                className="w-full pl-9 pr-9 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg p-0.5 bg-white dark:bg-slate-800 ml-auto">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
                title="Grid card view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition ${
                  viewMode === 'list'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('sample')}
                className={`p-1.5 rounded-md transition ${
                  viewMode === 'sample'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
                title="Sample poster view"
              >
                <GalleryThumbnails className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};
