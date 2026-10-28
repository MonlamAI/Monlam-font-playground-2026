import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { formatLocaleNumber, localeNumeralsClass } from '../utils/localeNumber';

export interface InstallVisualSlide {
  imageSrc: string;
  alt: string;
}

interface InstallStepsCarouselProps {
  slides: InstallVisualSlide[];
  /** When this changes, the carousel resets to the first slide */
  resetKey: string;
}

export const InstallStepsCarousel: React.FC<InstallStepsCarouselProps> = ({ slides, resetKey }) => {
  const { t, locale } = useI18n();
  const [index, setIndex] = React.useState(0);
  const count = slides.length;

  React.useEffect(() => {
    setIndex(0);
  }, [resetKey]);

  const go = (delta: number, target: HTMLButtonElement) => {
    setIndex((i) => (i + delta + count) % count);
    target.blur();
  };

  if (count === 0) return null;

  const current = slides[index]!;

  return (
    <div className="space-y-4">
      <div className="group relative w-full min-w-0">
        <div
          className="w-full min-w-0 overflow-hidden rounded-xl border border-blue-100/80 bg-white/90 shadow-sm backdrop-blur-sm dark:border-slate-600 dark:bg-slate-800/90"
          aria-live="polite"
          aria-atomic="true"
        >
          <figure className="install-guide-slide-frame m-0 flex w-full min-w-0 items-center justify-center p-2 sm:p-4">
            <img
              key={current.imageSrc}
              src={current.imageSrc}
              alt={current.alt}
              loading="eager"
              decoding="async"
              className="install-guide-slide-img"
            />
          </figure>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => go(-1, e.currentTarget)}
              className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-md transition hover:bg-white focus:outline-none sm:left-2 sm:opacity-0 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:group-hover:opacity-100 dark:border-slate-600 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label={t('common.previous')}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => go(1, e.currentTarget)}
              className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-md transition hover:bg-white focus:outline-none sm:right-2 sm:opacity-0 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:group-hover:opacity-100 dark:border-slate-600 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label={t('common.next')}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5" role="tablist" aria-label={t('install.visualGuideSteps')}>
            {slides.map((_, i) => (
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
                    : 'w-2 bg-blue-200/80 hover:bg-blue-300 dark:bg-slate-600 dark:hover:bg-slate-500'
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
