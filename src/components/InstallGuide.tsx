import React from 'react';
import {
  Download,
  Laptop,
  Apple,
  ExternalLink,
  ChevronDown,
  ListOrdered,
  FolderDown
} from 'lucide-react';
import { FontItem } from '../types/font';
import { downloadSingleFont } from '../utils/fontDownloader';
import {
  BODYIG_SUITE,
  OFFICIAL_BODYIG_DOWNLOADS,
  openOfficialDownload
} from '../data/officialDownloads';
import { InstallStepsCarousel } from './InstallStepsCarousel';
import {
  bodyigVisualGuidePdfFilename,
  bodyigVisualGuidePdfUrl,
  bodyigVisualGuideSlides
} from '../data/bodyigVisualGuide';
import { useI18n } from '../i18n/I18nProvider';
import { fontCardTitlePair, localePick, uiTibetanClass } from '../utils/fontDisplay';
import { formatLocaleNumber, localizeDigitsInString, localeNumeralsClass } from '../utils/localeNumber';
import { useScriptStylesContext } from '../contexts/ScriptStylesContext';
import { TabScrollLayout } from './TabScrollLayout';
import { AppFooter } from './AppFooter';

interface InstallGuideProps {
  allFonts: FontItem[];
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ allFonts }) => {
  const { t, locale } = useI18n();
  const { labelForCategory } = useScriptStylesContext();
  const [activeOs, setActiveOs] = React.useState<'windows' | 'mac'>('windows');
  const [assetListOpen, setAssetListOpen] = React.useState(false);

  const macDownload = OFFICIAL_BODYIG_DOWNLOADS.find((d) => d.platform === 'mac')!;
  const winDownload = OFFICIAL_BODYIG_DOWNLOADS.find((d) => d.platform === 'windows')!;
  const suiteTitle = `${localePick(BODYIG_SUITE.name, BODYIG_SUITE.tibetanName, locale)} ${BODYIG_SUITE.version}`;
  const uiBo = uiTibetanClass(locale);

  const visualSlides = React.useMemo(() => {
    const paths = bodyigVisualGuideSlides(activeOs, locale);
    return paths.map((imageSrc, i) => ({
      imageSrc,
      alt: t('install.visualSlideAlt', {
        step: formatLocaleNumber(i + 1, locale),
        os: activeOs === 'mac' ? t('install.osMac') : t('install.osWindows')
      })
    }));
  }, [activeOs, locale, t]);

  const visualGuidePdfHref = bodyigVisualGuidePdfUrl(activeOs);
  const visualGuidePdfDownload = bodyigVisualGuidePdfFilename(activeOs);

  return (
    <TabScrollLayout scrollFooter={<AppFooter />}>
    <div className="relative mx-auto w-full min-w-0 max-w-5xl space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-100/80 via-transparent to-transparent dark:from-blue-950/40"
      />

      {/* DOWNLOAD PACKAGES SECTION */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-700/40 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 p-5 text-white shadow-xl shadow-blue-950/25 sm:p-7 lg:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-400/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]"
        />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-3">
              <img
                src="/logos/bodyig.svg"
                alt=""
                className="h-11 w-11 shrink-0 rounded-xl bg-white/10 p-1.5 ring-1 ring-white/20 backdrop-blur-sm"
                width={44}
                height={44}
              />
              <div className="min-w-0">
                <h3 className={`text-xl font-bold tracking-tight text-white sm:text-2xl ${locale === 'bo' ? 'tibetan-text' : ''}`}>
                  {suiteTitle}
                </h3>
              </div>
            </div>
            <p className={`text-sm leading-relaxed text-blue-100/85 ${uiBo}`}>{t('install.suiteDescription')}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-blue-50">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                ✓ {t('install.fullTypefaceSet')}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                ✓ {t('install.keyboardInstallers')}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                ✓ {t('install.macAndWindows')}
              </span>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col justify-end space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:w-72 xl:w-80">
            <p className="text-xs font-medium text-blue-200/80">{t('install.selectOs')}</p>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={() => {
                  setActiveOs('mac');
                  openOfficialDownload(macDownload.url);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-blue-50 active:scale-95"
              >
                <Apple className="h-4 w-4" />
                <span className="tibetan-text">{t('install.downloadMac')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveOs('windows');
                  openOfficialDownload(winDownload.url);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-400 active:scale-95"
              >
                <Laptop className="h-4 w-4" />
                <span className="tibetan-text">{t('install.downloadWin')}</span>
              </button>
            </div>
            <a
              href={BODYIG_SUITE.sourcePage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-200 transition hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{t('install.sourceLink')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* OS STEP-BY-STEP INSTALLATION GUIDES */}
      <section className="relative overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/40 p-5 shadow-md shadow-blue-900/5 dark:border-blue-900/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 sm:p-7 lg:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-600/10"
        />
        <div className="relative space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-blue-100/80 pb-5 dark:border-slate-700/80 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <ListOrdered className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 tibetan-text">{t('install.stepsTitle')}</h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">{t('install.osWindows')} / {t('install.osMac')}</p>
            </div>
          </div>

          {/* OS Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-blue-100 bg-white/80 p-1 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
            <button
              onClick={() => setActiveOs('windows')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeOs === 'windows' ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>{t('install.osWindows')}</span>
            </button>
            <button
              onClick={() => setActiveOs('mac')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeOs === 'mac' ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>{t('install.osMac')}</span>
            </button>
          </div>
        </div>

        <InstallStepsCarousel
          slides={visualSlides}
          resetKey={`${activeOs}-${locale}`}
        />

        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-blue-100/80 pt-4 dark:border-slate-700/80 sm:justify-start">
          <a
            href={visualGuidePdfHref}
            download={visualGuidePdfDownload}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-200 dark:hover:bg-blue-950/50"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span className="tibetan-text">
              {t('install.downloadVisualGuidePdf', {
                os: activeOs === 'mac' ? t('install.osMac') : t('install.osWindows')
              })}
            </span>
          </a>
          <p className="text-xs text-gray-500 dark:text-slate-400 tibetan-text">{t('install.visualGuidePdfHint')}</p>
        </div>
        </div>
      </section>

      {/* INDIVIDUAL FONT ASSET DIRECT DOWNLOAD TABLE */}
      <section className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30 shadow-md shadow-emerald-900/5 dark:border-emerald-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/25">
        <button
          type="button"
          onClick={() => setAssetListOpen((open) => !open)}
          aria-expanded={assetListOpen}
          className={`flex w-full flex-col justify-between gap-3 p-5 text-left transition sm:flex-row sm:items-center sm:p-6 ${
            assetListOpen
              ? 'border-b border-emerald-100/80 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-950/20'
              : 'hover:bg-emerald-50/40 dark:hover:bg-emerald-950/15'
          }`}
        >
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
              <FolderDown className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 pt-0.5">
              <div className="flex items-center gap-2">
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-emerald-600 transition-transform dark:text-emerald-400 ${
                    assetListOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                  aria-hidden
                />
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 tibetan-text">{t('install.directDownloads')}</h3>
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-slate-400 tibetan-text">{t('install.directIntro')}</p>
            </div>
          </div>
          <span className="shrink-0 self-start rounded-full border border-emerald-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 sm:self-center">
            {t('install.typefacesAvailable', { count: allFonts.length })}
          </span>
        </button>

        {assetListOpen && (
        <div className="divide-y divide-emerald-100/80 overflow-x-auto dark:divide-slate-800">
          {allFonts.map((font, index) => {
            const titles = fontCardTitlePair(font, locale);
            return (
            <div
              key={font.id}
              className="flex items-center justify-between gap-4 p-4 transition hover:bg-white/70 dark:hover:bg-slate-800/50 sm:px-6 even:bg-white/50 dark:even:bg-slate-900/30"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 text-base font-bold text-emerald-900 dark:from-emerald-950 dark:to-teal-950 dark:text-emerald-100 ${localeNumeralsClass}`}
                  aria-hidden
                >
                  {formatLocaleNumber(index + 1, locale)}
                </div>
                <div className="min-w-0">
                  <span
                    className={`font-semibold text-gray-900 dark:text-slate-100 text-sm block truncate ${
                      titles.primaryIsTibetan ? 'tibetan-text' : ''
                    }`}
                  >
                    {titles.primary}
                  </span>
                  {titles.secondary ? (
                    <span
                      className={`mt-0.5 block truncate text-sm text-gray-600 dark:text-slate-400 ${
                        !titles.primaryIsTibetan ? 'tibetan-text' : ''
                      }`}
                    >
                      {titles.secondary}
                    </span>
                  ) : null}
                  <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{labelForCategory(font.category)}</span>
                    <span>•</span>
                    <span>{localizeDigitsInString(font.fileSize, locale)}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{localizeDigitsInString(font.filename, locale)}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{t('install.macWindows')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => downloadSingleFont(font)}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-950/60"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('common.downloadTtf')}</span>
              </button>
            </div>
            );
          })}
        </div>
        )}
      </section>
    </div>
    </TabScrollLayout>
  );
};
