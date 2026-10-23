import React from 'react';
import {
  Download,
  Laptop,
  Apple,
  Smartphone,
  Sparkles,
  ExternalLink,
  FileArchive,
  ChevronDown
} from 'lucide-react';
import { FontItem } from '../types/font';
import { downloadSingleFont } from '../utils/fontDownloader';
import {
  BODYIG_SUITE,
  OFFICIAL_BODYIG_DOWNLOADS,
  OFFICIAL_KEYBOARD_DOWNLOADS,
  openOfficialDownload
} from '../data/officialDownloads';
import { InstallStep, InstallStepsCarousel } from './InstallStepsCarousel';
import { useI18n } from '../i18n/I18nProvider';
import { fontCardTitlePair, fontCategoryLabel } from '../utils/fontDisplay';

const stepBadge = (n: number) => (
  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">{n}</div>
);

interface InstallGuideProps {
  allFonts: FontItem[];
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ allFonts }) => {
  const { t, locale } = useI18n();
  const [activeOs, setActiveOs] = React.useState<'windows' | 'mac'>('windows');
  const [assetListOpen, setAssetListOpen] = React.useState(false);

  const macDownload = OFFICIAL_BODYIG_DOWNLOADS.find((d) => d.platform === 'mac')!;
  const winDownload = OFFICIAL_BODYIG_DOWNLOADS.find((d) => d.platform === 'windows')!;
  const winKeyboard = OFFICIAL_KEYBOARD_DOWNLOADS.find((d) => d.id === 'bodyig-keyboard-win-2025');
  const iosKeyboard = OFFICIAL_KEYBOARD_DOWNLOADS.find((d) => d.platform === 'ios');

  const windowsSteps: InstallStep[] = [
    {
      badge: stepBadge(1),
      title: t('install.steps.win1Title'),
      body: <p className="tibetan-text">{t('install.steps.win1Body')}</p>
    },
    {
      badge: stepBadge(2),
      title: t('install.steps.win2Title'),
      body: <p className="tibetan-text">{t('install.steps.win2Body')}</p>
    },
    {
      badge: stepBadge(3),
      title: t('install.steps.win3Title'),
      body: <p className="tibetan-text">{t('install.steps.win3Body')}</p>
    }
  ];

  const macSteps: InstallStep[] = [
    {
      badge: stepBadge(1),
      title: t('install.steps.mac1Title'),
      body: <p className="tibetan-text">{t('install.steps.mac1Body')}</p>
    },
    {
      badge: stepBadge(2),
      title: t('install.steps.mac2Title'),
      body: <p className="tibetan-text">{t('install.steps.mac2Body')}</p>
    },
    {
      badge: stepBadge(3),
      title: t('install.steps.mac3Title'),
      body: <p className="tibetan-text">{t('install.steps.mac3Body')}</p>
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Hero Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <img
            src="/logos/bodyig.svg"
            alt="Monlam Bodyig"
            className="w-9 h-9 shrink-0"
            width={36}
            height={36}
          />
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 tibetan-text">{t('install.pageTitle')}</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 max-w-3xl tibetan-text">{t('install.pageIntro')}</p>
      </div>

      {/* DOWNLOAD PACKAGES SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Official Font & Keyboard Suite (Mac / Windows) */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-blue-800/50 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-slate-950 mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('install.suiteBadge')}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {BODYIG_SUITE.name} {BODYIG_SUITE.version}
            </h3>
            <p className="text-sm tibetan-text text-blue-200/90 mt-1">{BODYIG_SUITE.tibetanName}</p>
            <p className="text-sm text-blue-200/90 mt-2 leading-relaxed tibetan-text">{t('install.suiteDescription')}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-blue-200">
              <span className="bg-white/10 px-2.5 py-1 rounded-md">✓ {t('install.fullTypefaceSet')}</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-md">✓ {t('install.keyboardInstallers')}</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-md">✓ {t('install.macAndWindows')}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <p className="text-xs text-blue-200/80 font-medium">{t('install.selectOs')}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => openOfficialDownload(macDownload.url)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-blue-50 font-semibold text-sm transition active:scale-95 shadow-md"
              >
                <Apple className="w-4 h-4" />
                <span className="tibetan-text">{t('install.downloadMac')}</span>
              </button>
              <button
                type="button"
                onClick={() => openOfficialDownload(winDownload.url)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition active:scale-95 shadow-md"
              >
                <Laptop className="w-4 h-4" />
                <span className="tibetan-text">{t('install.downloadWin')}</span>
              </button>
            </div>
            <a
              href={BODYIG_SUITE.sourcePage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t('install.sourceLink')}</span>
            </a>
          </div>
        </div>

        {/* Card 2: Individual / selected assets guidance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200 dark:border-blue-800">
              <FileArchive className="w-3.5 h-3.5" />
              <span>{t('install.assetsBadge')}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
              {t('install.assetsTitle')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed tibetan-text">{t('install.assetsIntro')}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-slate-400 tibetan-text">
              <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                {t('install.typefacesListed', { count: allFonts.length })}
              </span>
              <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">{t('install.selectedOnlyZip')}</span>
              <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">{t('install.crossPlatformTtf')}</span>
            </div>

            {(winKeyboard || iosKeyboard) && (
              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 tibetan-text">{t('install.keyboardExtras')}</p>
                <div className="flex flex-wrap gap-2">
                  {winKeyboard && (
                    <button
                      type="button"
                      onClick={() => openOfficialDownload(winKeyboard.url)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span className="tibetan-text">{t('install.downloadKeyboardWin')}</span>
                    </button>
                  )}
                  {iosKeyboard && (
                    <a
                      href={iosKeyboard.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="tibetan-text">{t('install.downloadIosStore')}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400">
            <span className="tibetan-text">{t('install.assetsFooter')}</span>
          </div>
        </div>
      </div>

      {/* OS STEP-BY-STEP INSTALLATION GUIDES */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 tibetan-text">{t('install.stepsTitle')}</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 tibetan-text">{t('install.stepsIntro')}</p>
          </div>

          {/* OS Switcher */}
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
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

        {activeOs === 'windows' && <InstallStepsCarousel steps={windowsSteps} resetKey="windows" />}
        {activeOs === 'mac' && <InstallStepsCarousel steps={macSteps} resetKey="mac" />}
      </div>

      {/* INDIVIDUAL FONT ASSET DIRECT DOWNLOAD TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setAssetListOpen((open) => !open)}
          aria-expanded={assetListOpen}
          className={`w-full p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left transition hover:bg-gray-50/80 dark:hover:bg-slate-800/40 ${
            assetListOpen ? 'border-b border-gray-100 dark:border-slate-800' : ''
          }`}
        >
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <ChevronDown
              className={`w-5 h-5 shrink-0 text-gray-400 dark:text-slate-500 transition-transform mt-0.5 ${
                assetListOpen ? 'rotate-0' : '-rotate-90'
              }`}
              aria-hidden
            />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-slate-100 text-base tibetan-text">{t('install.directDownloads')}</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 tibetan-text">{t('install.directIntro')}</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full self-start sm:self-center shrink-0">
            {t('install.typefacesAvailable', { count: allFonts.length })}
          </span>
        </button>

        {assetListOpen && (
        <div className="divide-y divide-gray-100 dark:divide-slate-800 overflow-x-auto">
          {allFonts.map((font) => {
            const titles = fontCardTitlePair(font, locale);
            return (
            <div
              key={font.id}
              className="p-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-bold text-gray-700 dark:text-slate-300 text-lg tibetan-text">
                  {font.sampleText.charAt(0)}
                </div>
                <div className="min-w-0">
                  <span
                    className={`font-semibold text-gray-900 dark:text-slate-100 text-sm block truncate ${
                      titles.primaryIsTibetan ? 'tibetan-text' : ''
                    }`}
                  >
                    {titles.primary}
                  </span>
                  <span
                    className={`text-sm text-gray-600 dark:text-slate-400 block truncate mt-0.5 ${
                      !titles.primaryIsTibetan ? 'tibetan-text' : ''
                    }`}
                  >
                    {titles.secondary}
                  </span>
                  <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{fontCategoryLabel(font.category, t)}</span>
                    <span>•</span>
                    <span>{font.fileSize}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{font.filename}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{t('install.macWindows')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => downloadSingleFont(font)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-950/70 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('common.downloadTtf')}</span>
              </button>
            </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
};
