import React from 'react';

type BilingualSize = 'sm' | 'md' | 'lg';

const tibetanPrimary: Record<BilingualSize, string> = {
  sm: 'tibetan-text font-app font-semibold text-sm text-gray-900 dark:text-slate-100',
  md: 'tibetan-text font-app font-semibold text-base sm:text-lg text-gray-900 dark:text-slate-100',
  lg: 'tibetan-text font-app font-semibold text-xl sm:text-2xl text-gray-900 dark:text-slate-100'
};

const englishSecondary: Record<BilingualSize, string> = {
  sm: 'text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-slate-400',
  md: 'text-[11px] sm:text-xs font-medium text-gray-500 dark:text-slate-400',
  lg: 'text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400'
};

export interface BilingualTitleProps {
  tibetan?: string | null;
  english: React.ReactNode;
  size?: BilingualSize;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
}

/** Tibetan line primary; English line secondary (matches site header hierarchy). */
export const BilingualTitle: React.FC<BilingualTitleProps> = ({
  tibetan,
  english,
  size = 'md',
  className = '',
  primaryClassName,
  secondaryClassName
}) => {
  const tibetanLine = tibetan?.trim();
  if (!tibetanLine) {
    return (
      <div className={className}>
        <p
          className={
            primaryClassName ??
            `font-semibold text-gray-900 dark:text-slate-100 ${
              size === 'lg' ? 'text-xl sm:text-2xl' : size === 'sm' ? 'text-sm' : 'text-base'
            }`
          }
        >
          {english}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className={primaryClassName ?? tibetanPrimary[size]}>{tibetanLine}</p>
      <p className={secondaryClassName ?? `${englishSecondary[size]} mt-0.5`}>{english}</p>
    </div>
  );
};
