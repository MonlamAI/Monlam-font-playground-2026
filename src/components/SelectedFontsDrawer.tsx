import React from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Trash2,
  ShoppingBag,
  Sparkles,
  Apple,
  Laptop
} from 'lucide-react';
import { FontItem } from '../types/font';
import { downloadSelectedFontsZip, generateEmbedCode } from '../utils/fontDownloader';
import {
  BODYIG_SUITE,
  getBodyigDownload,
  openOfficialDownload
} from '../data/officialDownloads';
import { useI18n } from '../i18n/I18nProvider';

interface SelectedFontsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFonts: FontItem[];
  onRemoveFont: (fontId: string) => void;
  onClearAll: () => void;
  onOpenInstall?: () => void;
}

export const SelectedFontsDrawer: React.FC<SelectedFontsDrawerProps> = ({
  isOpen,
  onClose,
  selectedFonts,
  onRemoveFont,
  onClearAll,
  onOpenInstall
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState<'download' | 'embed'>('download');
  const [downloading, setDownloading] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedCss, setCopiedCss] = React.useState(false);

  if (!isOpen) return null;

  const embed = generateEmbedCode(selectedFonts);
  const macPkg = getBodyigDownload('mac');
  const winPkg = getBodyigDownload('windows');

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      await downloadSelectedFontsZip(selectedFonts);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(embed.html);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(embed.css);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-screen sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-gray-200 dark:border-slate-800">
          {/* Drawer Top Header */}
          <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100 text-base tibetan-text">{t('cart.drawerTitle')}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 tibetan-text">
                  {t(selectedFonts.length === 1 ? 'cart.chosenCount_one' : 'cart.chosenCount_other', {
                    count: selectedFonts.length
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Font & Keyboard Suite — always available */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-start gap-2.5 mb-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                  {t('cart.suiteTitle')}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed tibetan-text">
                  {t('cart.suiteDesc', { name: BODYIG_SUITE.name, version: BODYIG_SUITE.version })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => openOfficialDownload(macPkg.url)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 text-xs font-semibold text-gray-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <Apple className="w-3.5 h-3.5" />
                {t('install.downloadMac')}
              </button>
              <button
                type="button"
                onClick={() => openOfficialDownload(winPkg.url)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 text-xs font-semibold text-gray-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <Laptop className="w-3.5 h-3.5" />
                {t('install.downloadWin')}
              </button>
            </div>

            {onOpenInstall && (
              <button
                type="button"
                onClick={onOpenInstall}
                className="mt-2.5 w-full text-left text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
              >
                {t('install.openInstallCenter')}
              </button>
            )}
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {selectedFonts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-gray-400 dark:text-slate-500">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-slate-200 text-sm tibetan-text">{t('cart.emptyTitle')}</h4>
                <p className="text-xs max-w-xs mx-auto tibetan-text">{t('cart.emptyBody')}</p>
              </div>
            ) : (
              <>
                {/* List of Selected Fonts */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 font-semibold">
                    <span>{t('cart.selectedHeading')}</span>
                    <button
                      onClick={onClearAll}
                      className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-normal"
                    >
                      <Trash2 className="w-3 h-3" /> {t('cart.clearAll')}
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-slate-800/50">
                    {selectedFonts.map((font) => (
                      <div
                        key={font.id}
                        className="p-3 flex items-center justify-between gap-2 hover:bg-white dark:hover:bg-slate-800 transition"
                      >
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-slate-100 text-xs tibetan-text">{font.tibetanName}</div>
                          <div className="text-[11px] text-gray-500 dark:text-slate-400">
                            ({font.name}) • {font.category}
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveFont(font.id)}
                          title={t('cart.remove')}
                          className="p-1 text-gray-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tab Switcher: Download ZIP vs Web Embed Code */}
                <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-1 bg-gray-100 dark:bg-slate-800 flex items-center text-xs">
                  <button
                    onClick={() => setActiveTab('download')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                      activeTab === 'download'
                        ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {t('cart.tabDownload')}
                  </button>
                  <button
                    onClick={() => setActiveTab('embed')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                      activeTab === 'embed'
                        ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {t('cart.tabEmbed')}
                  </button>
                </div>

                {/* Tab Content 1: Download info */}
                {activeTab === 'download' ? (
                  <div className="space-y-4 text-xs text-gray-600 dark:text-slate-400 bg-blue-50/60 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200/60 dark:border-blue-800/50">
                    <div className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span>{t('cart.readyPackage', { count: selectedFonts.length })}</span>
                    </div>
                    <p className="leading-relaxed text-blue-800/80 dark:text-blue-300/80 tibetan-text">{t('cart.bundleDesc')}</p>
                  </div>
                ) : (
                  /* Tab Content 2: Web Embed Code */
                  <div className="space-y-4 text-xs">
                    {/* HTML Link */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-gray-700 dark:text-slate-300 font-semibold">
                        <span>{t('cart.embedHeadStep')}</span>
                        <button
                          onClick={handleCopyLink}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                        >
                          {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedLink ? t('common.copied') : t('common.copy')}</span>
                        </button>
                      </div>
                      <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed">
                        {embed.html}
                      </pre>
                    </div>

                    {/* CSS Font-Family */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-gray-700 dark:text-slate-300 font-semibold">
                        <span>{t('cart.embedCssRulesStep')}</span>
                        <button
                          onClick={handleCopyCss}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                        >
                          {copiedCss ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCss ? t('common.copied') : t('common.copy')}</span>
                        </button>
                      </div>
                      <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed">
                        {embed.css}
                      </pre>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawer Bottom Action */}
          {selectedFonts.length > 0 && (
            <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80">
              <button
                onClick={handleDownloadZip}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition active:scale-95 shadow-md disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloading
                    ? t('cart.creatingZip')
                    : t('cart.downloadSelectedZip', { count: selectedFonts.length })}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
