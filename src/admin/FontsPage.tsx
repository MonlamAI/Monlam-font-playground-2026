import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { adminApi } from './api';
import type { FontAsset } from '../types/cms';
import { StatusBadge } from './StatusBadge';
import { FontPreview } from './FontPreview';

export function FontsPage() {
  const [fonts, setFonts] = useState<FontAsset[]>([]);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [preview, setPreview] = useState<FontAsset | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const statusFilter = params.get('status');

  const load = () =>
    adminApi
      .listFonts()
      .then(setFonts)
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return fonts
      .filter((f) => {
        if (statusFilter === 'published' || statusFilter === 'draft') {
          if (f.status !== statusFilter) return false;
        }
        if (!q.trim()) return true;
        const s = q.toLowerCase();
        return (
          f.name.toLowerCase().includes(s) ||
          f.tibetanName.includes(q) ||
          f.category.toLowerCase().includes(s) ||
          f.tags.some((t) => t.toLowerCase().includes(s))
        );
      })
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));
  }, [fonts, q, statusFilter]);

  const togglePublish = async (font: FontAsset) => {
    const next = font.status === 'published' ? 'draft' : 'published';
    await adminApi.publishFont(font.id, next);
    await load();
  };

  const remove = async (font: FontAsset) => {
    if (!confirm(`Delete “${font.name}”? This cannot be undone.`)) return;
    await adminApi.deleteFont(font.id);
    await load();
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Fonts</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Upload, edit metadata, preview, and publish typefaces.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/fonts/new')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add font
        </button>
      </div>

      <div className="mt-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search fonts…"
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <div className="mt-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800/60 text-left text-xs text-gray-500 dark:text-slate-400">
            <tr>
              <th className="px-3 py-3 font-medium w-14 text-center">Order</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">File</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {filtered.map((font) => (
              <tr key={font.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/40">
                <td className="px-3 py-3 text-center tabular-nums text-gray-500 dark:text-slate-400">
                  {font.sortOrder ?? 0}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 dark:text-slate-100">{font.name}</div>
                  <div className="text-xs text-gray-500 tibetan-text" style={{ wordBreak: 'normal' }}>
                    {font.tibetanName}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-600 dark:text-slate-400">
                  <span>{font.category}</span>
                  {font.fontKind === 'special' && (
                    <span className="ml-1.5 inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                      Special
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={font.status} />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 font-mono">
                  {font.fileUrl ? font.filename || 'uploaded' : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="Preview"
                      onClick={() => setPreview(font)}
                      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/admin/fonts/${font.id}`}
                      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      title={font.status === 'published' ? 'Unpublish' : 'Publish'}
                      onClick={() => togglePublish(font)}
                      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => remove(font)}
                      className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No fonts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 max-w-lg w-full p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{preview.name}</h2>
                <StatusBadge status={preview.status} />
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700">
              <FontPreview
                family={preview.name}
                fileUrl={preview.fileUrl}
                sample={preview.sampleText}
              />
            </div>
            {!preview.fileUrl && (
              <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                No font file uploaded yet — preview uses system/Noto fallbacks.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
