import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Command, Monitor, Save, Upload } from 'lucide-react';
import { adminApi } from './api';
import type { FontAsset, KeyboardAsset } from '../types/cms';
import { StatusBadge } from './StatusBadge';
import { TibetanPhysicalKeyboard } from '../components/TibetanPhysicalKeyboard';
import { toWindowsKeyboardLayout, type KeyMap } from '../data/tibetanData';
import { isKeyMapLayout, type KeyboardOsLayout } from '../utils/keyboardLayout';

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
  const [importing, setImporting] = useState(false);
  const [pendingPackageFile, setPendingPackageFile] = useState<File | null>(null);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewOs, setPreviewOs] = useState<KeyboardOsLayout>('mac');
  const [previewShift, setPreviewShift] = useState(false);
  const [previewCaps, setPreviewCaps] = useState(false);

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
        if (pendingPackageFile) {
          await adminApi.uploadKeyboardFile(created.id, pendingPackageFile);
          setPendingPackageFile(null);
        }
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

  const applyImportResult = (
    data: Awaited<ReturnType<typeof adminApi.importKeyboardBundle>>
  ) => {
    setForm((prev) => ({
      ...prev,
      name: data.name,
      tibetanName: data.tibetanName,
      description: data.description,
      layoutType: data.layoutType,
      script: data.script,
      version: data.version,
      layoutJsonMacText: JSON.stringify(data.layoutJsonMac, null, 2),
      layoutJsonWindowsText: JSON.stringify(data.layoutJsonWindows, null, 2),
      layoutJsonText: JSON.stringify(data.layoutJsonMac, null, 2),
      fontIds: data.suggestedFontIds.length ? data.suggestedFontIds : prev.fontIds
    }));
    setImportSummary(
      `Loaded layout from ${data.keylayoutSource}. Matched ${data.suggestedFontIds.length} of ${data.fontFilenames.length} bundle fonts to the catalog.${
        data.warnings.length ? ` ${data.warnings.join(' ')}` : ''
      }`
    );
  };

  const onImportBundle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setError('');
    setMessage('');
    try {
      const data = await adminApi.importKeyboardBundle(file);
      applyImportResult(data);
      setPendingPackageFile(file);
      setMessage('Package imported — review the fields below, then Save.');
      if (!isNew && id) {
        const updated = await adminApi.uploadKeyboardFile(id, file);
        setKb(updated);
        setForm((prev) => ({
          ...prev,
          layoutJsonMacText: updated.layoutJsonMac
            ? JSON.stringify(updated.layoutJsonMac, null, 2)
            : prev.layoutJsonMacText,
          layoutJsonWindowsText: updated.layoutJsonWindows
            ? JSON.stringify(updated.layoutJsonWindows, null, 2)
            : prev.layoutJsonWindowsText
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isNew || !id) {
      void onImportBundle(e);
      return;
    }
    setUploading(true);
    try {
      const updated = await adminApi.uploadKeyboardFile(id, file);
      setKb(updated);
      if (updated.layoutJsonMac) {
        setForm((prev) => ({
          ...prev,
          layoutJsonMacText: JSON.stringify(updated.layoutJsonMac, null, 2),
          layoutJsonWindowsText: updated.layoutJsonWindows
            ? JSON.stringify(updated.layoutJsonWindows, null, 2)
            : prev.layoutJsonWindowsText,
          version: updated.version,
          description: updated.description
        }));
      }
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

  const previewLayout = useMemo((): KeyMap[][] | null => {
    const parseLayout = (text: string): KeyMap[][] | null => {
      const trimmed = text.trim();
      if (!trimmed) return null;
      try {
        const parsed: unknown = JSON.parse(trimmed);
        return isKeyMapLayout(parsed) ? parsed : null;
      } catch {
        return null;
      }
    };
    const mac =
      parseLayout(form.layoutJsonMacText) ?? parseLayout(form.layoutJsonText);
    const windows = parseLayout(form.layoutJsonWindowsText);
    if (previewOs === 'windows') {
      if (windows) return windows;
      if (mac) return toWindowsKeyboardLayout(mac);
      return null;
    }
    if (mac) return mac;
    return windows;
  }, [form.layoutJsonMacText, form.layoutJsonWindowsText, form.layoutJsonText, previewOs]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
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
      {importSummary && (
        <p className="mb-3 text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
          {importSummary}
        </p>
      )}

      <div className="mb-6 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Import Monlam Bodyig package</h2>
        <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
          Upload the Mac or full Bodyig <strong>.zip</strong> (for example{' '}
          <code className="font-mono text-[11px]">Monlam.Bodyig.5.0.0.Mac</code>). We read the keyboard layout,
          version, and font list from the bundle — no manual JSON needed.
        </p>
        <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer">
          <Upload className="w-4 h-4" />
          {importing ? 'Reading package…' : 'Choose Bodyig .zip'}
          <input
            type="file"
            accept=".zip,.keylayout,.keylayout.xml"
            className="hidden"
            onChange={onImportBundle}
          />
        </label>
        {pendingPackageFile && isNew && (
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Package file will be stored when you click Save ({pendingPackageFile.name}).
          </p>
        )}
      </div>

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
          <details className="rounded-lg border border-gray-200 dark:border-slate-700 p-3">
            <summary className="text-xs font-medium text-gray-600 dark:text-slate-400 cursor-pointer select-none">
              Advanced: edit layout JSON manually
            </summary>
            <div className="mt-3 space-y-3">
              <div>
                <label className={label}>Mac layout (auto-filled from package)</label>
                <textarea
                  className={`${field} font-mono text-xs`}
                  rows={6}
                  value={form.layoutJsonMacText}
                  onChange={(e) =>
                    setForm({ ...form, layoutJsonMacText: e.target.value, layoutJsonText: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={label}>Windows layout (derived from Mac)</label>
                <textarea
                  className={`${field} font-mono text-xs`}
                  rows={6}
                  value={form.layoutJsonWindowsText}
                  onChange={(e) => setForm({ ...form, layoutJsonWindowsText: e.target.value })}
                />
              </div>
            </div>
          </details>
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
            <h2 className="text-sm font-semibold">Stored download package</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              After import, the same .zip is saved for public download when you Save (new) or re-import on an existing
              keyboard.
            </p>
            {kb?.fileUrl && (
              <p className="text-xs font-mono break-all text-blue-700 dark:text-blue-300">{kb.fileUrl}</p>
            )}
            {!isNew && (
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading…' : 'Replace stored .zip'}
                <input type="file" accept=".zip,.keylayout,.keylayout.xml" className="hidden" onChange={onUpload} />
              </label>
            )}
          </div>

        </div>
      </div>

      <div className="mt-6 bg-[#eef5fc] dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Layout preview</h2>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
              Same physical keyboard as Typing Practice — toggle Shift, Caps Lock, and Mac vs Windows.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewShift((s) => !s)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                previewShift
                  ? 'bg-amber-400 border-amber-500 text-slate-950'
                  : 'bg-white border-gray-300 text-gray-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
              }`}
            >
              Shift {previewShift ? 'on' : 'off'}
            </button>
            <button
              type="button"
              onClick={() => setPreviewCaps((c) => !c)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                previewCaps
                  ? 'bg-amber-400 border-amber-500 text-slate-950'
                  : 'bg-white border-gray-300 text-gray-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
              }`}
            >
              Caps {previewCaps ? 'on' : 'off'}
            </button>
            <div className="flex items-center rounded-lg border border-gray-300 p-0.5 bg-white dark:border-slate-600 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => setPreviewOs('windows')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                  previewOs === 'windows'
                    ? 'bg-sky-500 text-white'
                    : 'text-gray-600 dark:text-slate-300'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Windows
              </button>
              <button
                type="button"
                onClick={() => setPreviewOs('mac')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                  previewOs === 'mac' ? 'bg-sky-500 text-white' : 'text-gray-600 dark:text-slate-300'
                }`}
              >
                <Command className="w-3.5 h-3.5" />
                Mac
              </button>
            </div>
          </div>
        </div>
        {previewLayout ? (
          <TibetanPhysicalKeyboard
            keyboardLayout={previewLayout}
            shiftPressed={previewShift}
            capsLock={previewCaps}
            onToggleShift={() => setPreviewShift((s) => !s)}
            onToggleCaps={() => setPreviewCaps((c) => !c)}
            size="default"
            showSpaceNote
          />
        ) : (
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Import a Bodyig package (or paste valid layout JSON under Advanced) to preview the keyboard here.
          </p>
        )}
      </div>
    </div>
  );
}
