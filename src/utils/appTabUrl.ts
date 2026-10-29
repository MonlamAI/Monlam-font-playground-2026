import type { AppTab } from '../components/Header';
import {
  FEATURE_TYPING_PRACTICE,
  FEATURE_TYPING_QUEST,
  FEATURE_TYPOGRAPHY_GUIDE
} from '../config/features';

const APP_TABS: AppTab[] = ['catalog', 'compare', 'typing', 'quest', 'guide', 'install'];

export function parseAppTabParam(raw: string | null): AppTab {
  if (!raw || !APP_TABS.includes(raw as AppTab)) return 'catalog';
  const tab = raw as AppTab;
  if (tab === 'typing' && !FEATURE_TYPING_PRACTICE) return 'catalog';
  if (tab === 'quest' && !FEATURE_TYPING_QUEST) return 'catalog';
  if (tab === 'guide' && !FEATURE_TYPOGRAPHY_GUIDE) return 'catalog';
  return tab;
}

/** Sync `?tab=` with the active main nav tab (omit param for default Typefaces). */
export function appTabToSearchParams(tab: AppTab, prev: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(prev);
  if (tab === 'catalog') next.delete('tab');
  else next.set('tab', tab);
  return next;
}
