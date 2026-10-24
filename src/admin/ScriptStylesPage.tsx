import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Save, X, Tags } from 'lucide-react';
import { adminApi } from './api';
import type { FontAsset, ScriptStyleAsset } from '../types/cms';

const emptyForm = {
  id: '',
  name: '',
  tibetanName: '',
  sortOrder: 0
};

export function ScriptStylesPage() {
  const [styles, setStyles] = useState<ScriptStyleAsset[]>([]);
  const [fonts, setFonts] = useState<FontAsset[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [assignStyleId, setAssignStyleId] = useState<string | null>(null);
  const [selectedFontIds, setSelectedFontIds] = useState<Set<string>>(new Set());
  const [assignSaving, setAssignSaving] = useState(false);

  const load = async () => {
    const [styleRows, fontRows] = await Promise.all([
      adminApi.listScriptStyles(),
      adminApi.listFonts()
    ]);
    setStyles(styleRows);
    setFonts(fontRows);
  };

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : 'Load failed'));
  }, []);

  const fontsByStyle = useMemo(() => {
    const map = new Map<string, FontAsset[]>();
    for (const style of styles) {
      map.set(
        style.id,
        fonts.filter((f) => f.category === style.id).sort((a, b) => a.name.localeCompare(b.name))
      );
    }
    return map;
  }, [styles, fonts]);

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setForm({ ...emptyForm, sortOrder: styles.length });
    setMessage('');
    setError('');
  };

  const startEdit = (style: ScriptStyleAsset) => {
    setCreating(false);
    setEditingId(style.id);
    setForm({
      id: style.id,
      name: style.name,
      tibetanName: style.tibetanName,
      sortOrder: style.sortOrder
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
        name: form.name.trim(),
        tibetanName: form.tibetanName.trim(),
        sortOrder: Number(form.sortOrder) || 0
      };
      if (!payload.name) throw new Error('English name is required');
      if (creating) {
        await adminApi.createScriptStyle({
          ...payload,
          id: form.id.trim() || undefined
        });
        setMessage('Script style created');
      } else if (editingId) {
        await adminApi.updateScriptStyle(editingId, payload);
        setMessage('Script style saved');
      }
      cancel();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (style: ScriptStyleAsset) => {
    if (
      !confirm(
        `Delete script style “${style.name}”? You must reassign its typefaces first (${style.fontCount ?? 0} assigned).`
      )
    ) {
      return;
    }
    try {
      await adminApi.deleteScriptStyle(style.id);
      setMessage('Script style deleted');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const openAssign = (styleId: string) => {
    setAssignStyleId(styleId);
    const inGroup = fonts.filter((f) => f.category === styleId).map((f) => f.id);
    setSelectedFontIds(new Set(inGroup));
    setError('');
    setMessage('');
  };

  const closeAssign = () => {
    setAssignStyleId(null);
    setSelectedFontIds(new Set());
  };

  const toggleFont = (fontId: string) => {
    setSelectedFontIds((prev) => {
      const next = new Set(prev);
      if (next.has(fontId)) next.delete(fontId);
      else next.add(fontId);
      return next;
    });
  };

  const saveAssign = async () => {
    if (!assignStyleId) return;
    setAssignSaving(true);
    setError('');
    try {
      const styleId = assignStyleId;
      const selected = [...selectedFontIds];
      const previously = fonts.filter((f) => f.category === styleId).map((f) => f.id);
      const toAdd = selected.filter((id) => !previously.includes(id));
      const toRemove = previously.filter((id) => !selected.includes(id));

      if (toAdd.length) {
        await adminApi.assignFontsToScriptStyle(styleId, toAdd);
      }
      for (const fontId of toRemove) {
        const fallback = styles.find((s) => s.id !== styleId)?.id || 'Uchen';
        await adminApi.updateFont(fontId, { category: fallback });
      }
      setMessage('Typefaces updated for this script style');
      closeAssign();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not assign typefaces');
    } finally {
      setAssignSaving(false);
    }
  };

  const field =
    'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm';
  const label = 'block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1';
  const showForm = creating || editingId;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Script styles</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Groups for the catalog sidebar (“Script style”) and each typeface’s category field.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add script style
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</p>
      )}

      {showForm && (
        <div className="mt-6 p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4">
          <h2 className="font-medium text-sm">
            {creating ? 'New script style' : `Edit “${editingId}”`}
          </h2>
          {creating && (
            <div>
              <label className={label}>Id (optional slug)</label>
              <input
                className={field}
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                placeholder="e.g. uchen-headline"
              />
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>English name</label>
              <input
                className={field}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className={label}>Tibetan name</label>
              <input
                className={`${field} tibetan-text`}
                value={form.tibetanName}
                onChange={(e) => setForm((f) => ({ ...f, tibetanName: e.target.value }))}
              />
            </div>
          </div>
          <div className="w-32">
            <label className={label}>Sort order</label>
            <input
              type="number"
              className={field}
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={save}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              type="button"
              onClick={cancel}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="mt-8 space-y-4">
        {styles.map((style) => {
          const groupFonts = fontsByStyle.get(style.id) || [];
          return (
            <li
              key={style.id}
              className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Tags className="w-4 h-4 text-gray-400" />
                    <h3 className="font-semibold text-sm">{style.name}</h3>
                    <span className="text-xs text-gray-400 font-mono">{style.id}</span>
                  </div>
                  {style.tibetanName && (
                    <p className="tibetan-text text-sm text-gray-600 dark:text-slate-300 mt-1">
                      {style.tibetanName}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                    {groupFonts.length} typeface{groupFonts.length === 1 ? '' : 's'} · order{' '}
                    {style.sortOrder}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openAssign(style.id)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    Manage typefaces
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(style)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(style)}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {groupFonts.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {groupFonts.map((f) => (
                    <li key={f.id}>
                      <Link
                        to={`/admin/fonts/${f.id}`}
                        className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {f.tibetanName || f.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {assignStyleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-xl">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-semibold text-sm">
                Typefaces in “{styles.find((s) => s.id === assignStyleId)?.name}”
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Check typefaces that belong to this script style.
              </p>
            </div>
            <ul className="flex-1 overflow-y-auto p-4 space-y-2">
              {fonts.map((f) => (
                <li key={f.id}>
                  <label className="flex items-start gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFontIds.has(f.id)}
                      onChange={() => toggleFont(f.id)}
                      className="mt-1"
                    />
                    <span>
                      <span className="tibetan-text block">{f.tibetanName || f.name}</span>
                      <span className="text-xs text-gray-500">{f.name}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeAssign}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assignSaving}
                onClick={saveAssign}
                className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white disabled:opacity-50"
              >
                Save assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
