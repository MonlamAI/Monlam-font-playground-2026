import React from 'react';
import type { AppLocale } from '../i18n/localeStorage';
import {
  clampNumber,
  formatLocaleDecimal,
  formatLocaleNumber,
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

function formatNumericOnly(
  value: number,
  suffix: NumericControlSuffix,
  locale: AppLocale,
  fractionDigits: number
): string {
  if (suffix === 'x') return formatLocaleDecimal(value, locale, fractionDigits);
  return formatLocaleNumber(value, locale);
}

function suffixLabel(suffix: NumericControlSuffix): string {
  if (suffix === 'px') return 'px';
  if (suffix === 'x') return 'x';
  return '';
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
  const unit = suffixLabel(suffix);

  React.useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setDraft(null);
    }
  }, [value, locale]);

  const display = draft ?? formatNumericOnly(value, suffix, locale, fractionDigits);

  const applyDraft = () => {
    const next = commitValue(draft ?? display, min, max, suffix, fractionDigits);
    setDraft(null);
    if (next != null && next !== value) onChange(next);
  };

  return (
    <span className={`inline-flex items-center gap-0.5 shrink-0 ${className}`}>
      <input
        ref={inputRef}
        type="text"
        inputMode={suffix === 'x' ? 'decimal' : 'numeric'}
        aria-label={unit ? `${ariaLabel} (${unit})` : ariaLabel}
        value={display}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={(e) => {
          setDraft(formatNumericOnly(value, suffix, locale, fractionDigits));
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
        className={`${localeNumeralsClass} box-border w-[2.375rem] min-w-[2.375rem] max-w-[2.375rem] rounded border border-gray-200 bg-white px-0.5 py-0.5 text-right text-[11px] font-semibold leading-none text-gray-800 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100`}
      />
      {unit ? (
        <span className="text-[11px] font-semibold text-gray-700 dark:text-slate-200 select-none">{unit}</span>
      ) : null}
    </span>
  );
};
