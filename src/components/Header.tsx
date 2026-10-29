import React from 'react';
import {
  Type,
  GitCompare,
  Keyboard,
  Gamepad2,
  BookOpen,
  Download,
  ShoppingBag,
  Sun,
  Moon,
  MessageSquarePlus
} from 'lucide-react';
import { FontItem } from '../types/font';
import { useTheme } from '../hooks/useTheme';
import {
  FEATURE_TYPING_PRACTICE,
  FEATURE_TYPING_QUEST,
  FEATURE_TYPOGRAPHY_GUIDE
} from '../config/features';
import { useI18n } from '../i18n/I18nProvider';
import { uiTibetanClass } from '../utils/fontDisplay';
import { formatLocaleNumber, localeNumeralsClass } from '../utils/localeNumber';
import { LanguageSwitcher } from './LanguageSwitcher';
import { HeaderUtilityMenu } from './HeaderUtilityMenu';

export type AppTab = 'catalog' | 'compare' | 'typing' | 'quest' | 'guide' | 'install';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedFonts: FontItem[];
  setIsDrawerOpen: (open: boolean) => void;
  onOpenFeedback: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedFonts,
  setIsDrawerOpen,
  onOpenFeedback
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { t, locale } = useI18n();
  const headerRef = React.useRef<HTMLElement>(null);
  const siteTitle = locale === 'bo' ? t('site.titleTibetan') : t('site.titleEnglish');
  const uiBo = uiTibetanClass(locale, true);

  React.useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty('--site-header-h', `${el.offsetHeight}px`);
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(el);
    window.addEventListener('resize', syncHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [activeTab]);

  return (
    <header
      ref={headerRef}
      className="z-50 shrink-0 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 transition-colors"
    >
      <div className="w-full px-3 sm:px-4 lg:px-5">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-h-[4.25rem] py-2.5">
          {/* Logo / Brand */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 xl:flex-none xl:max-w-[16rem] 2xl:max-w-[20rem] cursor-pointer"
            onClick={() => setActiveTab('catalog')}
            role="link"
            aria-label={t('global.home')}
          >
            <img
              src="/logos/bodyig.svg"
              alt=""
              className="w-9 h-9 shrink-0"
              width={36}
              height={36}
            />
            <div className="min-w-0 flex-1 xl:flex-initial">
              <p
                className={`font-app font-semibold text-sm sm:text-base lg:text-lg tracking-tight text-gray-900 dark:text-slate-100 line-clamp-2 xl:line-clamp-none xl:whitespace-nowrap leading-snug ${uiBo}`}
              >
                {siteTitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Google Fonts style */}
          <nav className="hidden xl:flex flex-1 items-center justify-center flex-nowrap gap-0.5 2xl:gap-1 min-w-0 overflow-x-auto scrollbar-none px-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex shrink-0 items-center gap-1.5 px-2 lg:px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Type className="w-4 h-4" />
              <span className={uiBo}>{t('nav.typefaces')}</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex shrink-0 items-center gap-1.5 px-2 lg:px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'compare'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span className={uiBo}>{t('nav.compare')}</span>
            </button>

            {FEATURE_TYPING_PRACTICE ? (
              <button
                onClick={() => setActiveTab('typing')}
                className={`flex shrink-0 items-center gap-1.5 px-2 lg:px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === 'typing'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Keyboard className="w-4 h-4" />
                <span className={uiBo}>{t('nav.typing')}</span>
              </button>
            ) : null}

            {FEATURE_TYPING_QUEST ? (
              <button
                onClick={() => setActiveTab('quest')}
                className={`flex shrink-0 items-center gap-1.5 px-2 lg:px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === 'quest'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span className={uiBo}>{t('nav.quest')}</span>
              </button>
            ) : null}

            {FEATURE_TYPOGRAPHY_GUIDE ? (
              <button
                onClick={() => setActiveTab('guide')}
                className={`flex shrink-0 items-center gap-1.5 px-2 lg:px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className={uiBo}>{t('nav.guide')}</span>
              </button>
            ) : null}

            <button
              onClick={() => setActiveTab('install')}
              className={`flex shrink-0 items-center gap-1.5 px-2 lg:px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'install'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span className={uiBo}>{t('nav.install')}</span>
            </button>
          </nav>

          {/* Quick Actions — theme, feedback, Selected CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto xl:ml-0">
            <div className="hidden xl:flex items-center gap-1">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? t('theme.toLight') : t('theme.toDark')}
                className="group relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 shadow-sm transition active:scale-95"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span
                  role="tooltip"
                  className="pointer-events-none absolute top-full left-1/2 z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-none group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900"
                >
                  {isDark ? t('theme.toLight') : t('theme.toDark')}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenFeedback}
                aria-label={t('nav.feedback')}
                className="group relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 shadow-sm transition active:scale-95"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span
                  role="tooltip"
                  className="pointer-events-none absolute top-full left-1/2 z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-none group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900"
                >
                  {t('nav.feedback')}
                </span>
              </button>
            </div>

            <div className="hidden xl:block">
              <LanguageSwitcher />
            </div>

            <HeaderUtilityMenu
              isDark={isDark}
              onToggleTheme={toggleTheme}
              onOpenFeedback={onOpenFeedback}
            />

            {/* Selected Fonts Drawer Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex shrink-0 items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 min-h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium shadow-sm transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className={`hidden xl:inline whitespace-nowrap ${uiBo}`}>{t('cart.label')}</span>
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-0.5 text-xs font-bold text-blue-800 ${localeNumeralsClass}`}
              >
                {formatLocaleNumber(selectedFonts.length, locale)}
              </span>
            </button>
          </div>
        </div>

        {/* Phone & tablet (incl. iPad Pro 1024px): icon tabs; full text nav from xl (1280px)+ */}
        <nav
          aria-label={t('global.tools')}
          className="xl:hidden flex w-full items-stretch justify-between gap-1 px-0 py-2 border-t border-gray-100 dark:border-slate-800"
        >
          {(
            [
              { tab: 'catalog' as const, Icon: Type, label: t('nav.typefaces') },
              { tab: 'compare' as const, Icon: GitCompare, label: t('nav.compare') },
              ...(FEATURE_TYPING_PRACTICE
                ? [{ tab: 'typing' as const, Icon: Keyboard, label: t('nav.typing') }]
                : []),
              ...(FEATURE_TYPING_QUEST
                ? [{ tab: 'quest' as const, Icon: Gamepad2, label: t('nav.quest') }]
                : []),
              ...(FEATURE_TYPOGRAPHY_GUIDE
                ? [{ tab: 'guide' as const, Icon: BookOpen, label: t('nav.guide') }]
                : []),
              { tab: 'install' as const, Icon: Download, label: t('nav.install') }
            ] as const
          ).map(({ tab, Icon, label }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                title={label}
                className={`flex flex-1 items-center justify-center min-w-0 rounded-lg p-2.5 min-h-10 transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden />
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
