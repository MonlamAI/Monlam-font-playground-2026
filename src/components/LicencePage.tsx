import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowLeft, ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

/** Bundled copy of https://github.com/MonlamIT/Tibetan-Font-For-All-Devices/blob/master/LICENSE.txt */
export const MONLAM_FONT_OFL_BUNDLED = '/licenses/Monlam-Tibetan-Font-OFL.txt';
export const MONLAM_FONT_OFL_GITHUB =
  'https://github.com/MonlamIT/Tibetan-Font-For-All-Devices/blob/master/LICENSE.txt';
export const MONLAM_FONT_OFL_RAW =
  'https://raw.githubusercontent.com/MonlamIT/Tibetan-Font-For-All-Devices/master/LICENSE.txt';

async function loadMonlamOflText(): Promise<string> {
  const bundled = await fetch(MONLAM_FONT_OFL_BUNDLED);
  if (bundled.ok) return bundled.text();
  const remote = await fetch(MONLAM_FONT_OFL_RAW);
  if (!remote.ok) throw new Error('OFL fetch failed');
  return remote.text();
}

export const LicencePage: React.FC = () => {
  const { t } = useI18n();
  const [oflText, setOflText] = React.useState<string | null>(null);
  const [oflError, setOflError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    loadMonlamOflText()
      .then((text) => {
        if (!cancelled) setOflText(text.trim());
      })
      .catch(() => {
        if (!cancelled) setOflError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('licence.back')}
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold tibetan-text">
            <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {t('licence.title')}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight tibetan-text">{t('licence.title')}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
            {t('licence.subtitle')}
          </p>
        </div>

        <section className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-slate-200">
              {t('licence.typefacesHeading')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              {t('licence.typefacesIntro')}
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <a
                href={MONLAM_FONT_OFL_GITHUB}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t('licence.oflSourceLink')}
              </a>
              <a
                href={MONLAM_FONT_OFL_BUNDLED}
                download="Monlam-Tibetan-Font-OFL.txt"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('licence.oflDownload')}
              </a>
            </div>
          </div>

          {oflError && (
            <p className="text-sm text-amber-800 dark:text-amber-200">{t('licence.oflError')}</p>
          )}
          {!oflError && !oflText && (
            <p className="text-sm text-gray-500 dark:text-slate-500">{t('licence.oflLoading')}</p>
          )}
          {oflText && (
            <pre className="max-h-[min(70vh,640px)] overflow-auto rounded-lg border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/80 p-4 text-[11px] sm:text-xs leading-relaxed text-gray-800 dark:text-slate-200 whitespace-pre-wrap font-mono">
              {oflText}
            </pre>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-slate-200">
            {t('licence.keyboardsHeading')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
            {t('licence.keyboardsBody')}
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-slate-200">
            {t('licence.playgroundHeading')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
            {t('licence.playgroundBody')}
          </p>
        </section>

        <p className="text-xs text-gray-500 dark:text-slate-500 leading-relaxed">
          {t('licence.contact')}{' '}
          <a
            href="https://github.com/MonlamAI"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            MonlamAI
          </a>
          .
        </p>
      </main>
    </div>
  );
};
