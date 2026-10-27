import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Scale } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { uiTibetanClass } from '../utils/fontDisplay';
import { formatLocaleNumber, localeNumeralsClass } from '../utils/localeNumber';

export const AppFooter: React.FC = () => {
  const { t, locale } = useI18n();
  const year = new Date().getFullYear();
  const siteTitle = locale === 'bo' ? t('site.titleTibetan') : t('site.titleEnglish');
  const uiBo = uiTibetanClass(locale, true);

  return (
    <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 sm:py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between text-xs text-gray-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/logos/bodyig.svg"
              alt=""
              className="w-9 h-9 shrink-0"
              width={36}
              height={36}
            />
            <p
              className={`font-app font-semibold text-sm sm:text-base tracking-tight text-gray-900 dark:text-slate-100 whitespace-nowrap ${uiBo}`}
              style={{ lineHeight: 1.35, wordBreak: 'normal' }}
            >
              {siteTitle}
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:justify-center">
            <li>
              <a
                href="https://github.com/MonlamAI/Monlam-font-playground-2026"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 transition"
              >
                <Github className="w-3.5 h-3.5 shrink-0" />
                <span>{t('footer.github')}</span>
              </a>
            </li>
            <li>
              <Link
                to="/licence"
                className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 transition tibetan-text"
              >
                <Scale className="w-3.5 h-3.5 shrink-0" />
                <span>{t('footer.licence')}</span>
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500 lg:justify-end shrink-0">
            <img src="/logos/monlam.svg" alt="" className="w-5 h-5 shrink-0" width={20} height={20} />
            <span className={`text-xs ${uiBo}`}>
              ©{' '}
              <span className={localeNumeralsClass}>{formatLocaleNumber(year, locale)}</span>{' '}
              {t('footer.copyrightHolder')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
