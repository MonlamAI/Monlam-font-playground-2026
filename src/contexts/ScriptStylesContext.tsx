import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useScriptStyles } from '../hooks/useScriptStyles';
import { useI18n } from '../i18n/I18nProvider';
import { fontCategoryLabel } from '../utils/fontDisplay';
import type { ScriptStyleAsset } from '../types/cms';

type ScriptStylesContextValue = {
  styles: ScriptStyleAsset[];
  loading: boolean;
  /** Localized label for a font's `category` id */
  labelForCategory: (categoryId: string) => string;
  styleById: (id: string) => ScriptStyleAsset | undefined;
};

const ScriptStylesContext = createContext<ScriptStylesContextValue | null>(null);

export function ScriptStylesProvider({ children }: { children: React.ReactNode }) {
  const { styles, loading } = useScriptStyles();
  const { t, locale } = useI18n();

  const styleById = useCallback(
    (id: string) => styles.find((s) => s.id === id),
    [styles]
  );

  const labelForCategory = useCallback(
    (categoryId: string) => {
      const style = styles.find((s) => s.id === categoryId);
      if (style) {
        const primary = locale === 'bo' ? style.tibetanName || style.name : style.name;
        const secondary = locale === 'bo' ? style.name : style.tibetanName;
        if (secondary?.trim() && secondary.trim() !== primary.trim()) {
          return `${primary} · ${secondary.trim()}`;
        }
        return primary;
      }
      return fontCategoryLabel(categoryId, t);
    },
    [styles, locale, t]
  );

  const value = useMemo(
    () => ({ styles, loading, labelForCategory, styleById }),
    [styles, loading, labelForCategory, styleById]
  );

  return <ScriptStylesContext.Provider value={value}>{children}</ScriptStylesContext.Provider>;
}

export function useScriptStylesContext() {
  const ctx = useContext(ScriptStylesContext);
  if (!ctx) {
    throw new Error('useScriptStylesContext must be used within ScriptStylesProvider');
  }
  return ctx;
}

/** Safe when provider is optional (e.g. admin). */
export function useScriptStylesContextOptional() {
  return useContext(ScriptStylesContext);
}
