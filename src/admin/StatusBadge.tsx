import React from 'react';

export function StatusBadge({ status }: { status: 'draft' | 'published' }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
        status === 'published'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
          : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800'
      }`}
    >
      {status}
    </span>
  );
}
