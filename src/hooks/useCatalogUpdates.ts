import { useCallback, useEffect, useRef, useState } from 'react';
import { publicApi } from '../admin/api';
import {
  buildSnapshot,
  diffSnapshots,
  readSeenSnapshot,
  writeSeenSnapshot,
  type CatalogUpdateDiff,
  type CatalogUpdateSnapshot
} from '../utils/catalogUpdates';

const POLL_MS = 5 * 60 * 1000;

function diffSignature(diff: CatalogUpdateDiff): string {
  const fonts = diff.fonts.map((f) => `${f.id}:${f.version}:${f.updatedAt}`).join(',');
  const keyboards = diff.keyboards.map((k) => `${k.id}:${k.version}:${k.updatedAt}`).join(',');
  return `${fonts}|${keyboards}`;
}

export function useCatalogUpdates() {
  const [diff, setDiff] = useState<CatalogUpdateDiff | null>(null);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const latestSnapshot = useRef<CatalogUpdateSnapshot | null>(null);
  const checking = useRef(false);
  const lastSignature = useRef<string | null>(null);

  const checkForUpdates = useCallback(async () => {
    if (checking.current) return;
    checking.current = true;
    try {
      const [fonts, keyboards] = await Promise.all([
        publicApi.fonts().catch(() => []),
        publicApi.keyboards().catch(() => [])
      ]);

      // No CMS data available — stay silent
      if (fonts.length === 0 && keyboards.length === 0) return;

      const current = buildSnapshot(fonts, keyboards);
      latestSnapshot.current = current;

      const previous = readSeenSnapshot();
      if (!previous) {
        // First visit: remember the catalog without notifying
        writeSeenSnapshot(current);
        return;
      }

      const nextDiff = diffSnapshots(current, previous);
      if (nextDiff.hasUpdates) {
        const signature = diffSignature(nextDiff);
        const isNewNotice = lastSignature.current !== signature;
        setDiff(nextDiff);
        if (isNewNotice) {
          lastSignature.current = signature;
          setOpen(true);
          setCollapsed(false);
        }
      }
    } catch {
      // Offline / API down — no popup
    } finally {
      checking.current = false;
    }
  }, []);

  const dismiss = useCallback(() => {
    if (latestSnapshot.current) {
      writeSeenSnapshot(latestSnapshot.current);
    }
    setOpen(false);
    setCollapsed(false);
    setDiff(null);
  }, []);

  const collapse = useCallback(() => {
    setOpen(false);
    setCollapsed(true);
  }, []);

  const expand = useCallback(() => {
    setCollapsed(false);
    setOpen(true);
  }, []);

  useEffect(() => {
    checkForUpdates();

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    const timer = window.setInterval(checkForUpdates, POLL_MS);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(timer);
    };
  }, [checkForUpdates]);

  return {
    open,
    collapsed,
    diff,
    dismiss,
    collapse,
    expand
  };
}
