import React from 'react';
import { FontItem } from '../types/font';
import { GitCompare, Plus, X, Layers, Sliders, Sparkles, Download, Check } from 'lucide-react';
import { PRESET_TEXTS } from '../data/fontsData';
import { downloadSingleFont } from '../utils/fontDownloader';

interface ComparisonViewProps {
  allFonts: FontItem[];
  comparedFonts: FontItem[];
  onAddFont: (font: FontItem) => void;
  onRemoveFont: (fontId: string) => void;
  onSetComparedFonts: (fonts: FontItem[]) => void;
  selectedFonts: FontItem[];
  onToggleSelect: (font: FontItem) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  allFonts,
  comparedFonts,
  onAddFont,
  onRemoveFont,
  onSetComparedFonts,
  selectedFonts,
  onToggleSelect
}) => {
  const [syncText, setSyncText] = React.useState('ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ། བོད་ཀྱི་ཡི་གེ་དང་རིག་གཞུང་།');
  const [fontSize, setFontSize] = React.useState(42);
  const [lineHeight, setLineHeight] = React.useState(1.85);
  const [isOverlayMode, setIsOverlayMode] = React.useState(false);
  const [overlayFont1, setOverlayFont1] = React.useState<string>(comparedFonts[0]?.id || allFonts[0]?.id || '');
  const [overlayFont2, setOverlayFont2] = React.useState<string>(comparedFonts[1]?.id || allFonts[1]?.id || '');

  // Available fonts to add (not yet in comparedFonts)
  const availableFonts = allFonts.filter((f) => !comparedFonts.some((cf) => cf.id === f.id));

  const f1 = allFonts.find((f) => f.id === overlayFont1) || allFonts[0];
  const f2 = allFonts.find((f) => f.id === overlayFont2) || allFonts[1];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Side-by-Side Typeface Comparison</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Analyze stroke weight, calligraphic cadence, vowel clearance, and descender reach across Monlam fonts.
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher: Side-by-Side Columns vs Optical Overlay */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setIsOverlayMode(false)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                !isOverlayMode ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              Side-by-Side Grid
            </button>
            <button
              onClick={() => setIsOverlayMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                isOverlayMode ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Optical Overlay Diff</span>
            </button>
          </div>
        </div>

        {/* Global Synchronized Input & Sliders */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
                Synchronized Test String (Updates all columns live):
              </label>
              <input
                type="text"
                value={syncText}
                onChange={(e) => setSyncText(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 tibetan-text font-medium"
                placeholder="Type Tibetan phrase or mantra to compare..."
              />
            </div>

            {/* Quick Sample Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-4 sm:pt-0">
              {PRESET_TEXTS.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSyncText(p.content)}
                  className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-md whitespace-nowrap transition"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Size & Line Height Controls */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-gray-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-slate-300">Comparative Size:</span>
              <input
                type="range"
                min="20"
                max="90"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-28 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="font-mono font-bold text-gray-800 dark:text-slate-200">{fontSize}px</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-slate-300">Line Height:</span>
              <input
                type="range"
                min="1.4"
                max="2.6"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
                className="w-28 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="font-mono font-bold text-gray-800 dark:text-slate-200">{lineHeight.toFixed(1)}x</span>
            </div>

            {/* Add Font to Compare Dropdown */}
            {availableFonts.length > 0 && !isOverlayMode && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-gray-500 dark:text-slate-400">Add to compare:</span>
                <select
                  onChange={(e) => {
                    const found = allFonts.find((f) => f.id === e.target.value);
                    if (found) onAddFont(found);
                    e.target.value = '';
                  }}
                  defaultValue=""
                  className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg font-medium cursor-pointer"
                >
                  <option value="" disabled>
                    + Choose typeface ({availableFonts.length} available)
                  </option>
                  {availableFonts.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.tibetanName})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: OPTICAL OVERLAY DIFF MODE */}
      {isOverlayMode ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block"></span>
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Base Layer (Cyan/Blue):</span>
                <select
                  value={overlayFont1}
                  onChange={(e) => setOverlayFont1(e.target.value)}
                  className="text-xs font-medium border border-gray-200 dark:border-slate-700 rounded-lg p-1.5 bg-gray-50 dark:bg-slate-800 dark:text-slate-200"
                >
                  {allFonts.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-gray-400 dark:text-slate-500 font-bold text-xs">VS</span>

              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600 inline-block"></span>
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Overlay Layer (Crimson):</span>
                <select
                  value={overlayFont2}
                  onChange={(e) => setOverlayFont2(e.target.value)}
                  className="text-xs font-medium border border-gray-200 dark:border-slate-700 rounded-lg p-1.5 bg-gray-50 dark:bg-slate-800 dark:text-slate-200"
                >
                  {allFonts.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-slate-400">
              Translucent ghost layering reveals differences in stroke weight, anchor points, and terminal shapes.
            </div>
          </div>

          {/* Overlay Rendering Area */}
          <div className="relative py-12 px-6 flex items-center justify-center min-h-[220px] bg-gray-900 dark:bg-black rounded-xl overflow-hidden mt-6">
            {/* Guide Baseline Lines */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-dashed border-gray-700/60 pointer-events-none"></div>

            {/* Layer 1 (Blue) */}
            <div
              style={{ fontSize: `${fontSize}px`, lineHeight }}
              className={`absolute ${f1.cssClass} tibetan-text text-cyan-400 opacity-80 mix-blend-screen select-none text-center`}
            >
              {syncText}
            </div>

            {/* Layer 2 (Crimson/Pink) */}
            <div
              style={{ fontSize: `${fontSize}px`, lineHeight }}
              className={`absolute ${f2.cssClass} tibetan-text text-rose-400 opacity-80 mix-blend-screen select-none text-center`}
            >
              {syncText}
            </div>
          </div>

          {/* Metric Comparison Table */}
          <div className="mt-8 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-gray-50 dark:bg-slate-800/50 px-4 py-3 border-b border-gray-200 dark:border-slate-700 font-semibold text-xs text-gray-700 dark:text-slate-300">
              Anatomical Metric Breakdown
            </div>
            <div className="grid grid-cols-3 p-4 gap-4 text-xs divide-x divide-gray-100 dark:divide-slate-800">
              <div>
                <span className="text-gray-400 dark:text-slate-500 block mb-1">Metric</span>
                <div className="font-medium text-gray-800 dark:text-slate-200 space-y-2">
                  <div>Stroke Type</div>
                  <div>Stroke Contrast</div>
                  <div>Ascender Ratio</div>
                  <div>Descender Reach</div>
                  <div>Spacing Profile</div>
                </div>
              </div>
              <div className="pl-4">
                <span className="text-blue-600 font-semibold block mb-1">{f1.name}</span>
                <div className="space-y-2 text-gray-700 dark:text-slate-300">
                  <div>{f1.metrics.strokeType}</div>
                  <div>{f1.metrics.strokeContrast}</div>
                  <div>{f1.metrics.ascenderRatio}x</div>
                  <div>{f1.metrics.descenderRatio}x</div>
                  <div>{f1.metrics.spacing}</div>
                </div>
              </div>
              <div className="pl-4">
                <span className="text-rose-600 font-semibold block mb-1">{f2.name}</span>
                <div className="space-y-2 text-gray-700 dark:text-slate-300">
                  <div>{f2.metrics.strokeType}</div>
                  <div>{f2.metrics.strokeContrast}</div>
                  <div>{f2.metrics.ascenderRatio}x</div>
                  <div>{f2.metrics.descenderRatio}x</div>
                  <div>{f2.metrics.spacing}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: SIDE-BY-SIDE COLUMNS */
        <div className="space-y-6">
          {comparedFonts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-8">
              <p className="text-gray-500 dark:text-slate-400 text-sm">No fonts currently selected for comparison.</p>
              <button
                onClick={() => {
                  if (allFonts[0] && allFonts[1]) {
                    onSetComparedFonts([allFonts[0], allFonts[1]]);
                  }
                }}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
              >
                Compare First Two Fonts
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                comparedFonts.length === 1
                  ? 'grid-cols-1'
                  : comparedFonts.length === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
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
                            className="font-semibold text-gray-900 dark:text-slate-100 text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 dark:text-slate-100 max-w-full"
                          >
                            {allFonts.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-md shrink-0">
                            {font.category}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-slate-400 tibetan-text font-medium">
                          {font.tibetanName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleSelect(font)}
                          title={isSelected ? 'Selected' : 'Select'}
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
                          title="Remove from comparison"
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
                        style={{ fontSize: `${fontSize}px`, lineHeight }}
                        className={`${font.cssClass} tibetan-text text-gray-900 dark:text-slate-100 break-words focus:outline-hidden p-2 rounded-lg`}
                      >
                        {syncText}
                      </div>
                    </div>

                    {/* Metrics Footer */}
                    <div className="p-3 bg-gray-50/80 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <span>
                          Contrast: <strong className="text-gray-700 dark:text-slate-300">{font.metrics.strokeContrast}</strong>
                        </span>
                        <span>
                          Type: <strong className="text-gray-700 dark:text-slate-300">{font.metrics.strokeType.split(' ')[0]}</strong>
                        </span>
                      </div>

                      <button
                        onClick={() => downloadSingleFont(font)}
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        <Download className="w-3 h-3" />
                        <span>.ttf</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
