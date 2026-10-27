import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Type, Keyboard, FileCheck2, MessageSquare, SlidersHorizontal } from 'lucide-react';
import { adminApi } from './api';
import type { PublicSiteSettings } from '../types/siteSettings';

export function DashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminApi.stats>> | null>(null);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch((e) => setError(e.message));
    adminApi
      .siteSettings()
      .then(setSiteSettings)
      .catch((e) => setSettingsError(e.message));
  }, []);

  const toggleCompareBoldness = async (enabled: boolean) => {
    setSettingsSaving(true);
    setSettingsError('');
    try {
      const next = await adminApi.updateSiteSettings({ compareBoldnessEnabled: enabled });
      setSiteSettings(next);
    } catch (e) {
      setSettingsError(e instanceof Error ? e.message : 'Could not save settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const cards = stats
    ? [
        {
          label: 'Fonts',
          value: stats.fonts,
          sub: `${stats.publishedFonts} published · ${stats.draftFonts} draft`,
          icon: Type,
          to: '/admin/fonts'
        },
        {
          label: 'Keyboards',
          value: stats.keyboards,
          sub: `${stats.publishedKeyboards} published · ${stats.draftKeyboards} draft`,
          icon: Keyboard,
          to: '/admin/keyboards'
        },
        {
          label: 'Feedback',
          value: stats.feedback,
          sub: `${stats.newFeedback} new · awaiting review`,
          icon: MessageSquare,
          to: '/admin/feedback'
        },
        {
          label: 'Published fonts',
          value: stats.publishedFonts,
          sub: 'Visible on public site',
          icon: FileCheck2,
          to: '/admin/fonts?status=published'
        }
      ]
    : [];

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Dashboard</h1>
      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
        Manage Monlam font and keyboard assets for the public Font & Keyboard Suite.
      </p>
      {error && (
        <p className="mt-4 text-sm text-rose-600">
          {error}. Is the API running? Try <code className="font-mono">npm run server</code>.
        </p>
      )}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-800 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">
                {c.label}
              </span>
              <c.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-slate-100">{c.value}</div>
            <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">{c.sub}</div>
          </Link>
        ))}
      </div>

      <section className="mt-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">Public site features</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              Turn optional controls on or off for visitors without redeploying the app.
            </p>
          </div>
        </div>

        {settingsError ? (
          <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">{settingsError}</p>
        ) : null}

        <ul className="mt-5 divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-lg overflow-hidden">
          <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-gray-50/50 dark:bg-slate-900/50">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-slate-100">Compare — boldness slider</div>
              <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Shows the weight control on the side-by-side Compare tab. Off by default.
              </div>
            </div>
            <label className="inline-flex items-center gap-2 shrink-0 cursor-pointer">
              <span className="text-xs font-medium text-gray-600 dark:text-slate-400">
                {siteSettings?.compareBoldnessEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                checked={siteSettings?.compareBoldnessEnabled ?? false}
                disabled={settingsSaving || siteSettings === null}
                onChange={(e) => void toggleCompareBoldness(e.target.checked)}
              />
            </label>
          </li>
        </ul>
      </section>
    </div>
  );
}
