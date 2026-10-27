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
  const footerTextClass = `font-app font-semibold text-sm sm:text-base tracking-tight text-gray-900 dark:text-slate-100 whitespace-nowrap ${uiBo}`;
  const footerTextStyle: React.CSSProperties = { lineHeight: 1.35, wordBreak: 'normal' };
  const footerLinkClass = `${footerTextClass} hover:text-blue-600 dark:hover:text-blue-400 transition inline-flex items-center gap-1.5`;

  return (
    <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 sm:py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/logos/bodyig.svg"
              alt=""
              className="w-9 h-9 shrink-0"
              width={36}
              height={36}
            />
            <p className={footerTextClass} style={footerTextStyle}>
              {siteTitle}
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:justify-center">
            <li>
              <a
                href="https://github.com/MonlamAI/Monlam-font-playground-2026"
                target="_blank"
                rel="noreferrer"
                className={footerLinkClass}
                style={footerTextStyle}
              >
                <Github className="w-4 h-4 shrink-0 opacity-80" />
                <span>{t('footer.github')}</span>
              </a>
            </li>
            <li>
              <Link to="/licence" className={footerLinkClass} style={footerTextStyle}>
                <Scale className="w-4 h-4 shrink-0 opacity-80" />
                <span>{t('footer.licence')}</span>
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2.5 lg:justify-end shrink-0 min-w-0">
            <img src="/logos/monlam.svg" alt="" className="w-9 h-9 shrink-0" width={36} height={36} />
            <span className={footerTextClass} style={footerTextStyle}>
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
