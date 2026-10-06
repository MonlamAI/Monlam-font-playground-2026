import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, EyeOff } from 'lucide-react';
import { adminApi } from './api';
import type { KeyboardAsset } from '../types/cms';
import { StatusBadge } from './StatusBadge';

export function KeyboardsPage() {
  const [items, setItems] = useState<KeyboardAsset[]>([]);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const load = () =>
    adminApi
      .listKeyboards()
      .then(setItems)
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter(
      (k) =>
        k.name.toLowerCase().includes(s) ||
        k.script.toLowerCase().includes(s) ||
        k.layoutType.toLowerCase().includes(s)
    );
  }, [items, q]);

  const togglePublish = async (kb: KeyboardAsset) => {
    await adminApi.publishKeyboard(kb.id, kb.status === 'published' ? 'draft' : 'published');
    await load();
  };

  const remove = async (kb: KeyboardAsset) => {
    if (!confirm(`Delete “${kb.name}”?`)) return;
    await adminApi.deleteKeyboard(kb.id);
    await load();
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Keyboards</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Manage keyboard packages and associate them with fonts/scripts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/keyboards/new')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add keyboard
        </button>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search keyboards…"
        className="mt-4 max-w-md w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
      />

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((kb) => (
          <div
            key={kb.id}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-slate-100">{kb.name}</h2>
                <p className="text-xs tibetan-text text-gray-500" style={{ wordBreak: 'normal' }}>
                  {kb.tibetanName}
                </p>
              </div>
              <StatusBadge status={kb.status} />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-slate-400 line-clamp-2">{kb.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-gray-500">
              <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800">{kb.layoutType}</span>
              <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800">{kb.script}</span>
              <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800">v{kb.version}</span>
              <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800">
                {kb.fontIds.length} fonts
              </span>
            </div>
            <div className="mt-4 flex items-center gap-1">
              <Link
                to={`/admin/keyboards/${kb.id}`}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => togglePublish(kb)}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
                title="Toggle publish"
              >
                <EyeOff className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(kb)}
                className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 col-span-full py-8 text-center">No keyboards yet.</p>
        )}
      </div>
    </div>
  );
}
