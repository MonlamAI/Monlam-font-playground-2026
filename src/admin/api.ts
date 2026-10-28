import type {
  FontAsset,
  KeyboardAsset,
  FontAssetInput,
  KeyboardAssetInput,
  PresetAsset,
  PresetAssetInput,
  ScriptStyleAsset,
  ScriptStyleAssetInput
} from '../types/cms';
import type { FontPresetConfig } from '../types/font';
import type { PublicSiteSettings } from '../types/siteSettings';
import {
  requestFormDataWithProgress,
  httpUploadErrorMessage,
  CLOUDFLARE_SAFE_UPLOAD_BYTES,
  formatUploadBytes,
  LARGE_PACKAGE_UPLOAD_HINT,
  type FormUploadProgress
} from './uploadProgress';
import {
  buildBodyigStorageZip,
  parseKeyboardBundleBytes,
  type KeyboardBundleImportResult as ParsedBundle
} from '../lib/keyboardBundleParse';

export type PreparedKeyboardPackage = {
  file: File;
  /** True when font binaries were stripped for CDN upload limits */
  slimmed: boolean;
};

export type { FormUploadProgress };

export type KeyboardBundleImportResult = {
  name: string;
  tibetanName: string;
  description: string;
  version: string;
  layoutType: string;
  script: string;
  layoutJsonMac: import('../data/tibetanData').KeyMap[][];
  layoutJsonWindows: import('../data/tibetanData').KeyMap[][];
  fontFilenames: string[];
  suggestedFontIds: string[];
  keylayoutSource: string;
  warnings: string[];
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers
    }
  });
  if (!res.ok) {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(
        err.error || httpUploadErrorMessage(res.status, res.statusText)
      );
    }
    const text = (await res.text()).replace(/\s+/g, ' ').trim();
    throw new Error(httpUploadErrorMessage(res.status, text || res.statusText));
  }
  return res.json() as Promise<T>;
}

export const adminApi = {
  me: () => request<{ authenticated: boolean; email: string | null }>('/api/admin/me'),
  login: (email: string, password: string) =>
    request<{ ok: boolean }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  logout: () => request<{ ok: boolean }>('/api/admin/logout', { method: 'POST' }),
  stats: () =>
    request<{
      fonts: number;
      publishedFonts: number;
      draftFonts: number;
      keyboards: number;
      publishedKeyboards: number;
      draftKeyboards: number;
      feedback: number;
      newFeedback: number;
    }>('/api/admin/stats'),
  siteSettings: () => request<PublicSiteSettings>('/api/admin/site-settings'),
  updateSiteSettings: (data: Partial<PublicSiteSettings>) =>
    request<PublicSiteSettings>('/api/admin/site-settings', {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  listFonts: () => request<FontAsset[]>('/api/admin/fonts'),
  getFont: (id: string) => request<FontAsset>(`/api/admin/fonts/${id}`),
  createFont: (data: FontAssetInput) =>
    request<FontAsset>('/api/admin/fonts', { method: 'POST', body: JSON.stringify(data) }),
  updateFont: (id: string, data: Partial<FontAssetInput>) =>
    request<FontAsset>(`/api/admin/fonts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  publishFont: (id: string, status: 'draft' | 'published') =>
    request<FontAsset>(`/api/admin/fonts/${id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  deleteFont: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/fonts/${id}`, { method: 'DELETE' }),
  uploadFontFile: async (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request<FontAsset>(`/api/admin/fonts/${id}/upload`, { method: 'POST', body: form });
  },
  setFontKeyboard: (id: string, keyboardId: string | null) =>
    request<FontAsset>(`/api/admin/fonts/${id}/keyboard`, {
      method: 'PUT',
      body: JSON.stringify({ keyboardId })
    }),
  listKeyboards: () => request<KeyboardAsset[]>('/api/admin/keyboards'),
  getKeyboard: (id: string) => request<KeyboardAsset>(`/api/admin/keyboards/${id}`),
  createKeyboard: (data: KeyboardAssetInput) =>
    request<KeyboardAsset>('/api/admin/keyboards', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateKeyboard: (id: string, data: Partial<KeyboardAssetInput>) =>
    request<KeyboardAsset>(`/api/admin/keyboards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  publishKeyboard: (id: string, status: 'draft' | 'published') =>
    request<KeyboardAsset>(`/api/admin/keyboards/${id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  deleteKeyboard: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/keyboards/${id}`, { method: 'DELETE' }),
  prepareKeyboardPackageUpload: async (
    file: File,
    onProgress?: (progress: FormUploadProgress) => void
  ): Promise<PreparedKeyboardPackage> => {
    const lower = file.name.toLowerCase();
    if (file.size <= CLOUDFLARE_SAFE_UPLOAD_BYTES || !lower.endsWith('.zip')) {
      return { file, slimmed: false };
    }
    onProgress?.({ phase: 'local', loaded: 0, total: file.size, percent: 0 });
    const blob = await buildBodyigStorageZip(await file.arrayBuffer());
    if (blob.size > CLOUDFLARE_SAFE_UPLOAD_BYTES) {
      throw new Error(
        `Keyboard package is still ${formatUploadBytes(blob.size)} without fonts. ${LARGE_PACKAGE_UPLOAD_HINT}`
      );
    }
    const base = file.name.replace(/\.zip$/i, '') || 'bodyig';
    const slimFile = new File([blob], `${base}-keyboard-layout.zip`, {
      type: 'application/zip'
    });
    return { file: slimFile, slimmed: true };
  },
  uploadKeyboardFile: async (
    id: string,
    file: File,
    onProgress?: (progress: FormUploadProgress) => void
  ) => {
    const prepared = await adminApi.prepareKeyboardPackageUpload(file, onProgress);
    onProgress?.({
      phase: 'uploading',
      loaded: 0,
      total: prepared.file.size,
      percent: 0
    });
    const form = new FormData();
    form.append('file', prepared.file);
    const asset = await requestFormDataWithProgress<KeyboardAsset>(
      `/api/admin/keyboards/${id}/upload`,
      form,
      onProgress
    );
    return { asset, slimmed: prepared.slimmed };
  },
  importKeyboardBundle: async (
    file: File,
    onProgress?: (progress: FormUploadProgress) => void
  ) => {
    onProgress?.({ phase: 'local', loaded: 0, total: file.size, percent: 0 });
    const parsed: ParsedBundle = await parseKeyboardBundleBytes(
      await file.arrayBuffer(),
      file.name
    );
    onProgress?.({ phase: 'processing', loaded: file.size, total: file.size, percent: 100 });
    return request<KeyboardBundleImportResult>('/api/admin/keyboards/import-parsed', {
      method: 'POST',
      body: JSON.stringify(parsed)
    });
  },
  listFeedback: (status?: string) =>
    request<import('../types/feedback').FeedbackItem[]>(
      `/api/admin/feedback${status ? `?status=${encodeURIComponent(status)}` : ''}`
    ),
  getFeedback: (id: string) =>
    request<import('../types/feedback').FeedbackItem>(`/api/admin/feedback/${id}`),
  updateFeedbackStatus: (id: string, status: 'new' | 'reviewed' | 'archived') =>
    request<import('../types/feedback').FeedbackItem>(`/api/admin/feedback/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  deleteFeedback: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/feedback/${id}`, { method: 'DELETE' }),

  listPresets: () => request<PresetAsset[]>('/api/admin/presets'),
  getPreset: (id: string) => request<PresetAsset>(`/api/admin/presets/${id}`),
  createPreset: (data: PresetAssetInput) =>
    request<PresetAsset>('/api/admin/presets', { method: 'POST', body: JSON.stringify(data) }),
  updatePreset: (id: string, data: Partial<PresetAssetInput>) =>
    request<PresetAsset>(`/api/admin/presets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deletePreset: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/presets/${id}`, { method: 'DELETE' }),
  saveFontPresetConfigs: (fontId: string, presetConfigs: FontPresetConfig[]) =>
    request<FontAsset>(`/api/admin/fonts/${fontId}/preset-configs`, {
      method: 'PUT',
      body: JSON.stringify({ presetConfigs })
    }),

  listScriptStyles: () => request<ScriptStyleAsset[]>('/api/admin/script-styles'),
  createScriptStyle: (data: ScriptStyleAssetInput) =>
    request<ScriptStyleAsset>('/api/admin/script-styles', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateScriptStyle: (id: string, data: Partial<ScriptStyleAssetInput> & { newId?: string }) =>
    request<ScriptStyleAsset>(`/api/admin/script-styles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteScriptStyle: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/script-styles/${id}`, { method: 'DELETE' }),
  assignFontsToScriptStyle: (styleId: string, fontIds: string[]) =>
    request<{ styleId: string; fonts: FontAsset[] }>(`/api/admin/script-styles/${styleId}/fonts`, {
      method: 'PUT',
      body: JSON.stringify({ fontIds })
    })
};

export const publicApi = {
  fonts: () => request<FontAsset[]>('/api/fonts?published=1'),
  keyboards: () => request<KeyboardAsset[]>('/api/keyboards?published=1'),
  presets: () => request<PresetAsset[]>('/api/presets?published=1'),
  scriptStyles: () => request<ScriptStyleAsset[]>('/api/script-styles')
};
