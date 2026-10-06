import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { adminApi } from './api';
import type { FontAsset, KeyboardAsset } from '../types/cms';
import { StatusBadge } from './StatusBadge';

export function KeyboardEditorPage() {
  const { id } = useParams();
  const isNew = id === 'new' || !id;
  const navigate = useNavigate();
  const [fonts, setFonts] = useState<FontAsset[]>([]);
  const [kb, setKb] = useState<KeyboardAsset | null>(null);
  const [form, setForm] = useState({
    name: '',
    tibetanName: '',
    description: '',
    layoutType: 'Sambhota QWERTY',
    script: 'Tibetan',
    version: '1.0.0',
    status: 'draft' as 'draft' | 'published',
    layoutJsonText: '',
    layoutJsonMacText: '',
    layoutJsonWindowsText: '',
    fontIds: [] as string[]
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.listFonts().then(setFonts).catch(() => undefined);
    if (!isNew && id) {
      adminApi
        .getKeyboard(id)
        .then((k) => {
          setKb(k);
          setForm({
            name: k.name,
            tibetanName: k.tibetanName,
            description: k.description,
            layoutType: k.layoutType,
            script: k.script,
            version: k.version,
            status: k.status,
            layoutJsonText: k.layoutJsonMac || k.layoutJson ? JSON.stringify(k.layoutJsonMac || k.layoutJson, null, 2) : '',
            layoutJsonMacText: k.layoutJsonMac || k.layoutJson ? JSON.stringify(k.layoutJsonMac || k.layoutJson, null, 2) : '',
            layoutJsonWindowsText: k.layoutJsonWindows ? JSON.stringify(k.layoutJsonWindows, null, 2) : '',
            fontIds: k.fontIds
          });
        })
        .catch((e) => setError(e.message));
    }
  }, [id, isNew]);

  const field = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm';
  const label = 'block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1';

  const save = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      let layoutJsonMac = null;
      let layoutJsonWindows = null;
      if (form.layoutJsonMacText.trim() || form.layoutJsonText.trim()) {
        layoutJsonMac = JSON.parse(form.layoutJsonMacText.trim() || form.layoutJsonText);
      }
      if (form.layoutJsonWindowsText.trim()) {
        layoutJsonWindows = JSON.parse(form.layoutJsonWindowsText);
      }
      const data = {
        name: form.name,
        tibetanName: form.tibetanName,
        description: form.description,
        layoutType: form.layoutType,
        script: form.script,
        version: form.version,
        status: form.status,
        layoutJson: layoutJsonMac,
        layoutJsonMac,
        layoutJsonWindows,
        fontIds: form.fontIds
      };
      if (isNew) {
        const created = await adminApi.createKeyboard(data);
        setMessage('Keyboard created');
        navigate(`/admin/keyboards/${created.id}`, { replace: true });
      } else if (id) {
        const updated = await adminApi.updateKeyboard(id, data);
        setKb(updated);
        setMessage('Saved');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id || isNew) {
      setError('Save the keyboard first, then upload a package.');
      return;
    }
    setUploading(true);
    try {
      const updated = await adminApi.uploadKeyboardFile(id, file);
      setKb(updated);
      setMessage('Keyboard package uploaded');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const toggleFont = (fontId: string) => {
    setForm((prev) => ({
      ...prev,
      fontIds: prev.fontIds.includes(fontId)
        ? prev.fontIds.filter((x) => x !== fontId)
        : [...prev.fontIds, fontId]
    }));
  };

  const layoutPreview = (() => {
    try {
      const text = form.layoutJsonMacText.trim() || form.layoutJsonWindowsText.trim() || form.layoutJsonText.trim();
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <Link
        to="/admin/keyboards"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to keyboards
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold">{isNew ? 'New keyboard' : 'Edit keyboard'}</h1>
          {kb && (
            <div className="mt-1">
              <StatusBadge status={kb.status} />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving || !form.name.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {message && <p className="mb-3 text-sm text-emerald-600">{message}</p>}
      {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
          <div>
            <label className={label}>Name</label>
            <input
              className={field}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className={label}>Tibetan name</label>
            <input
              className={`${field} tibetan-text`}
              value={form.tibetanName}
              onChange={(e) => setForm({ ...form, tibetanName: e.target.value })}
            />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea
              className={field}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Layout type</label>
              <input
                className={field}
                value={form.layoutType}
                onChange={(e) => setForm({ ...form, layoutType: e.target.value })}
              />
            </div>
            <div>
              <label className={label}>Script</label>
              <input
                className={field}
                value={form.script}
                onChange={(e) => setForm({ ...form, script: e.target.value })}
              />
            </div>
            <div>
              <label className={label}>Version</label>
              <input
                className={field}
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
              />
            </div>
            <div>
              <label className={label}>Status</label>
              <select
                className={field}
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as 'draft' | 'published' })
                }
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </div>
          </div>
          <div>
            <label className={label}>Mac layout JSON (KeyMap[][])</label>
            <textarea
              className={`${field} font-mono text-xs`}
              rows={8}
              value={form.layoutJsonMacText}
              onChange={(e) =>
                setForm({ ...form, layoutJsonMacText: e.target.value, layoutJsonText: e.target.value })
              }
              placeholder='Mac QWERTY mapping [[{"key":"q","char":"ཀ",...}]]'
            />
          </div>
          <div>
            <label className={label}>Windows layout JSON (KeyMap[][])</label>
            <textarea
              className={`${field} font-mono text-xs`}
              rows={8}
              value={form.layoutJsonWindowsText}
              onChange={(e) => setForm({ ...form, layoutJsonWindowsText: e.target.value })}
              placeholder="Windows QWERTY mapping. Leave empty to derive from Mac (adds \\ key)."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-2">Associate fonts</h2>
            <div className="max-h-56 overflow-y-auto space-y-1">
              {fonts.map((f) => (
                <label
                  key={f.id}
                  className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.fontIds.includes(f.id)}
                    onChange={() => toggleFont(f.id)}
                  />
                  <span>{f.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold">Keyboard package</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
              Optional package file stored under{' '}
              <code className="font-mono text-[11px]">server/uploads/keyboards</code>.
            </p>
            {kb?.fileUrl && (
              <p className="text-xs font-mono break-all text-blue-700 dark:text-blue-300">{kb.fileUrl}</p>
            )}
            <label
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 ${
                isNew ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading…' : 'Upload package (.zip)'}
              <input type="file" accept=".zip,.json,.kb*" className="hidden" onChange={onUpload} />
            </label>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-2">Layout preview</h2>
            {layoutPreview ? (
              <div className="space-y-1 overflow-x-auto">
                {(layoutPreview as { char: string; label: string }[][]).slice(0, 4).map((row, i) => (
                  <div key={i} className="flex gap-1">
                    {row.slice(0, 12).map((k, j) => (
                      <div
                        key={j}
                        className="w-9 h-10 rounded bg-slate-800 text-white flex flex-col items-center justify-center text-[10px]"
                      >
                        <span className="tibetan-text text-sm" style={{ wordBreak: 'normal' }}>
                          {k.char}
                        </span>
                        <span className="opacity-60">{k.label}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Paste valid layout JSON to preview keys.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
