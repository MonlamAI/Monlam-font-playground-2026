import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Type, Keyboard, FileCheck2, MessageSquare } from 'lucide-react';
import { adminApi } from './api';

export function DashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminApi.stats>> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

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
    </div>
  );
}
