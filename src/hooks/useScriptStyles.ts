import { useEffect, useState } from 'react';
import { DEFAULT_SCRIPT_STYLES } from '../data/scriptStyles';
import { publicApi } from '../admin/api';
import type { ScriptStyleAsset } from '../types/cms';

function seedToAsset(s: (typeof DEFAULT_SCRIPT_STYLES)[number]): ScriptStyleAsset {
  const now = new Date(0).toISOString();
  return {
    id: s.id,
    name: s.name,
    tibetanName: s.tibetanName,
    sortOrder: s.sortOrder,
    createdAt: now,
    updatedAt: now
  };
}

/** Published script styles from CMS; falls back to static defaults. */
export function useScriptStyles() {
  const [styles, setStyles] = useState<ScriptStyleAsset[]>(
    DEFAULT_SCRIPT_STYLES.map(seedToAsset)
  );
  const [source, setSource] = useState<'api' | 'seed'>('seed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicApi
      .scriptStyles()
      .then((rows) => {
        if (cancelled) return;
        if (rows.length > 0) {
          setStyles(rows);
          setSource('api');
        }
      })
      .catch(() => {
        if (!cancelled) setSource('seed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { styles, source, loading };
}
