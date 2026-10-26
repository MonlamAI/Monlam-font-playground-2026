import type { AppLocale } from '../i18n/localeStorage';

const TIBETAN_DIGITS = ['༠', '༡', '༢', '༣', '༤', '༥', '༦', '༧', '༨', '༩'] as const;

/** Format integers with Arabic digits (en) or Tibetan digits (bo). */
export function formatLocaleNumber(value: number, locale: AppLocale): string {
  const digits = String(Math.trunc(Math.abs(value)));
  if (locale !== 'bo') return digits;
  return digits.replace(/\d/g, (d) => TIBETAN_DIGITS[Number(d)] ?? d);
}
