import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Save, ChevronDown, Plus } from 'lucide-react';
import { adminApi } from './api';
import type { FontAsset, KeyboardAsset, PresetAsset } from '../types/cms';
import type { FontKind, FontPresetConfig } from '../types/font';
import { FontPreview } from './FontPreview';
import { StatusBadge } from './StatusBadge';

const CATEGORIES = ['Uchen', 'Umê', 'Drutsa', 'Tsugring', 'Petsug', 'Modern', 'Standard'] as const;

function configsFromPresets(presets: PresetAsset[], existing: FontPresetConfig[] = []): FontPresetConfig[] {
  return presets.map((p) => {
    const found = existing.find((c) => c.presetId === p.id);
    return {
      presetId: p.id,
      enabled: found ? found.enabled : true,
      contentOverride: found?.contentOverride ?? null,
      excludedChars: found?.excludedChars ?? ''
    };
  });
}

const emptyForm = {
  name: '',
  tibetanName: '',
  category: 'Uchen' as (typeof CATEGORIES)[number],
  fontKind: 'normal' as FontKind,
  designer: '',
  releaseYear: String(new Date().getFullYear()),
  version: '1.0.0',
  description: '',
  tibetanDescription: '',
  sampleText: 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ། བོད་ཀྱི་ཡི་གེ་ནི་འཛམ་གླིང་གི་རིག་གཞུང་བང་མཛོད་ཆེན་པོ་ཞིག་ཡིན།',
  tags: '',
  supportedScripts: 'Tibetan',
  features: '',
  stylesCount: 1,
  weights: '400',
  status: 'draft' as 'draft' | 'published',
  keyboardId: '' as string,
  filename: ''
};

export function FontEditorPage() {
  const { id } = useParams();
  const isNew = id === 'new' || !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [font, setFont] = useState<FontAsset | null>(null);
  const [keyboards, setKeyboards] = useState<KeyboardAsset[]>([]);
  const [presets, setPresets] = useState<PresetAsset[]>([]);
  const [presetConfigs, setPresetConfigs] = useState<FontPresetConfig[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [presetRulesOpen, setPresetRulesOpen] = useState(false);
  const [showAddCustomPreset, setShowAddCustomPreset] = useState(false);
  const [addingCustomPreset, setAddingCustomPreset] = useState(false);
  const [customPresetForm, setCustomPresetForm] = useState({
    title: '',
    tibetanTitle: '',
    content: ''
  });

  useEffect(() => {
    let cancelled = false;

    adminApi.listKeyboards().then(setKeyboards).catch(() => undefined);

    const load = async () => {
      try {
        const [presetList, fontAsset] = await Promise.all([
          adminApi.listPresets().catch(() => [] as PresetAsset[]),
          !isNew && id ? adminApi.getFont(id) : Promise.resolve(null)
        ]);
        if (cancelled) return;

        setPresets(presetList);

        if (fontAsset) {
          setFont(fontAsset);
          setForm({
            name: fontAsset.name,
            tibetanName: fontAsset.tibetanName,
            category: fontAsset.category as (typeof CATEGORIES)[number],
            fontKind: fontAsset.fontKind || 'normal',
            designer: fontAsset.designer,
            releaseYear: fontAsset.releaseYear,
            version: fontAsset.version,
            description: fontAsset.description,
            tibetanDescription: fontAsset.tibetanDescription,
            sampleText: fontAsset.sampleText,
            tags: fontAsset.tags.join(', '),
            supportedScripts: fontAsset.supportedScripts.join(', '),
            features: fontAsset.features.join(', '),
            stylesCount: fontAsset.stylesCount,
            weights: fontAsset.weights.join(', '),
            status: fontAsset.status,
            keyboardId: fontAsset.keyboardId || '',
            filename: fontAsset.filename
          });
          setPresetConfigs(configsFromPresets(presetList, fontAsset.presetConfigs || []));
        } else {
          setPresetConfigs(configsFromPresets(presetList));
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  const set =
    (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = key === 'stylesCount' ? Number(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const updatePresetConfig = (presetId: string, patch: Partial<FontPresetConfig>) => {
    setPresetConfigs((prev) =>
      prev.map((c) => (c.presetId === presetId ? { ...c, ...patch } : c))
    );
  };

  const addCustomPreset = async () => {
    const title = customPresetForm.title.trim();
    const content = customPresetForm.content.trim();
    if (!title || !content) {
      setError('Custom preset needs a title and sample content.');
      return;
    }
    setAddingCustomPreset(true);
    setError('');
    setMessage('');
    try {
      const created = await adminApi.createPreset({
        title,
        tibetanTitle: customPresetForm.tibetanTitle.trim(),
        content,
        translation: `Custom preset for ${form.name || 'special font'}`,
        status: 'published'
      });
      const nextPresets = [...presets.filter((p) => p.id !== created.id), created].sort(
        (a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title)
      );
      const nextConfigs: FontPresetConfig[] = [
        ...presetConfigs.filter((c) => c.presetId !== created.id),
        {
          presetId: created.id,
          enabled: true,
          contentOverride: null,
          excludedChars: ''
        }
      ];
      setPresets(nextPresets);
      setPresetConfigs(nextConfigs);
      setCustomPresetForm({ title: '', tibetanTitle: '', content: '' });
      setShowAddCustomPreset(false);

      if (!isNew && id) {
        const updated = await adminApi.updateFont(id, {
          ...payload(),
          fontKind: 'special',
          presetConfigs: nextConfigs
        });
        setFont(updated);
        setPresetConfigs(configsFromPresets(nextPresets, updated.presetConfigs || []));
        setMessage(`Custom preset “${created.title}” added and saved for this font.`);
      } else {
        setMessage(`Custom preset “${created.title}” added. Save the font to keep the link.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add custom preset');
    } finally {
      setAddingCustomPreset(false);
    }
  };

  const payload = () => ({
    name: form.name,
    tibetanName: form.tibetanName,
    category: form.category,
    fontKind: form.fontKind,
    designer: form.designer,
    releaseYear: form.releaseYear,
    version: form.version,
    description: form.description,
    tibetanDescription: form.tibetanDescription,
    sampleText: form.sampleText,
    tags: form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    supportedScripts: form.supportedScripts
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    features: form.features
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    stylesCount: form.stylesCount,
    weights: form.weights
      .split(',')
      .map((t) => Number(t.trim()))
      .filter((n) => !Number.isNaN(n)),
    status: form.status,
    keyboardId: form.keyboardId || null,
    filename: form.filename || undefined,
    presetConfigs: form.fontKind === 'special' ? presetConfigs : []
  });

  const save = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      if (isNew) {
        const created = await adminApi.createFont(payload());
        setMessage('Font created');
        navigate(`/admin/fonts/${created.id}`, { replace: true });
      } else if (id) {
        const updated = await adminApi.updateFont(id, payload());
        setFont(updated);
        setPresetConfigs(configsFromPresets(presets, updated.presetConfigs || []));
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
      setError('Save the font first, then upload a file.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const updated = await adminApi.uploadFontFile(id, file);
      setFont(updated);
      setForm((f) => ({ ...f, filename: updated.filename }));
      setMessage('Font file uploaded');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const field = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm';
  const label = 'block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1';

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <Link
        to="/admin/fonts"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to fonts
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold">{isNew ? 'New font' : 'Edit font'}</h1>
          {font && (
            <div className="mt-1">
              <StatusBadge status={font.status} />
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className={label}>Name</label>
              <input className={field} value={form.name} onChange={set('name')} required />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Tibetan name</label>
              <input className={`${field} tibetan-text`} value={form.tibetanName} onChange={set('tibetanName')} />
            </div>
            <div>
              <label className={label}>Category</label>
              <select className={field} value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Status</label>
              <select className={field} value={form.status} onChange={set('status')}>
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Font kind</label>
              <select className={field} value={form.fontKind} onChange={set('fontKind')}>
                <option value="normal">Normal — full preset support</option>
                <option value="special">Special — custom preset rules</option>
              </select>
            </div>
            <div>
              <label className={label}>Designer</label>
              <input className={field} value={form.designer} onChange={set('designer')} />
            </div>
            <div>
              <label className={label}>Version</label>
              <input className={field} value={form.version} onChange={set('version')} />
            </div>
            <div>
              <label className={label}>Release year</label>
              <input className={field} value={form.releaseYear} onChange={set('releaseYear')} />
            </div>
            <div>
              <label className={label}>Styles count</label>
              <input
                type="number"
                min={1}
                className={field}
                value={form.stylesCount}
                onChange={set('stylesCount')}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Supported scripts (comma-separated)</label>
              <input className={field} value={form.supportedScripts} onChange={set('supportedScripts')} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Tags (comma-separated)</label>
              <input className={field} value={form.tags} onChange={set('tags')} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Features (comma-separated)</label>
              <input className={field} value={form.features} onChange={set('features')} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Weights (comma-separated numbers)</label>
              <input className={field} value={form.weights} onChange={set('weights')} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Associated keyboard</label>
              <select className={field} value={form.keyboardId} onChange={set('keyboardId')}>
                <option value="">None</option>
                {keyboards.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Description</label>
              <textarea className={field} rows={3} value={form.description} onChange={set('description')} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Tibetan description</label>
              <textarea
                className={`${field} tibetan-text`}
                rows={2}
                value={form.tibetanDescription}
                onChange={set('tibetanDescription')}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Fallback sample text</label>
              <textarea
                className={`${field} tibetan-text`}
                rows={2}
                value={form.sampleText}
                onChange={set('sampleText')}
              />
              <p className="mt-1 text-[11px] text-gray-500 dark:text-slate-400">
                Used when a preset has no content for this font. For special fonts, prefer per-preset
                content overrides in Preset rules.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-3">Live preview</h2>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 min-h-[120px]">
              <FontPreview
                family={font?.name || form.name || 'Preview Font'}
                fileUrl={font?.fileUrl}
                sample={form.sampleText}
              />
            </div>
          </div>

          {form.fontKind === 'special' && (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
              <button
                type="button"
                onClick={() => setPresetRulesOpen((open) => !open)}
                aria-expanded={presetRulesOpen}
                className="w-full flex items-start justify-between gap-3 text-left group"
              >
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Preset rules
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    Enable existing presets or add a custom preset for this special font.
                    {!presetRulesOpen && presets.length > 0 && (
                      <span className="ml-1 text-gray-400 dark:text-slate-500">
                        ({presets.length} presets)
                      </span>
                    )}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 mt-0.5 text-gray-400 dark:text-slate-500 transition-transform ${
                    presetRulesOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>
              {presetRulesOpen && (
                <div className="space-y-3">
                  {showAddCustomPreset ? (
                    <div className="rounded-lg border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 p-3 space-y-2">
                      <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                        New custom preset
                      </p>
                      <div>
                        <label className={label}>Title</label>
                        <input
                          className={field}
                          value={customPresetForm.title}
                          onChange={(e) =>
                            setCustomPresetForm((f) => ({ ...f, title: e.target.value }))
                          }
                          placeholder="e.g. Lanza sample"
                        />
                      </div>
                      <div>
                        <label className={label}>Tibetan title (optional)</label>
                        <input
                          className={`${field} tibetan-text`}
                          value={customPresetForm.tibetanTitle}
                          onChange={(e) =>
                            setCustomPresetForm((f) => ({ ...f, tibetanTitle: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className={label}>Sample content</label>
                        <textarea
                          className={`${field} tibetan-text`}
                          rows={3}
                          value={customPresetForm.content}
                          onChange={(e) =>
                            setCustomPresetForm((f) => ({ ...f, content: e.target.value }))
                          }
                          placeholder="Characters supported by this special font"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={addCustomPreset}
                          disabled={addingCustomPreset}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {addingCustomPreset ? 'Adding…' : 'Add preset'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddCustomPreset(false);
                            setCustomPresetForm({ title: '', tibetanTitle: '', content: '' });
                          }}
                          disabled={addingCustomPreset}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddCustomPreset(true)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-slate-600 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add custom preset
                    </button>
                  )}

                  {presets.length === 0 && !showAddCustomPreset && (
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      No presets yet. Add a custom preset above, or create one under Admin → Presets.
                    </p>
                  )}

                  {presets.map((preset) => {
                    const cfg =
                      presetConfigs.find((c) => c.presetId === preset.id) ||
                      configsFromPresets([preset])[0];
                    return (
                      <div
                        key={preset.id}
                        className="rounded-lg border border-gray-200 dark:border-slate-700 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{preset.title}</p>
                            {preset.tibetanTitle && (
                              <p className="text-xs tibetan-text text-gray-500 dark:text-slate-400 truncate">
                                {preset.tibetanTitle}
                              </p>
                            )}
                          </div>
                          <label className="inline-flex items-center gap-1.5 text-xs shrink-0">
                            <input
                              type="checkbox"
                              checked={cfg.enabled}
                              onChange={(e) =>
                                updatePresetConfig(preset.id, { enabled: e.target.checked })
                              }
                            />
                            Enabled
                          </label>
                        </div>
                        <div>
                          <label className={label}>Content override</label>
                          <textarea
                            className={`${field} tibetan-text`}
                            rows={2}
                            placeholder="Leave empty to use the global preset content"
                            value={cfg.contentOverride ?? ''}
                            onChange={(e) =>
                              updatePresetConfig(preset.id, {
                                contentOverride: e.target.value.trim() ? e.target.value : null
                              })
                            }
                            disabled={!cfg.enabled}
                          />
                        </div>
                        <div>
                          <label className={label}>Excluded characters</label>
                          <input
                            className={`${field} tibetan-text`}
                            placeholder="Characters to strip from effective preset text"
                            value={cfg.excludedChars}
                            onChange={(e) =>
                              updatePresetConfig(preset.id, { excludedChars: e.target.value })
                            }
                            disabled={!cfg.enabled}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold">Font file</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Upload `.ttf` / `.otf` (~2&nbsp;MB). Stored in the project under{' '}
              <code className="font-mono text-[11px]">server/uploads/fonts</code> and served at{' '}
              <code className="font-mono text-[11px]">/uploads/…</code>.
            </p>
            {font?.fileUrl && (
              <p className="text-xs font-mono break-all text-blue-700 dark:text-blue-300">{font.fileUrl}</p>
            )}
            <label
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 ${
                isNew ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading…' : 'Upload font file'}
              <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={onUpload} />
            </label>
            {isNew && (
              <p className="text-xs text-amber-700 dark:text-amber-300">Save the font record before uploading.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
