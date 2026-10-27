import { useEffect, useState } from 'react';
import type { PublicSiteSettings } from '../types/siteSettings';

const DEFAULT_SETTINGS: PublicSiteSettings = {
  compareBoldnessEnabled: false
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<PublicSiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/site-settings')
      .then((res) => (res.ok ? res.json() : DEFAULT_SETTINGS))
      .then((data: PublicSiteSettings) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {
        if (!cancelled) setSettings(DEFAULT_SETTINGS);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
