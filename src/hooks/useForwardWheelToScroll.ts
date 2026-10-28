import React from 'react';

/** Route wheel events from non-scroll chrome (toolbars) into the main tab scroll pane. */
export function useForwardWheelToScroll(
  scrollRef: React.RefObject<HTMLElement | null>,
  rootRef: React.RefObject<HTMLElement | null>,
  options?: { skipAside?: boolean }
) {
  React.useEffect(() => {
    const scrollEl = scrollRef.current;
    const rootEl = rootRef.current;
    if (!scrollEl || !rootEl) return;

    const onWheel = (e: WheelEvent) => {
      const target = e.target;
      if (!(target instanceof Node) || !rootEl.contains(target)) return;
      if (target instanceof Element) {
        if (target.closest('textarea, input, select, [contenteditable="true"]')) return;
        if (scrollEl.contains(target)) return;
        if (options?.skipAside && target.closest('aside')) return;
      }

      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
      if (maxScroll <= 0) return;

      e.preventDefault();
      scrollEl.scrollTop = Math.max(0, Math.min(maxScroll, scrollEl.scrollTop + e.deltaY));
    };

    document.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => document.removeEventListener('wheel', onWheel, { capture: true });
  }, [scrollRef, rootRef, options?.skipAside]);
}
