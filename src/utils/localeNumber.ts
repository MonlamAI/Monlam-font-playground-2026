import type { AppLocale } from '../i18n/localeStorage';

const TIBETAN_DIGITS = ['༠', '༡', '༢', '༣', '༤', '༥', '༦', '༧', '༨', '༩'] as const;

/** Replace ASCII digits 0–9 in any string (e.g. "1.9x", "36px", "v2.0"). */
export function localizeDigitsInString(text: string, locale: AppLocale): string {
  if (locale !== 'bo') return text;
  return text.replace(/[0-9]/g, (d) => TIBETAN_DIGITS[Number(d)] ?? d);
}

/** Format integers with Arabic digits (en) or Tibetan digits (bo). */
export function formatLocaleNumber(value: number, locale: AppLocale): string {
  const sign = value < 0 ? '-' : '';
  const digits = String(Math.trunc(Math.abs(value)));
  if (locale !== 'bo') return sign + digits;
  return sign + localizeDigitsInString(digits, locale);
}

/** Decimal display (e.g. line height 1.9). */
export function formatLocaleDecimal(value: number, locale: AppLocale, fractionDigits = 1): string {
  return localizeDigitsInString(value.toFixed(fractionDigits), locale);
}

/** Common UI suffixes: `36px`, `1.9x`. */
export function formatLocalePx(value: number, locale: AppLocale): string {
  return `${formatLocaleNumber(value, locale)}px`;
}

export function formatLocaleMultiplier(value: number, locale: AppLocale, fractionDigits = 1): string {
  return `${formatLocaleDecimal(value, locale, fractionDigits)}x`;
}

/** For i18n `t()` interpolation — numbers become Tibetan digits when locale is bo. */
export function formatTranslationParam(value: string | number, locale: AppLocale): string {
  return localizeDigitsInString(String(value), locale);
}

/** Tailwind classes for readable Tibetan/Arabic digits in controls (chips, badges, sliders). */
export const localeNumeralsClass = 'locale-numerals tabular-nums';
