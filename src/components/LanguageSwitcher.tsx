import React from 'react';
import { Languages } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import type { AppLocale } from '../i18n/localeStorage';

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useI18n();

  const pick = (next: AppLocale) => {
    if (next !== locale) setLocale(next);
  };

  return (
    <div
      className="flex items-center rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5 shadow-sm"
      role="group"
      aria-label={t('lang.label')}
    >
      <button
        type="button"
        onClick={() => pick('bo')}
        aria-pressed={locale === 'bo'}
        title={t('lang.switchToBo')}
        className={`px-2 py-1 rounded-md text-[11px] font-semibold transition tibetan-text ${
          locale === 'bo'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
        }`}
      >
        {t('lang.bo')}
      </button>
      <button
        type="button"
        onClick={() => pick('en')}
        aria-pressed={locale === 'en'}
        title={t('lang.switchToEn')}
        className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
          locale === 'en'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
        }`}
      >
        {t('lang.en')}
      </button>
      <span className="sr-only">{t('lang.label')}</span>
      <Languages className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 mx-1 hidden sm:block" aria-hidden />
    </div>
  );
};
