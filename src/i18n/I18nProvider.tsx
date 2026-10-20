import React from 'react';
import {
  AppLocale,
  DEFAULT_LOCALE,
  readStoredLocale,
  writeStoredLocale
} from './localeStorage';
import { translate } from './translate';

type I18nContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = React.useState<AppLocale>(() => readStoredLocale() ?? DEFAULT_LOCALE);

  const setLocale = React.useCallback((next: AppLocale) => {
    setLocaleState(next);
    writeStoredLocale(next);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = locale === 'bo' ? 'bo' : 'en';
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const t = React.useCallback(
    (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale]
  );

  const value = React.useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
