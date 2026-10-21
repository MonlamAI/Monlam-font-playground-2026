import React from 'react';
import { createPortal } from 'react-dom';
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
  ChevronDown,
  Bold,
  Tags
} from 'lucide-react';
import { FontCategory, PresetText, FontKind, FontItem } from '../types/font';
import {
  getSpecialPresetOptions,
  PRESET_ID_CUSTOM,
  PRESET_ID_FONT_SAMPLE
} from '../utils/resolvePreviewText';
import { useI18n } from '../i18n/I18nProvider';
import { translate } from '../i18n/translate';
import { localeBilingualPair, type LocaleTitlePair } from '../utils/fontDisplay';

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
  fontWeight: number;
  setFontWeight: (weight: number) => void;
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

const FONT_KIND_OPTIONS: { labelKey: string; value: FontKindFilter }[] = [
  { labelKey: 'filters.fontKindNormal', value: 'normal' },
  { labelKey: 'filters.fontKindSpecial', value: 'special' },
  { labelKey: 'filters.fontKindAll', value: 'all' }
];

const TOOLTIP_BUBBLE =
  'pointer-events-none whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-md dark:bg-slate-100 dark:text-slate-900';

/** Fixed-position hover label (portal) so tooltips are not clipped by the sidebar. */
function HoverTip({
  label,
  children,
  placement = 'right'
}: {
  label: string;
  children: React.ReactNode;
  placement?: 'right' | 'top';
}) {
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });

  const show = () => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (placement === 'right') {
      setCoords({ x: rect.right + 8, y: rect.top + rect.height / 2 });
    } else {
      setCoords({ x: rect.left + rect.width / 2, y: rect.top - 6 });
    }
    setVisible(true);
  };

  return (
    <>
      <span
        ref={anchorRef}
        className="inline-flex"
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        onFocus={show}
        onBlur={() => setVisible(false)}
      >
        {children}
      </span>
      {visible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="tooltip"
            className={`fixed z-[9999] ${TOOLTIP_BUBBLE}`}
            style={{
              left: coords.x,
              top: coords.y,
              transform: placement === 'right' ? 'translateY(-50%)' : 'translate(-50%, -100%)'
            }}
          >
            {label}
          </div>,
          document.body
        )}
    </>
  );
}

function BilingualStack({
  titles,
  secondaryClassName = 'text-gray-500 dark:text-slate-400 opacity-80'
}: {
  titles: LocaleTitlePair;
  secondaryClassName?: string;
}) {
  const showSecondary = titles.secondary !== titles.primary;
  return (
    <>
      <span className={`block ${titles.primaryIsTibetan ? 'tibetan-text' : ''}`}>{titles.primary}</span>
      {showSecondary && (
        <span
          className={`block mt-0.5 ${secondaryClassName} ${!titles.primaryIsTibetan ? 'tibetan-text' : ''}`}
        >
          {titles.secondary}
        </span>
      )}
    </>
  );
}

const CATEGORIES: { labelKey: string; value: FontCategory; tibetan: string }[] = [
  { labelKey: 'filters.categoryAll', value: 'All', tibetan: 'ཚང་མ།' },
  { labelKey: 'filters.categoryUchen', value: 'Uchen', tibetan: 'དབུ་ཅན།' },
  { labelKey: 'filters.categoryUme', value: 'Umê', tibetan: 'འཁྱུག་ཡིག' },
  { labelKey: 'filters.categoryDrutsa', value: 'Drutsa', tibetan: 'འབྲུ་ཚ' },
  { labelKey: 'filters.categoryTsugring', value: 'Tsugring', tibetan: 'ཚུགས་རིང' },
  { labelKey: 'filters.categoryPetsug', value: 'Petsug', tibetan: 'དཔེ་ཚུགས' },
  { labelKey: 'filters.categoryModern', value: 'Modern', tibetan: 'མགོ་མེད' },
  { labelKey: 'filters.categoryStandard', value: 'Standard', tibetan: 'ཚད་ལྡན།' },
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
  fontWeight,
  setFontWeight,
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
  const { t, locale } = useI18n();
  const [presetsOpen, setPresetsOpen] = React.useState(false);
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
    setActivePresetId(PRESET_ID_FONT_SAMPLE);
    const sample =
      catalogFonts.find((f) => (f.fontKind || 'normal') === 'special')?.sampleText ||
      catalogFonts[0]?.sampleText ||
      previewText;
    setPreviewText(sample);
  };

  const collapseSidebar = () => setSidebarOpen(false);
  const expandSidebar = () => setSidebarOpen(true);

  const collapsedRailSections: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  }[] = [
    { icon: <Type className="w-4 h-4" />, label: t('filters.sampleText') },
    { icon: <SlidersHorizontal className="w-4 h-4" />, label: t('filters.railTypography') },
    {
      icon: <LayoutGrid className="w-4 h-4" />,
      label: isSpecialMode ? t('filters.railPresetsCustom') : t('filters.railPresets'),
      onClick: () => setPresetsOpen(true)
    },
    {
      icon: <Tags className="w-4 h-4" />,
      label: t('filters.scriptStyle'),
      onClick: () => setScriptStyleOpen(true)
    }
  ];

  return (
    <div className="flex items-start w-full relative overflow-visible">
      {/* Mobile overlay — full drawer only on small screens */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-label={t('filters.closePanel')}
          onClick={collapseSidebar}
        />
      )}

      {/* Preview panel: mobile drawer | desktop expanded (w-72) | desktop collapsed icon rail (w-14) */}
      <aside
        className={`fixed top-16 z-50 h-[calc(100vh-4rem)] overflow-visible bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-[width,transform] duration-200 ease-out left-0 lg:sticky lg:z-30 lg:shrink-0 lg:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0 w-[min(100vw-2.5rem,20rem)] lg:w-72'
            : '-translate-x-full w-[min(100vw-2.5rem,20rem)] lg:translate-x-0 lg:w-14'
        }`}
      >
        {/* Collapsed desktop rail */}
        <div
          className={`hidden lg:flex flex-col items-center h-full py-3 gap-1 overflow-visible ${
            sidebarOpen ? 'lg:hidden' : ''
          }`}
        >
          <HoverTip label={t('filters.title')} placement="right">
            <button
              type="button"
              onClick={expandSidebar}
              className="p-2.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 mb-2"
              aria-label={t('filters.expandPanel')}
            >
              <Filter className="w-4 h-4" />
            </button>
          </HoverTip>
          {collapsedRailSections.map((item) => (
            <HoverTip key={item.label} label={item.label} placement="right">
              <button
                type="button"
                onClick={() => {
                  item.onClick?.();
                  expandSidebar();
                }}
                className="p-2.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                aria-label={item.label}
              >
                {item.icon}
              </button>
            </HoverTip>
          ))}
        </div>

        {/* Expanded panel (mobile drawer + desktop full width) */}
        <div
          className={`flex flex-col h-full w-full lg:w-72 min-w-0 ${
            sidebarOpen ? '' : 'hidden lg:hidden'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800 shrink-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">{t('filters.title')}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                {t('filters.resetAll')}
              </button>
              <button
                type="button"
                onClick={collapseSidebar}
                className="group relative p-1 rounded-md text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                aria-label={t('filters.collapsePanel')}
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-6">
            <section className="space-y-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                <Type className="w-3.5 h-3.5" />
                {t('filters.sampleText')}
              </label>
              <textarea
                value={previewText}
                onChange={(e) => {
                  setPreviewText(e.target.value);
                  setActivePresetId(PRESET_ID_CUSTOM);
                }}
                rows={5}
                placeholder={t('filters.previewPlaceholder')}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100/80 dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent tibetan-text whitespace-pre-line resize-none transition"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 dark:text-slate-300">{t('filters.size')}</span>
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
                    <Bold className="w-3 h-3" />
                    {t('filters.boldness')}
                  </span>
                  <span className="font-mono text-gray-600 dark:text-slate-400 tabular-nums">{fontWeight}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="900"
                  step="100"
                  value={fontWeight}
                  onChange={(e) => setFontWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { w: 400, label: t('common.regular') },
                    { w: 500, label: t('common.medium') },
                    { w: 600, label: t('common.semibold') },
                    { w: 700, label: t('common.bold') }
                  ].map(({ w, label }) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setFontWeight(w)}
                      className={`px-2 py-0.5 rounded-md text-[11px] border transition ${
                        fontWeight === w
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                          : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 dark:text-slate-300 inline-flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3" />
                    {t('filters.lineHeight')}
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
                  {t('filters.vowelHint')}
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
                  {isSpecialMode ? t('filters.custom') : t('filters.presets')}
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
                          activePresetId === PRESET_ID_FONT_SAMPLE
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800 font-semibold'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-100 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className="block">{t('filters.fontSample')}</span>
                        <span className="block mt-0.5 text-gray-500 dark:text-slate-400 opacity-80">
                          {t('filters.fontSampleHint')}
                        </span>
                      </button>
                      {specialOptions.map((preset) => {
                        const isActive = activePresetId === preset.id;
                        const titles = localeBilingualPair(preset.title, preset.tibetanTitle, locale);
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
                            <BilingualStack
                              titles={titles}
                              secondaryClassName={
                                isActive
                                  ? 'text-amber-800/80 dark:text-amber-200/80'
                                  : 'text-gray-500 dark:text-slate-400 opacity-80'
                              }
                            />
                            {preset.customized ? (
                              <span className="block mt-0.5 opacity-80">{t('filters.presetCustomSuffix')}</span>
                            ) : null}
                          </button>
                        );
                      })}
                      {specialOptions.length === 0 && (
                        <p className="px-1 text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                          {t('filters.noSpecialPresets')}
                        </p>
                      )}
                    </>
                  ) : (
                    presets.map((preset) => {
                      const isActive = activePresetId === preset.id;
                      const titles = localeBilingualPair(preset.title, preset.tibetanTitle, locale);
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
                          <BilingualStack
                            titles={titles}
                            secondaryClassName={
                              isActive
                                ? 'text-blue-700/80 dark:text-blue-200/80'
                                : 'text-gray-500 dark:text-slate-400 opacity-80'
                            }
                          />
                        </button>
                      );
                    })
                  )}
                </div>
              )}
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
                    {t('filters.scriptStyle')}
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
                    const titles = localeBilingualPair(
                      translate('en', cat.labelKey),
                      translate('bo', cat.labelKey),
                      locale
                    );
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border text-left ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <BilingualStack
                          titles={titles}
                          secondaryClassName={
                            isSelected ? 'text-blue-100/90' : 'text-gray-400 dark:text-slate-500'
                          }
                        />
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
            <HoverTip
              label={sidebarOpen ? t('filters.collapsePanel') : t('filters.title')}
              placement="top"
            >
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? t('filters.collapsePanel') : t('filters.expandPanel')}
                className={`lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border transition ${
                  sidebarOpen
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </HoverTip>

            <div
              className="inline-flex items-center p-0.5 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs"
              role="group"
              aria-label={t('filters.fontKindAria')}
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
                    {t(opt.labelKey)}
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
                placeholder={t('catalog.searchPlaceholder')}
                className="w-full pl-9 pr-9 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400 p-0.5"
                  aria-label={t('filters.clearSearch')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg p-0.5 bg-white dark:bg-slate-800 ml-auto">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label={t('filters.viewGrid')}
                className={`p-1.5 rounded-md transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label={t('filters.viewList')}
                className={`p-1.5 rounded-md transition ${
                  viewMode === 'list'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('sample')}
                aria-label={t('filters.viewSample')}
                className={`p-1.5 rounded-md transition ${
                  viewMode === 'sample'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
              >
                <GalleryThumbnails className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full min-w-0">{children}</div>
      </div>
    </div>
  );
};
