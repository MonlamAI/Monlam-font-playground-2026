import React from 'react';
import { Globe, MessageSquarePlus, MoreVertical, Moon, Sun } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { uiTibetanClass } from '../utils/fontDisplay';

type HeaderUtilityMenuProps = {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenFeedback: () => void;
};

export const HeaderUtilityMenu: React.FC<HeaderUtilityMenuProps> = ({
  isDark,
  onToggleTheme,
  onOpenFeedback
}) => {
  const { t, locale, setLocale } = useI18n();
  const uiBo = uiTibetanClass(locale, true);
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const currentLang = locale === 'bo' ? t('lang.bo') : t('lang.en');
  const switchLangHint = locale === 'bo' ? t('lang.switchToEn') : t('lang.switchToBo');
  const themeLabel = isDark ? t('theme.toLight') : t('theme.toDark');

  const menuItemClass =
    'flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-gray-800 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800 transition';

  return (
    <div className="relative xl:hidden" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('global.more')}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 shadow-sm transition active:scale-95"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-[60] mt-1.5 w-[min(calc(100vw-1.5rem),14rem)] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          <button
            type="button"
            role="menuitem"
            className={menuItemClass}
            onClick={() => {
              onToggleTheme();
              setOpen(false);
            }}
          >
            {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            <span className={uiBo}>{themeLabel}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className={menuItemClass}
            onClick={() => {
              onOpenFeedback();
              setOpen(false);
            }}
          >
            <MessageSquarePlus className="w-4 h-4 shrink-0" />
            <span className={uiBo}>{t('nav.feedback')}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className={menuItemClass}
            onClick={() => {
              setLocale(locale === 'bo' ? 'en' : 'bo');
              setOpen(false);
            }}
            aria-label={switchLangHint}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span className={locale === 'bo' ? 'tibetan-text tibetan-text-ui' : ''}>
              {currentLang}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
};
