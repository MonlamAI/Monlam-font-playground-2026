import React from 'react';
import { Download, GitCompare, Eye, Check, Plus } from 'lucide-react';
import { TooltipButton, TooltipIconButton } from './HoverTooltip';
import { FontItem } from '../types/font';
import { downloadSingleFont } from '../utils/fontDownloader';
import { useI18n } from '../i18n/I18nProvider';
import { catalogPreviewLineHeight, fontCardTitlePair, uiTibetanClass } from '../utils/fontDisplay';
import { localizeDigitsInString } from '../utils/localeNumber';
import { useScriptStylesContext } from '../contexts/ScriptStylesContext';

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
  const { labelForCategory } = useScriptStylesContext();
  const titles = fontCardTitlePair(font, locale);
  const uiBo = uiTibetanClass(locale, true);
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
    'inline-flex min-h-9 h-9 w-9 shrink-0 items-center justify-center rounded-md font-medium';
  const footerIconBtnIdle =
    'transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-slate-700';
  const footerActionBtn =
    'inline-flex min-h-9 shrink-0 items-center justify-center gap-1 rounded-md font-medium transition p-2 sm:px-2.5 sm:py-1.5 sm:whitespace-nowrap';

  const previewLineHeight = catalogPreviewLineHeight(font, lineHeight);
  const descenderPad = Math.round(fontSize * 0.45);
  const previewMinHeight = singleLinePreview
    ? undefined
    : Math.max(180, Math.round(fontSize * previewLineHeight * 2 + fontSize * 0.55));

  return (
    <div
      className={`font-card group relative flex h-full min-w-0 w-full flex-col justify-between overflow-hidden rounded-xl border bg-white transition-all duration-200 dark:bg-slate-900 ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-gray-50/50 dark:bg-slate-900/50 min-h-[4.75rem] rounded-t-xl overflow-hidden">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0 flex-nowrap">
            <h3
              className={`font-semibold text-gray-900 dark:text-slate-100 text-base tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition truncate min-w-0 ${
                titles.primaryIsTibetan ? 'tibetan-text' : ''
              }`}
            >
              {titles.primary}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/50 dark:border-blue-800 shrink-0 whitespace-nowrap ${uiBo}`}
            >
              {labelForCategory(font.category)}
            </span>
            {font.fontKind === 'special' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-medium border border-amber-200/50 dark:border-amber-800 shrink-0 whitespace-nowrap">
                {t('common.special')}
              </span>
            )}
          </div>

          {titles.secondary ? (
            <div className="mt-1 min-w-0 overflow-hidden">
              <span
                className={`block truncate text-sm text-gray-600 dark:text-slate-400 ${
                  !titles.primaryIsTibetan ? 'tibetan-text' : ''
                }`}
              >
                {titles.secondary}
              </span>
            </div>
          ) : null}
        </div>

        <TooltipIconButton
          label={isSelected ? t('catalog.removeFromBag') : t('catalog.addToBag')}
          ariaLabel={isSelected ? t('catalog.removeFromBag') : t('catalog.addToBag')}
          onClick={() => onToggleSelect(font)}
          className={`flex items-center justify-center w-8 h-8 rounded-lg border transition ${
            isSelected
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
          }`}
        >
          {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
        </TooltipIconButton>
      </div>

      {/* Font Sample Live Preview Area */}
      <div
        style={
          singleLinePreview
            ? { paddingBottom: descenderPad }
            : { minHeight: previewMinHeight, paddingBottom: descenderPad }
        }
        className={`font-card__preview min-w-0 flex flex-col justify-center overflow-x-hidden overflow-y-visible ${
          singleLinePreview ? 'min-h-0 py-3 sm:py-4 px-4 sm:px-6' : 'flex-1 p-4 sm:p-6'
        }`}
      >
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setLocalText(e.currentTarget.textContent || '')}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: previewLineHeight,
            fontWeight,
            overflowWrap: singleLinePreview ? 'anywhere' : undefined,
            ['--font-card-preview-lh' as string]: String(previewLineHeight),
            ...(font.fileUrl
              ? { fontFamily: `'${font.name}', 'Noto Serif Tibetan', 'Jomolhari', serif` }
              : {})
          }}
          className={`${font.cssClass} tibetan-text text-gray-900 dark:text-slate-100 focus:outline-hidden focus:bg-blue-50/20 dark:focus:bg-blue-950/30 p-2 rounded-lg transition-colors min-w-0 w-full max-w-full overflow-visible ${
            singleLinePreview ? 'whitespace-normal break-words' : 'break-words whitespace-pre-line'
          } ${centerPreview ? 'text-center' : 'text-left'}`}
        >
          {displayText}
        </div>
      </div>

      {/* Card Footer Toolbar */}
      <div className="px-4 py-3 bg-gray-50/80 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs min-h-[3.5rem] rounded-b-xl overflow-hidden">
        <div className="flex flex-nowrap items-center gap-1.5 shrink min-w-0">
          <TooltipIconButton
            label={t('catalog.cardActionCompare')}
            ariaLabel={isCompared ? t('catalog.removeCompare') : t('catalog.addCompare')}
            onClick={() => onToggleCompare(font)}
            className={`${footerIconBtn} ${
              isCompared
                ? 'bg-indigo-600 text-white shadow-xs'
                : `${footerIconBtnIdle} bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700`
            }`}
          >
            <GitCompare className="w-4 h-4 shrink-0" />
          </TooltipIconButton>

          <TooltipIconButton
            label={t('catalog.cardActionGlyphs')}
            ariaLabel={t('catalog.openGlyphs')}
            onClick={() => onOpenGlyphs(font)}
            className={`${footerIconBtn} ${footerIconBtnIdle} bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700`}
          >
            <Eye className="w-4 h-4 shrink-0" />
          </TooltipIconButton>
        </div>

        <TooltipButton
          label={`${t('catalog.cardActionDownload')} ${localizeDigitsInString(font.filename, locale)} (${localizeDigitsInString(font.fileSize, locale)})`}
          ariaLabel={`${t('catalog.cardActionDownload')} ${font.filename}`}
          onClick={handleDownload}
          className={`${footerActionBtn} bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700`}
        >
          <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" aria-hidden />
          <span
            className={`hidden sm:inline ${locale === 'bo' ? 'tibetan-text-ui tibetan-text' : ''}`}
          >
            {t('catalog.cardActionDownload')}
          </span>
          {locale !== 'bo' ? (
            <span className="hidden sm:inline text-[10px] opacity-75 font-mono shrink-0">.ttf</span>
          ) : null}
        </TooltipButton>
      </div>
    </div>
  );
};
