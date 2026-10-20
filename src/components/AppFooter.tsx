import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, Github, Scale } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { FEATURE_TYPING_QUEST, FEATURE_TYPOGRAPHY_GUIDE } from '../config/features';
import type { AppTab } from './Header';

interface AppFooterProps {
  onNavigate: (tab: AppTab) => void;
  onOpenFeedback: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onNavigate, onOpenFeedback }) => {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-gray-500 dark:text-slate-400">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/logos/monlam.svg" alt="" className="w-8 h-8 shrink-0" width={32} height={32} />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-gray-900 dark:text-slate-100 tibetan-text">
                  {t('footer.brand')}
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium tibetan-text">
                  {t('footer.tag')}
                </span>
              </div>
            </div>
            <p className="leading-relaxed text-gray-600 dark:text-slate-400 max-w-md tibetan-text">{t('footer.about')}</p>
            <p className="tibetan-text text-gray-400 dark:text-slate-500 font-monlam-ouchan-1">{t('footer.aboutTibetan')}</p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-gray-800 dark:text-slate-200 uppercase tracking-wider block tibetan-text">
              {t('footer.resources')}
            </span>
            <ul className="space-y-1.5 tibetan-text">
              {FEATURE_TYPOGRAPHY_GUIDE ? (
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('guide')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {t('footer.syllableAnatomy')}
                  </button>
                </li>
              ) : null}
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('typing')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {t('footer.typingPractice')}
                </button>
              </li>
              {FEATURE_TYPING_QUEST ? (
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('quest')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {t('footer.typingQuest')}
                  </button>
                </li>
              ) : null}
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('compare')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {t('footer.comparator')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('install')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {t('footer.setupGuide')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFeedback}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-blue-600 dark:text-blue-400"
                >
                  {t('footer.sendFeedback')}
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-gray-800 dark:text-slate-200 uppercase tracking-wider block tibetan-text">
              {t('footer.links')}
            </span>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://github.com/MonlamAI/Monlam-font-playground-2026"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>{t('footer.github')}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://fonts.google.com/?query=Tibetan"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{t('footer.googleFonts')}</span>
                </a>
              </li>
              <li>
                <Link
                  to="/licence"
                  className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition tibetan-text"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{t('footer.licence')}</span>
                </Link>
              </li>
              <li>
                <span className="text-gray-400 dark:text-slate-500">{t('footer.unicodeBlock')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 dark:text-slate-500 gap-2">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <img src="/logos/monlam-ai.svg" alt="" className="w-4 h-4 opacity-80" width={16} height={16} />
            <span>{t('footer.copyright', { year })}</span>
            <span className="text-gray-300 dark:text-slate-600">·</span>
            <Link to="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              {t('footer.admin')}
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span>{t('footer.madeWith')}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="tibetan-text">{t('footer.forCommunity')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
