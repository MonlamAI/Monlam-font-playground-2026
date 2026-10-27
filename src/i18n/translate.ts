import type { AppLocale } from './localeStorage';
import { formatTranslationParam } from '../utils/localeNumber';
import en from './messages/en';
import boOverrides from './messages/bo.json';
import { deepMerge } from './deepMerge';
import type { MessageTree } from './messages/en';

const boMessages = deepMerge(JSON.parse(JSON.stringify(en)) as MessageTree, boOverrides as Partial<MessageTree>);

export const messages: Record<AppLocale, MessageTree> = {
  en,
  bo: boMessages
};

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function translate(
  locale: AppLocale,
  key: string,
  params?: Record<string, string | number>
): string {
  let text: unknown = getPath(messages[locale] as unknown as Record<string, unknown>, key);
  if (typeof text !== 'string') {
    text = getPath(messages.en as unknown as Record<string, unknown>, key);
  }
  if (typeof text !== 'string') return key;
  let resolved = text;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      const rendered = formatTranslationParam(v, locale);
      resolved = (resolved as string).replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), rendered);
    }
  }
  return resolved as string;
}
