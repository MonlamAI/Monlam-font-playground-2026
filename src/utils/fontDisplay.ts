import type { AppLocale } from '../i18n/localeStorage';
import type { FontCategory } from '../types/font';

/** User-facing label: Tibetan primary, English in parentheses */
export function fontAssetLabel(font: { name: string; tibetanName: string }): string {
  return `${font.tibetanName} (${font.name})`;
}

export type LocaleTitlePair = {
  primary: string;
  secondary: string;
  primaryIsTibetan: boolean;
};

/** English + Tibetan lines; order follows UI locale. */
export function localeBilingualPair(
  english: string,
  tibetan: string | undefined,
  locale: AppLocale
): LocaleTitlePair {
  const tb = (tibetan?.trim() || english).trim();
  const en = english.trim();
  if (locale === 'bo') {
    return { primary: tb, secondary: en, primaryIsTibetan: true };
  }
  return { primary: en, secondary: tb, primaryIsTibetan: false };
}

/** Card heading + subheading order follows UI locale. */
export function fontCardTitlePair(
  font: { name: string; tibetanName: string },
  locale: AppLocale
): LocaleTitlePair {
  return localeBilingualPair(font.name, font.tibetanName, locale);
}

const CATEGORY_I18N: Record<FontCategory, string> = {
  All: 'filters.categoryAll',
  Uchen: 'filters.categoryUchen',
  'Umê': 'filters.categoryUme',
  Drutsa: 'filters.categoryDrutsa',
  Tsugring: 'filters.categoryTsugring',
  Petsug: 'filters.categoryPetsug',
  Modern: 'filters.categoryModern',
  Standard: 'filters.categoryStandard'
};

/** Localized script-style badge (e.g. Uchen → དབུ་ཅན). */
export function fontCategoryLabel(
  category: string,
  t: (key: string) => string
): string {
  const key = CATEGORY_I18N[category as FontCategory];
  return key ? t(key) : category;
}

const STROKE_CONTRAST_KEYS: Record<string, string> = {
  High: 'compare.metricValueContrastHigh',
  Medium: 'compare.metricValueContrastMedium',
  Low: 'compare.metricValueContrastLow'
};

const STROKE_TYPE_KEYS: Record<string, string> = {
  Calligraphic: 'compare.metricValueCalligraphic',
  Cursive: 'compare.metricValueCursive',
  Chiseled: 'compare.metricValueChiseled'
};

/** Localized stroke contrast / type labels from catalog metric strings. */
export function fontMetricLabel(
  kind: 'strokeContrast' | 'strokeType',
  value: string,
  t: (key: string) => string
): string {
  if (kind === 'strokeContrast') {
    const key = STROKE_CONTRAST_KEYS[value];
    return key ? t(key) : value;
  }
  const first = value.split(' ')[0] ?? value;
  const key = STROKE_TYPE_KEYS[first];
  if (key) return t(key);
  return first;
}
