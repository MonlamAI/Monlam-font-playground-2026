import React from 'react';
import { createPortal } from 'react-dom';
import { Download, GitCompare, Eye, Check, Plus } from 'lucide-react';
import { FontItem } from '../types/font';
import { downloadSingleFont } from '../utils/fontDownloader';
import { useI18n } from '../i18n/I18nProvider';
import { fontCardTitlePair, fontCategoryLabel } from '../utils/fontDisplay';

interface FontCardProps {
  font: FontItem;
  previewText: string;
  activePresetId?: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  isSelected: boolean;
  onToggleSelect: (font: FontItem) => void;
  isCompared: boolean;
  onToggleCompare: (font: FontItem) => void;
  onOpenGlyphs: (font: FontItem) => void;
  centerPreview?: boolean;
  /** List view: one-line preview (preset line breaks collapsed). */
  singleLinePreview?: boolean;
}

const iconTipBubble =
  'pointer-events-none whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-md dark:bg-slate-100 dark:text-slate-900';

function IconTipButton({
  label,
  ariaLabel,
  onClick,
  className,
  children
}: {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });

  const show = () => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ x: rect.left + rect.width / 2, y: rect.top - 6 });
    setVisible(true);
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        onFocus={show}
        onBlur={() => setVisible(false)}
        className={className}
      >
        {children}
      </button>
      {visible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="tooltip"
            className={`fixed z-[9999] ${iconTipBubble}`}
            style={{ left: coords.x, top: coords.y, transform: 'translate(-50%, -100%)' }}
          >
            {label}
          </div>,
          document.body
        )}
    </>
  );
}

export const FontCard: React.FC<FontCardProps> = ({
  font,
  previewText,
  activePresetId,
  fontSize,
  lineHeight,
  fontWeight,
  isSelected,
  onToggleSelect,
  isCompared,
  onToggleCompare,
  onOpenGlyphs,
  centerPreview = false,
  singleLinePreview = false
}) => {
  const { t, locale } = useI18n();
  const titles = fontCardTitlePair(font, locale);
  const [localText, setLocalText] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setLocalText(null);
  }, [activePresetId, previewText]);

  const rawDisplayText = localText !== null ? localText : previewText;
  const displayText = singleLinePreview
    ? rawDisplayText.replace(/\s*\n+\s*/g, ' ').trim()
    : rawDisplayText;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadSingleFont(font);
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const footerIconBtn =
    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-medium transition';
  const footerActionBtn =
    'inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-md font-medium transition px-2 min-w-0';

  return (
    <div
      className={`font-card group relative w-full min-w-0 bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-gray-50/50 dark:bg-slate-900/50 min-h-[4.75rem]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0 flex-nowrap">
            <h3
              className={`font-semibold text-gray-900 dark:text-slate-100 text-base tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition truncate min-w-0 ${
                titles.primaryIsTibetan ? 'tibetan-text' : ''
              }`}
            >
              {titles.primary}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/50 dark:border-blue-800 shrink-0 whitespace-nowrap">
              {fontCategoryLabel(font.category, t)}
            </span>
            {font.fontKind === 'special' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-medium border border-amber-200/50 dark:border-amber-800 shrink-0 whitespace-nowrap">
                {t('common.special')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 min-w-0 flex-nowrap overflow-hidden">
            <span
              className={`text-sm text-gray-600 dark:text-slate-400 truncate min-w-0 ${
                !titles.primaryIsTibetan ? 'tibetan-text' : ''
              }`}
            >
              {titles.secondary}
            </span>
            <span className="text-gray-300 dark:text-slate-600 shrink-0">•</span>
            <span className="text-xs text-gray-500 dark:text-slate-400 shrink-0 whitespace-nowrap">
              {t(font.stylesCount === 1 ? 'common.styles_one' : 'common.styles_other', {
                count: font.stylesCount
              })}
            </span>
          </div>
        </div>

        {/* Selection Checkbox */}
        <button
          onClick={() => onToggleSelect(font)}
          title={isSelected ? t('catalog.removeFromBag') : t('catalog.addToBag')}
          className={`flex items-center justify-center w-8 h-8 rounded-lg border transition ${
            isSelected
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
          }`}
        >
          {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Font Sample Live Preview Area */}
      <div
        className={`min-w-0 overflow-hidden flex flex-col justify-center ${
          singleLinePreview ? 'min-h-0 py-3 sm:py-4 px-4 sm:px-6' : 'flex-1 min-h-[140px] p-4 sm:p-6'
        }`}
      >
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setLocalText(e.currentTarget.textContent || '')}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: singleLinePreview ? 1.35 : lineHeight,
            fontWeight,
            overflowWrap: singleLinePreview ? 'anywhere' : undefined,
            ...(font.fileUrl
              ? { fontFamily: `'${font.name}', 'Noto Serif Tibetan', 'Jomolhari', serif` }
              : {})
          }}
          className={`${font.cssClass} tibetan-text text-gray-900 dark:text-slate-100 focus:outline-hidden focus:bg-blue-50/20 dark:focus:bg-blue-950/30 p-2 rounded-lg transition-colors min-w-0 w-full max-w-full ${
            singleLinePreview
              ? 'whitespace-normal break-words overflow-hidden'
              : 'break-words whitespace-pre-line'
          } ${centerPreview ? 'text-center' : 'text-left'}`}
        >
          {displayText}
        </div>
      </div>

      {/* Card Footer Toolbar */}
      <div className="px-4 py-3 bg-gray-50/80 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex flex-nowrap items-center justify-between gap-2 text-xs min-h-[3.25rem]">
        <div className="flex flex-nowrap items-center gap-1.5 shrink min-w-0">
          <IconTipButton
            label={t('catalog.cardActionCompare')}
            ariaLabel={isCompared ? t('catalog.removeCompare') : t('catalog.addCompare')}
            onClick={() => onToggleCompare(font)}
            className={`${footerIconBtn} ${
              isCompared
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700'
            }`}
          >
            <GitCompare className="w-4 h-4 shrink-0" />
          </IconTipButton>

          <IconTipButton
            label={t('catalog.cardActionGlyphs')}
            ariaLabel={t('catalog.openGlyphs')}
            onClick={() => onOpenGlyphs(font)}
            className={`${footerIconBtn} bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700`}
          >
            <Eye className="w-4 h-4 shrink-0" />
          </IconTipButton>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          title={`${t('catalog.cardActionDownload')} ${font.filename} (${font.fileSize})`}
          aria-label={`${t('catalog.cardActionDownload')} ${font.filename}`}
          className={`${footerActionBtn} w-[8rem] bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700`}
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t('catalog.cardActionDownload')}</span>
          <span className="text-[10px] opacity-75 font-mono shrink-0">.ttf</span>
        </button>
      </div>
    </div>
  );
};
