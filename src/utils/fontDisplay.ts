import type { AppLocale } from '../i18n/localeStorage';
import type { FontCategory, FontItem } from '../types/font';

const LOOSE_LEADING_CATEGORY = /ume|umê|drutsa|tsugring|petsug/i;

/** Catalog card previews: honor the slider but never crush cursive / tall metrics. */
export function catalogPreviewLineHeight(font: FontItem, lineHeight: number): number {
  const stroke = font.metrics?.strokeType;
  const loose =
    LOOSE_LEADING_CATEGORY.test(font.category) ||
    stroke === 'Cursive Pen' ||
    stroke === 'Calligraphic Reed Pen';
  const floor = loose ? 2.15 : 1.85;
  return Math.max(lineHeight, floor);
}

/** Single string for the active UI locale (English or Tibetan only). */
export function localePick(english: string, tibetan: string | undefined, locale: AppLocale): string {
  const en = english.trim();
  const tb = (tibetan?.trim() || en).trim();
  return locale === 'bo' ? tb : en;
}

/** CSS classes for UI chrome that shows Tibetan script. */
export function uiTibetanClass(locale: AppLocale, dense = false): string {
  if (locale !== 'bo') return '';
  return dense ? 'tibetan-text tibetan-text-ui' : 'tibetan-text';
}

export type LocaleTitlePair = {
  primary: string;
  secondary: string;
  primaryIsTibetan: boolean;
};

/** Card / list titles: one line per locale (`secondary` is empty). */
export function localeBilingualPair(
  english: string,
  tibetan: string | undefined,
  locale: AppLocale
): LocaleTitlePair {
  if (locale === 'bo') {
    const primary = (tibetan?.trim() || english).trim();
    return { primary, secondary: '', primaryIsTibetan: true };
  }
  const primary = english.trim();
  return { primary, secondary: '', primaryIsTibetan: false };
}

/** Card heading order follows UI locale (single line). */
export function fontCardTitlePair(
  font: { name: string; tibetanName: string },
  locale: AppLocale
): LocaleTitlePair {
  return localeBilingualPair(font.name, font.tibetanName, locale);
}

/** Select options, cart rows, compare pickers — locale-only label. */
export function fontAssetLabel(
  font: { name: string; tibetanName: string },
  locale: AppLocale
): string {
  return localePick(font.name, font.tibetanName, locale);
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
