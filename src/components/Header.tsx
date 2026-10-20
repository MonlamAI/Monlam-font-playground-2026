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
import { FEATURE_TYPING_QUEST, FEATURE_TYPOGRAPHY_GUIDE } from '../config/features';
import { useI18n } from '../i18n/I18nProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

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
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors">
      <div className="w-full px-3 sm:px-4 lg:px-5">
        <div className="flex items-center gap-3 lg:gap-4 min-h-16 py-2">
          {/* Logo / Brand — leftmost, never shrinks or truncates */}
          <div
            className="flex items-center gap-2.5 shrink-0 cursor-pointer"
            onClick={() => setActiveTab('catalog')}
          >
            <img
              src="/logos/bodyig.svg"
              alt=""
              className="w-9 h-9 shrink-0"
              width={36}
              height={36}
            />
            <div className="leading-none min-w-0">
              <p
                className="tibetan-text font-monlam-ouchan-1 font-semibold text-base sm:text-lg tracking-tight text-gray-900 dark:text-slate-100 whitespace-nowrap"
                style={{ lineHeight: 1.35, wordBreak: 'normal' }}
              >
                {t('site.titleTibetan')}
              </p>
              <div className="flex items-center gap-1.5 mt-1 whitespace-nowrap">
                <span className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-slate-400 tracking-tight">
                  {t('site.titleEnglish')}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200 rounded-full border border-amber-200/60 dark:border-amber-800/60 tibetan-text">
                  {t('site.badgePlayground')}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Google Fonts style */}
          <nav className="hidden md:flex flex-1 items-center justify-center flex-wrap gap-0.5 lg:gap-1 min-w-0">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>{t('nav.typefaces')}</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'compare'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>{t('nav.compare')}</span>
            </button>

            <button
              onClick={() => setActiveTab('typing')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'typing'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>{t('nav.typing')}</span>
            </button>

            {FEATURE_TYPING_QUEST ? (
              <button
                onClick={() => setActiveTab('quest')}
                className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === 'quest'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{t('nav.quest')}</span>
              </button>
            ) : null}

            {FEATURE_TYPOGRAPHY_GUIDE ? (
              <button
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('nav.guide')}</span>
              </button>
            ) : null}

            <button
              onClick={() => setActiveTab('install')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'install'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{t('nav.install')}</span>
            </button>
          </nav>

          {/* Quick Actions — theme, feedback, Selected CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto md:ml-0">
            <div className="flex items-center gap-1">
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

            <LanguageSwitcher />

            {/* Selected Fonts Drawer Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium shadow-sm transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline tibetan-text">{t('cart.label')}</span>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-blue-700 text-xs font-bold">
                {selectedFonts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center overflow-x-auto py-2 space-x-2 border-t border-gray-100 dark:border-slate-800 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 whitespace-nowrap rounded-md ${
              activeTab === 'catalog'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t('nav.typefaces')}
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 whitespace-nowrap rounded-md ${
              activeTab === 'compare'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t('nav.compare')}
          </button>
          <button
            onClick={() => setActiveTab('typing')}
            className={`px-3 py-1.5 whitespace-nowrap rounded-md ${
              activeTab === 'typing'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t('nav.typingMobile')}
          </button>
          {FEATURE_TYPING_QUEST ? (
            <button
              onClick={() => setActiveTab('quest')}
              className={`px-3 py-1.5 whitespace-nowrap rounded-md ${
                activeTab === 'quest'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t('nav.quest')}
            </button>
          ) : null}
          {FEATURE_TYPOGRAPHY_GUIDE ? (
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 whitespace-nowrap rounded-md ${
                activeTab === 'guide'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t('nav.guide')}
            </button>
          ) : null}
          <button
            onClick={() => setActiveTab('install')}
            className={`px-3 py-1.5 whitespace-nowrap rounded-md ${
              activeTab === 'install'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t('nav.install')}
          </button>
          <button
            onClick={onOpenFeedback}
            className="px-3 py-1.5 whitespace-nowrap rounded-md bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 inline-flex items-center gap-1"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            {t('nav.feedback')}
          </button>
        </div>
      </div>
    </header>
  );
};
