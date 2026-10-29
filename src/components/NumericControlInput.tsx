import React from 'react';
import type { AppLocale } from '../i18n/localeStorage';
import {
  clampNumber,
  formatLocaleDecimal,
  formatLocaleNumber,
  formatLocaleMultiplier,
  formatLocalePx,
  localeNumeralsClass,
  parseLocaleNumericInput
} from '../utils/localeNumber';

export type NumericControlSuffix = 'px' | 'x' | 'none';

type NumericControlInputProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  suffix: NumericControlSuffix;
  locale: AppLocale;
  /** Decimal places when suffix is `x`. */
  fractionDigits?: number;
  className?: string;
  ariaLabel: string;
};

function formatValue(
  value: number,
  suffix: NumericControlSuffix,
  locale: AppLocale,
  fractionDigits: number
): string {
  if (suffix === 'px') return formatLocalePx(value, locale);
  if (suffix === 'x') return formatLocaleMultiplier(value, locale, fractionDigits);
  return formatLocaleNumber(value, locale);
}

function commitValue(
  raw: string,
  min: number,
  max: number,
  suffix: NumericControlSuffix,
  fractionDigits: number
): number | null {
  const parsed = parseLocaleNumericInput(raw);
  if (parsed == null) return null;
  let next = clampNumber(parsed, min, max);
  if (suffix === 'x') {
    const factor = 10 ** fractionDigits;
    next = Math.round(next * factor) / factor;
  } else {
    next = Math.round(next);
  }
  return clampNumber(next, min, max);
}

export const NumericControlInput: React.FC<NumericControlInputProps> = ({
  value,
  onChange,
  min,
  max,
  suffix,
  locale,
  fractionDigits = 1,
  className = '',
  ariaLabel
}) => {
  const [draft, setDraft] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setDraft(null);
    }
  }, [value, locale]);

  const display = draft ?? formatValue(value, suffix, locale, fractionDigits);

  const applyDraft = () => {
    const next = commitValue(draft ?? display, min, max, suffix, fractionDigits);
    setDraft(null);
    if (next != null && next !== value) onChange(next);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode={suffix === 'x' ? 'decimal' : 'numeric'}
      aria-label={ariaLabel}
      value={display}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={(e) => {
        setDraft(formatValue(value, suffix, locale, fractionDigits));
        e.target.select();
      }}
      onBlur={applyDraft}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyDraft();
          inputRef.current?.blur();
        }
        if (e.key === 'Escape') {
          setDraft(null);
          inputRef.current?.blur();
        }
      }}
      className={`${localeNumeralsClass} w-[4.25rem] rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-right text-xs font-semibold text-gray-800 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 ${className}`}
    />
  );
};
