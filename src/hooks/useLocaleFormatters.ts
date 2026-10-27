import React from 'react';
import { useI18n } from '../i18n/I18nProvider';
import {
  formatLocaleDecimal,
  formatLocaleMultiplier,
  formatLocaleNumber,
  formatLocalePx,
  localizeDigitsInString,
  localeNumeralsClass
} from '../utils/localeNumber';

/** Locale-aware number formatting for UI (Tibetan ༡༢༣ when locale is bo). */
export function useLocaleFormatters() {
  const { locale } = useI18n();

  return React.useMemo(
    () => ({
      locale,
      n: (value: number) => formatLocaleNumber(value, locale),
      digits: (text: string | number) => localizeDigitsInString(String(text), locale),
      px: (value: number) => formatLocalePx(value, locale),
      mult: (value: number, fractionDigits = 1) => formatLocaleMultiplier(value, locale, fractionDigits),
      dec: (value: number, fractionDigits = 1) => formatLocaleDecimal(value, locale, fractionDigits),
      pct: (value: number) => `${localizeDigitsInString(String(value), locale)}%`,
      numeralsClass: localeNumeralsClass
    }),
    [locale]
  );
}
