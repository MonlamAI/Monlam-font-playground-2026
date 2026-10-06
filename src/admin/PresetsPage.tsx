import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { adminApi } from './api';
import type { PresetAsset } from '../types/cms';
import { StatusBadge } from './StatusBadge';

const emptyForm = {
  id: '',
  title: '',
  tibetanTitle: '',
  content: '',
  translation: '',
  sortOrder: 0,
  status: 'published' as 'draft' | 'published'
};

export function PresetsPage() {
  const [presets, setPresets] = useState<PresetAsset[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () =>
    adminApi
      .listPresets()
      .then(setPresets)
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setForm({
      ...emptyForm,
      sortOrder: presets.length
    });
    setMessage('');
    setError('');
  };

  const startEdit = (preset: PresetAsset) => {
    setCreating(false);
    setEditingId(preset.id);
    setForm({
      id: preset.id,
      title: preset.title,
      tibetanTitle: preset.tibetanTitle,
      content: preset.content,
      translation: preset.translation,
      sortOrder: preset.sortOrder,
      status: preset.status
    });
    setMessage('');
    setError('');
  };

  const cancel = () => {
    setCreating(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        title: form.title.trim(),
        tibetanTitle: form.tibetanTitle.trim(),
        content: form.content.trim(),
        translation: form.translation.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        status: form.status
      };
      if (!payload.title || !payload.content) {
        throw new Error('Title and sample content are required');
      }
      if (creating) {
        await adminApi.createPreset({
          ...payload,
          id: form.id.trim() || undefined
        });
        setMessage('Preset created');
      } else if (editingId) {
        await adminApi.updatePreset(editingId, payload);
        setMessage('Preset saved');
      }
      cancel();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (preset: PresetAsset) => {
    if (!confirm(`Delete preset “${preset.title}”? Font-specific overrides for it will also be removed.`)) {
      return;
    }
    await adminApi.deletePreset(preset.id);
    await load();
  };

  const field =
    'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm';
  const label = 'block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1';
  const showForm = creating || editingId;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Presets</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Manage playground sample texts. Special fonts can enable/override these per font in the font editor.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add preset
          </button>
        )}
      </div>

      {message && <p className="mt-3 text-sm text-emerald-600">{message}</p>}
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      {showForm && (
        <div className="mt-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              {creating ? 'New preset' : `Edit: ${editingId}`}
            </h2>
            <button
              type="button"
              onClick={cancel}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {creating && (
              <div className="sm:col-span-2">
                <label className={label}>ID (optional slug)</label>
                <input
                  className={field}
                  value={form.id}
                  onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                  placeholder="e.g. alphabet"
                />
              </div>
            )}
            <div>
              <label className={label}>Title</label>
              <input
                className={field}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className={label}>Tibetan title</label>
              <input
                className={`${field} tibetan-text`}
                value={form.tibetanTitle}
                onChange={(e) => setForm((f) => ({ ...f, tibetanTitle: e.target.value }))}
              />
            </div>
            <div>
              <label className={label}>Sort order</label>
              <input
                type="number"
                className={field}
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className={label}>Status</label>
              <select
                className={field}
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as 'draft' | 'published'
                  }))
                }
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Sample content</label>
              <textarea
                className={`${field} tibetan-text`}
                rows={3}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Translation / notes</label>
              <textarea
                className={field}
                rows={2}
                value={form.translation}
                onChange={(e) => setForm((f) => ({ ...f, translation: e.target.value }))}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save preset'}
          </button>
        </div>
      )}

      <div className="mt-5 divide-y divide-gray-100 dark:divide-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
        {presets.map((preset) => (
          <div key={preset.id} className="p-4 flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-sm text-gray-900 dark:text-slate-100">
                  {preset.title}
                </span>
                {preset.tibetanTitle && (
                  <span className="text-xs text-gray-500 dark:text-slate-400 tibetan-text">
                    {preset.tibetanTitle}
                  </span>
                )}
                <StatusBadge status={preset.status} />
                <span className="text-[11px] font-mono text-gray-400">{preset.id}</span>
              </div>
              <p className="mt-1.5 text-sm tibetan-text text-gray-800 dark:text-slate-200 leading-relaxed">
                {preset.content}
              </p>
              {preset.translation && (
                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{preset.translation}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(preset)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(preset)}
                className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {presets.length === 0 && (
          <p className="p-6 text-sm text-gray-500 dark:text-slate-400 text-center">
            No presets yet. Add one or restart the API to seed defaults.
          </p>
        )}
      </div>
    </div>
  );
}
