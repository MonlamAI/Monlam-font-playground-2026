import React from 'react';
import { Bell, Keyboard, Type, X } from 'lucide-react';
import type { CatalogUpdateDiff } from '../utils/catalogUpdates';
import { formatUpdateHeadline, formatUpdateSummary } from '../utils/catalogUpdates';
import { useI18n } from '../i18n/I18nProvider';

const AUTO_COLLAPSE_MS = 5000;

interface UpdateNotificationProps {
  open: boolean;
  collapsed: boolean;
  diff: CatalogUpdateDiff | null;
  onDismiss: () => void;
  onCollapse: () => void;
  onExpand: () => void;
  onViewFonts?: () => void;
  onViewKeyboards?: () => void;
}

function ItemList({
  label,
  icon,
  items,
  t
}: {
  label: string;
  icon: React.ReactNode;
  items: { id: string; name: string; version: string; kind: 'new' | 'updated' }[];
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  if (items.length === 0) return null;
  const shown = items.slice(0, 4);
  const remaining = items.length - shown.length;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-1">
        {icon}
        <span>
          {label} ({items.length})
        </span>
      </div>
      <ul className="space-y-0.5">
        {shown.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 text-[11px] text-gray-700 dark:text-slate-300"
          >
            <span className="truncate font-medium">{item.name}</span>
            <span className="shrink-0 text-[9px] text-gray-400 dark:text-slate-500 font-mono">
              {item.kind === 'new'
                ? t('updates.badgeNew')
                : `${t('global.version')} ${item.version}`}
            </span>
          </li>
        ))}
        {remaining > 0 && (
          <li className="text-[10px] text-gray-400 dark:text-slate-500">
            {t('updates.moreItems', { count: remaining })}
          </li>
        )}
      </ul>
    </div>
  );
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  open,
  collapsed,
  diff,
  onDismiss,
  onCollapse,
  onExpand,
  onViewFonts,
  onViewKeyboards
}) => {
  const { t } = useI18n();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onDismiss]);

  React.useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      onCollapse();
    }, AUTO_COLLAPSE_MS);
    return () => window.clearTimeout(timer);
  }, [open, onCollapse]);

  if (collapsed && diff?.hasUpdates && !open) {
    const unreadCount = diff.fonts.length + diff.keyboards.length;
    return (
      <button
        type="button"
        onClick={onExpand}
        aria-label={`Show unread catalog updates (${unreadCount})`}
        className="fixed bottom-4 right-4 z-[60] w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg shadow-black/10 dark:shadow-black/40 text-blue-700 dark:text-blue-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition flex items-center justify-center"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
      </button>
    );
  }

  if (!open || !diff?.hasUpdates) return null;

  const headline = formatUpdateHeadline(diff);
  const summary = formatUpdateSummary(diff);
  const showFontsCta = diff.fonts.length > 0 && onViewFonts;
  const showKeyboardsCta = diff.keyboards.length > 0 && onViewKeyboards;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[60] w-[min(100vw-2rem,17.5rem)]"
    >
      <div className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden">
        <div className="flex items-start gap-2.5 p-3 pb-2.5">
          <div className="mt-0.5 p-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 shrink-0">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xs font-semibold text-gray-900 dark:text-slate-100 leading-snug">
                {headline}
              </h2>
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss update notification"
                className="p-0.5 rounded-full text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="mt-0.5 text-[11px] text-gray-600 dark:text-slate-400 leading-relaxed">
              {summary}
            </p>

            <ItemList
              label={t('updates.fontsLabel')}
              icon={<Type className="w-2.5 h-2.5" />}
              items={diff.fonts}
              t={t}
            />
            <ItemList
              label={t('updates.keyboardsLabel')}
              icon={<Keyboard className="w-2.5 h-2.5" />}
              items={diff.keyboards}
              t={t}
            />
          </div>
        </div>

        <div className="px-3 py-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-1.5 bg-gray-50/80 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={onDismiss}
            className="px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 rounded-full transition"
          >
            Dismiss
          </button>
          {showKeyboardsCta && (
            <button
              type="button"
              onClick={() => {
                onViewKeyboards?.();
                onDismiss();
              }}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              View keyboards
            </button>
          )}
          {showFontsCta && (
            <button
              type="button"
              onClick={() => {
                onViewFonts?.();
                onDismiss();
              }}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              View fonts
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
