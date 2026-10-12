import React from 'react';
import { Download, GitCompare, Eye, Check, Plus, ExternalLink } from 'lucide-react';
import { FontItem } from '../types/font';
import { downloadSingleFont } from '../utils/fontDownloader';

interface FontCardProps {
  font: FontItem;
  previewText: string;
  activePresetId?: string;
  fontSize: number;
  lineHeight: number;
  isSelected: boolean;
  onToggleSelect: (font: FontItem) => void;
  isCompared: boolean;
  onToggleCompare: (font: FontItem) => void;
  onOpenGlyphs: (font: FontItem) => void;
  centerPreview?: boolean;
}

export const FontCard: React.FC<FontCardProps> = ({
  font,
  previewText,
  activePresetId,
  fontSize,
  lineHeight,
  isSelected,
  onToggleSelect,
  isCompared,
  onToggleCompare,
  onOpenGlyphs,
  centerPreview = false
}) => {
  const [localText, setLocalText] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setLocalText(null);
  }, [activePresetId, previewText]);

  const displayText = localText !== null ? localText : previewText;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadSingleFont(font);
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`font-card group relative bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-gray-50/50 dark:bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-base tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition">
              {font.name}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/50 dark:border-blue-800">
              {font.category}
            </span>
            {font.fontKind === 'special' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-medium border border-amber-200/50 dark:border-amber-800">
                Special
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600 dark:text-slate-400 tibetan-text font-medium">
              {font.tibetanName}
            </span>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <span className="text-xs text-gray-500 dark:text-slate-400">
              {font.stylesCount} {font.stylesCount === 1 ? 'style' : 'styles'}
            </span>
          </div>
        </div>

        {/* Selection Checkbox */}
        <button
          onClick={() => onToggleSelect(font)}
          title={isSelected ? 'Remove from download bag' : 'Add to download bag'}
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
      <div className="p-4 sm:p-6 flex-1 min-h-[140px] flex flex-col justify-center">
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setLocalText(e.currentTarget.textContent || '')}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            ...(font.fileUrl
              ? { fontFamily: `'${font.name}', 'Noto Serif Tibetan', 'Jomolhari', serif` }
              : {})
          }}
          className={`${font.cssClass} tibetan-text text-gray-900 dark:text-slate-100 focus:outline-hidden focus:bg-blue-50/20 dark:focus:bg-blue-950/30 p-2 rounded-lg transition-colors break-words ${
            centerPreview ? 'text-center' : 'text-left'
          }`}
        >
          {displayText}
        </div>
      </div>

      {/* Card Footer Toolbar */}
      <div className="px-4 py-3 bg-gray-50/80 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          {/* Compare Button */}
          <button
            onClick={() => onToggleCompare(font)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition ${
              isCompared
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          {/* Glyphs inspection */}
          <button
            onClick={() => onOpenGlyphs(font)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 transition font-medium"
            title="Inspect full glyph set, Unicode codes, and metrics"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Glyphs</span>
          </button>
        </div>

        {/* Download Font Asset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 font-medium transition"
            title={`Download ${font.filename} (${font.fileSize})`}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
            <span className="text-[10px] opacity-75 font-mono">.ttf</span>
          </button>
        </div>
      </div>
    </div>
  );
};
