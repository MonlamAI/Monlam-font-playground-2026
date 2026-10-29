import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Scale } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { uiTibetanClass } from '../utils/fontDisplay';
import { formatLocaleNumber, localeNumeralsClass } from '../utils/localeNumber';

const footerIconBtnClass =
  'inline-flex items-center justify-center w-11 h-11 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-800/80 text-gray-700 dark:text-slate-200 shadow-sm hover:bg-white dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition shrink-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40';

export const AppFooter: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t, locale } = useI18n();
  const year = new Date().getFullYear();
  const uiBo = uiTibetanClass(locale, true);
  const footerTextClass = `font-app font-semibold text-sm lg:text-base tracking-tight text-gray-900 dark:text-slate-100 ${uiBo}`;
  const footerTextStyle: React.CSSProperties = { lineHeight: 1.55, wordBreak: 'normal' };
  const footerLinkClass = `${footerTextClass} hover:text-blue-600 dark:hover:text-blue-400 transition inline-flex items-center gap-2 min-w-0`;

  return (
    <footer
      className={`shrink-0 border-t border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-[0_-1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.04)] pb-[max(0.75rem,env(safe-area-inset-bottom))] ${className}`.trim()}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        {/* GitHub · Licence (center) · copyright */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 py-3.5 sm:py-4 lg:py-5 min-h-[3.25rem] lg:min-h-0">
          <a
            href="https://github.com/MonlamAI/Monlam-font-playground-2026"
            target="_blank"
            rel="noreferrer"
            className={`${footerIconBtnClass} justify-self-start lg:hidden`}
            aria-label={t('footer.github')}
          >
            <Github className="w-5 h-5 shrink-0" strokeWidth={1.75} />
          </a>
          <a
            href="https://github.com/MonlamAI/Monlam-font-playground-2026"
            target="_blank"
            rel="noreferrer"
            className={`${footerLinkClass} justify-self-start hidden lg:inline-flex`}
            style={footerTextStyle}
          >
            <Github className="w-4 h-4 shrink-0 opacity-80" />
            <span className="whitespace-nowrap">{t('footer.github')}</span>
          </a>

          <Link
            to="/licence"
            className={`${footerIconBtnClass} justify-self-center lg:hidden`}
            aria-label={t('footer.licence')}
          >
            <Scale className="w-5 h-5 shrink-0" strokeWidth={1.75} />
          </Link>
          <Link
            to="/licence"
            className={`${footerLinkClass} justify-self-center hidden lg:inline-flex`}
            style={footerTextStyle}
          >
            <Scale className="w-4 h-4 shrink-0 opacity-80" />
            <span className="whitespace-nowrap">{t('footer.licence')}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-2.5 min-w-0 justify-self-end col-start-3">
            <img src="/logos/monlam.svg" alt="" className="w-9 h-9 shrink-0" width={36} height={36} />
            <span className={`${footerTextClass} min-w-0 text-right`} style={footerTextStyle}>
              ©{' '}
              <span className={localeNumeralsClass}>{formatLocaleNumber(year, locale)}</span>{' '}
              <span className="whitespace-normal">{t('footer.copyrightHolder')}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
