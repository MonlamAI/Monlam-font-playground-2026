import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'bo' ? 'en' : 'bo');
  };

  const currentLabel = locale === 'bo' ? t('lang.bo') : t('lang.en');
  const switchHint = locale === 'bo' ? t('lang.switchToEn') : t('lang.switchToBo');

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={switchHint}
      title={switchHint}
      className="inline-flex items-center gap-2 rounded-lg px-1.5 py-1.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition active:scale-[0.98]"
    >
      <Globe className="w-4 h-4 shrink-0" strokeWidth={1.75} />
      <span className={locale === 'bo' ? 'tibetan-text' : ''}>{currentLabel}</span>
    </button>
  );
};
