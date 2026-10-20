import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowLeft } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

export const LicencePage: React.FC = () => {
  const { t } = useI18n();
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
            How you may use the Monlam Font Playground, Monlam typefaces, and related keyboard assets.
          </p>
        </div>

        <section className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-slate-200">
            Typefaces
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
            Monlam fonts are created by Venerable Geshe Lobsang Monlam and the Monlam IT Research Centre. You may
            download and use published fonts from this playground for personal, educational, cultural, and non-commercial
            projects. Redistribution of the font files themselves should keep original names, copyright notices, and
            licence terms intact.
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
            Do not sell the fonts as a standalone product, claim authorship of the typefaces, or use the Monlam name in
            a way that suggests official endorsement without permission.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-slate-200">
            Keyboards
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
            Keyboard layouts and installers offered here are provided to help people type Tibetan. You may install them
            for personal use. Modified redistributions should credit Monlam IT and must not misrepresent the original
            layout.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-slate-200">
            This playground
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
            The Monlam Font Playground application code is licensed under the Apache License 2.0, unless a specific
            file states otherwise. The fonts and keyboards catalogued here remain the intellectual property of their
            original authors and are not covered by that software licence.
          </p>
        </section>

        <p className="text-xs text-gray-500 dark:text-slate-500 leading-relaxed">
          For permissions beyond this summary, contact Monlam IT /{' '}
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
