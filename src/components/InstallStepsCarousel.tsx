import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { formatLocaleNumber, localeNumeralsClass } from '../utils/localeNumber';

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
  const { t, locale } = useI18n();
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
                className="min-w-full shrink-0 space-y-3 rounded-xl border border-blue-100/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-slate-600 dark:bg-slate-800/90 sm:p-6"
                aria-hidden={i !== index}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">{s.badge}</div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 sm:text-base">{s.title}</h4>
                    <div className="text-xs leading-relaxed text-gray-600 dark:text-slate-400 sm:text-sm">{s.body}</div>
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
                aria-label={t('common.stepOf', {
                  current: formatLocaleNumber(i + 1, locale),
                  total: formatLocaleNumber(count, locale)
                })}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? 'w-7 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm shadow-blue-500/30'
                    : 'w-2 bg-blue-200/80 dark:bg-slate-600 hover:bg-blue-300 dark:hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
          <span className={`text-xs font-semibold text-gray-700 dark:text-slate-200 ${localeNumeralsClass}`}>
            {t('common.stepOf', {
              current: formatLocaleNumber(index + 1, locale),
              total: formatLocaleNumber(count, locale)
            })}
          </span>
        </div>
      )}
    </div>
  );
};
