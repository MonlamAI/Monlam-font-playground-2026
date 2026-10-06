import { useEffect, useState } from 'react';
import { PRESET_TEXTS } from '../data/fontsData';
import { publicApi } from '../admin/api';
import type { PresetText } from '../types/font';

/** Loads published presets from CMS; falls back to static seed data. */
export function usePublishedPresets() {
  const [presets, setPresets] = useState<PresetText[]>(PRESET_TEXTS);
  const [source, setSource] = useState<'api' | 'seed'>('seed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicApi
      .presets()
      .then((assets) => {
        if (cancelled) return;
        if (assets.length > 0) {
          setPresets(
            assets.map((p) => ({
              id: p.id,
              title: p.title,
              tibetanTitle: p.tibetanTitle,
              content: p.content,
              translation: p.translation,
              sortOrder: p.sortOrder,
              status: p.status
            }))
          );
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

  return { presets, source, loading };
}
