import React from 'react';
import { X, Download, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import { FontItem } from '../types/font';
import { downloadSelectedFontsZip } from '../utils/fontDownloader';
import { useI18n } from '../i18n/I18nProvider';
import { localizeDigitsInString, localeNumeralsClass } from '../utils/localeNumber';
import { fontAssetLabel, uiTibetanClass } from '../utils/fontDisplay';
import { useScriptStylesContext } from '../contexts/ScriptStylesContext';

interface SelectedFontsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFonts: FontItem[];
  onRemoveFont: (fontId: string) => void;
  onClearAll: () => void;
}

export const SelectedFontsDrawer: React.FC<SelectedFontsDrawerProps> = ({
  isOpen,
  onClose,
  selectedFonts,
  onRemoveFont,
  onClearAll
}) => {
  const { t, locale } = useI18n();
  const { labelForCategory } = useScriptStylesContext();
  const uiBo = uiTibetanClass(locale, true);
  const cartCount = selectedFonts.length;
  const [downloading, setDownloading] = React.useState(false);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="flex w-full flex-col justify-between border-l border-gray-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:w-screen sm:max-w-md">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 tibetan-text">
                  {t('cart.drawerTitle')}
                </h3>
                <p className={`text-xs text-gray-600 dark:text-slate-300 tibetan-text ${localeNumeralsClass}`}>
                  {t(selectedFonts.length === 1 ? 'cart.chosenCount_one' : 'cart.chosenCount_other', {
                    count: cartCount
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-5">
            {selectedFonts.length === 0 ? (
              <div className="space-y-3 py-12 text-center text-gray-500 dark:text-slate-400">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200 tibetan-text">
                  {t('cart.emptyTitle')}
                </h4>
                <p className="mx-auto max-w-xs text-xs tibetan-text">{t('cart.emptyBody')}</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-slate-400">
                    <span>{t('cart.selectedHeading')}</span>
                    <button
                      onClick={onClearAll}
                      className="flex items-center gap-1 font-normal text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="h-3 w-3" /> {t('cart.clearAll')}
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 dark:divide-slate-800 dark:border-slate-700 dark:bg-slate-800/50">
                    {selectedFonts.map((font) => (
                      <div
                        key={font.id}
                        className="flex items-center justify-between gap-2 p-3 transition hover:bg-white dark:hover:bg-slate-800"
                      >
                        <div>
                          <div
                            className={`text-xs font-semibold text-gray-900 dark:text-slate-100 ${locale === 'bo' ? 'tibetan-text' : ''}`}
                          >
                            {fontAssetLabel(font, locale)}
                          </div>
                          <div className={`text-[11px] text-gray-500 dark:text-slate-400 ${uiBo}`}>
                            {labelForCategory(font.category)} •{' '}
                            {localizeDigitsInString(font.fileSize, locale)}
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveFont(font.id)}
                          title={t('cart.remove')}
                          className="p-1 text-gray-400 transition hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 rounded-xl border border-blue-200/60 bg-blue-50/60 p-4 text-xs text-gray-600 dark:border-blue-800/50 dark:bg-blue-950/40 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-900 dark:text-blue-200">
                    <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                    <span className={localeNumeralsClass}>{t('cart.readyPackage', { count: cartCount })}</span>
                  </div>
                  <p className="leading-relaxed text-blue-800/80 tibetan-text dark:text-blue-300/80">
                    {t('cart.bundleDesc')}
                  </p>
                </div>
              </>
            )}
          </div>

          {selectedFonts.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/80">
              <button
                onClick={handleDownloadZip}
                disabled={downloading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-95 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span className={localeNumeralsClass}>
                  {downloading ? t('cart.creatingZip') : t('cart.downloadSelectedZip', { count: cartCount })}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
