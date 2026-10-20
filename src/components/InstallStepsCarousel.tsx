import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

export interface InstallStep {
  /** Step badge (1, 2, 3) or custom node (e.g. platform icon) */
  badge: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
}

interface InstallStepsCarouselProps {
  steps: InstallStep[];
  /** When this changes, the carousel resets to the first slide */
  resetKey: string;
}

export const InstallStepsCarousel: React.FC<InstallStepsCarouselProps> = ({ steps, resetKey }) => {
  const { t } = useI18n();
  const [index, setIndex] = React.useState(0);
  const count = steps.length;

  React.useEffect(() => {
    setIndex(0);
  }, [resetKey]);

  const go = (delta: number, target: HTMLButtonElement) => {
    setIndex((i) => (i + delta + count) % count);
    target.blur();
  };

  if (count === 0) return null;

  return (
    <div className="space-y-4">
      <div className="group relative">
        <div
          className="overflow-hidden rounded-xl"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {steps.map((s, i) => (
              <article
                key={i}
                className="min-w-full shrink-0 p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 space-y-3"
                aria-hidden={i !== index}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0">{s.badge}</div>
                  <div className="min-w-0 space-y-2 flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm sm:text-base">{s.title}</h4>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{s.body}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => go(-1, e.currentTarget)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 dark:bg-slate-900/95 border border-gray-200 dark:border-slate-600 shadow-md flex items-center justify-center text-gray-700 dark:text-slate-200 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-white dark:hover:bg-slate-800 focus:outline-none"
              aria-label={t('common.previous')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => go(1, e.currentTarget)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 dark:bg-slate-900/95 border border-gray-200 dark:border-slate-600 shadow-md flex items-center justify-center text-gray-700 dark:text-slate-200 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-white dark:hover:bg-slate-800 focus:outline-none"
              aria-label={t('common.next')}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Installation steps">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={t('common.stepOf', { current: i + 1, total: count })}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-slate-400 tabular-nums">
            {t('common.stepOf', { current: index + 1, total: count })}
          </span>
        </div>
      )}
    </div>
  );
};
