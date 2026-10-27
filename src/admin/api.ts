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
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed (${res.status})`);
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
  uploadKeyboardFile: async (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request<KeyboardAsset>(`/api/admin/keyboards/${id}/upload`, {
      method: 'POST',
      body: form
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
