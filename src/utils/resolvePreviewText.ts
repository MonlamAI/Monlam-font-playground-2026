import type { PresetText, FontItem, FontPresetConfig } from '../types/font';

/** Strip excluded Unicode characters from text. */
export function applyExcludedChars(text: string, excludedChars?: string | null): string {
  if (!excludedChars) return text;
  const chars = [...excludedChars].filter((ch) => ch.trim().length > 0);
  if (chars.length === 0) return text;
  let out = text;
  for (const ch of chars) {
    out = out.split(ch).join('');
  }
  return out.replace(/  +/g, ' ').trim();
}

function contentForConfig(
  config: FontPresetConfig | undefined,
  preset: PresetText | undefined,
  fallback: string
): string {
  const base =
    (config?.contentOverride && config.contentOverride.trim()) ||
    preset?.content ||
    fallback;
  return applyExcludedChars(base, config?.excludedChars);
}

/**
 * Resolve the preview sample text for a specific font + active preset.
 * - `custom`: each font's own sampleText
 * - Normal fonts: global preset (optional per-font override/exclusions)
 * - Special fonts: only enabled presets; otherwise first enabled or sampleText
 */
export function resolveFontPreviewText(
  font: FontItem,
  activePresetId: string,
  presets: PresetText[],
  globalPreviewText: string
): string {
  if (activePresetId === 'custom') {
    return font.sampleText || globalPreviewText;
  }

  const configs = font.presetConfigs || [];
  const preset = presets.find((p) => p.id === activePresetId);
  const config = configs.find((c) => c.presetId === activePresetId);
  const kind = font.fontKind || 'normal';

  if (kind === 'special' && configs.length > 0) {
    if (config?.enabled) {
      return contentForConfig(config, preset, globalPreviewText);
    }
    const firstEnabled = configs.find((c) => c.enabled);
    if (firstEnabled) {
      const alt = presets.find((p) => p.id === firstEnabled.presetId);
      return contentForConfig(firstEnabled, alt, font.sampleText || globalPreviewText);
    }
    return font.sampleText || globalPreviewText;
  }

  return contentForConfig(config, preset, globalPreviewText);
}

export function isPresetEnabledForFont(font: FontItem, presetId: string): boolean {
  if (presetId === 'custom') return true;
  const kind = font.fontKind || 'normal';
  const configs = font.presetConfigs || [];
  if (kind !== 'special' || configs.length === 0) return true;
  const config = configs.find((c) => c.presetId === presetId);
  return Boolean(config?.enabled);
}

export type SpecialPresetOption = PresetText & { customized?: boolean };

/**
 * Custom sidebar options for visible special fonts:
 * presets enabled on at least one special font (override text when set).
 */
export function getSpecialPresetOptions(
  fonts: FontItem[],
  allPresets: PresetText[]
): SpecialPresetOption[] {
  const special = fonts.filter((f) => (f.fontKind || 'normal') === 'special');
  if (special.length === 0) return [];

  const enabledIds = new Set<string>();
  const overrideByPreset = new Map<string, string>();

  for (const font of special) {
    const configs = font.presetConfigs || [];
    if (configs.length === 0) continue;
    for (const c of configs) {
      if (!c.enabled) continue;
      enabledIds.add(c.presetId);
      if (c.contentOverride?.trim() && !overrideByPreset.has(c.presetId)) {
        overrideByPreset.set(c.presetId, c.contentOverride.trim());
      }
    }
  }

  if (enabledIds.size === 0) return [];

  return allPresets
    .filter((p) => enabledIds.has(p.id))
    .map((p) => {
      const override = overrideByPreset.get(p.id);
      return {
        ...p,
        content: override || p.content,
        customized: Boolean(override)
      };
    });
}
