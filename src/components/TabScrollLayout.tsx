import React from 'react';
import { useForwardWheelToScroll } from '../hooks/useForwardWheelToScroll';

type TabScrollLayoutProps = {
  /** Toolbar / filters pinned under the app header */
  sticky?: React.ReactNode;
  children: React.ReactNode;
  /** Rendered at the bottom of the scroll area (e.g. site footer) */
  scrollFooter?: React.ReactNode;
  className?: string;
};

export const TabScrollLayout: React.FC<TabScrollLayoutProps> = ({
  sticky,
  children,
  scrollFooter,
  className = ''
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  useForwardWheelToScroll(scrollRef, rootRef);

  return (
    <div
      ref={rootRef}
      className={`flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden ${className}`.trim()}
    >
      {sticky ? (
        <div className="z-20 shrink-0 border-b border-gray-200 bg-gray-50/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
          {sticky}
        </div>
      ) : null}
      <div
        ref={scrollRef}
        className="catalog-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-4"
      >
        <div className="flex min-h-full min-w-0 flex-col">
          <div className="min-h-0 w-full flex-1">{children}</div>
          {scrollFooter ? <div className="mt-auto w-full shrink-0">{scrollFooter}</div> : null}
        </div>
      </div>
    </div>
  );
};
