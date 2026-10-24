import { FontKind, FontMetrics, FontPresetConfig, PresetText } from './font';
import type { KeyMap } from '../data/tibetanData';

export type PublishStatus = 'draft' | 'published';

export interface PresetAsset extends PresetText {
  sortOrder: number;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptStyleAsset {
  id: string;
  name: string;
  tibetanName: string;
  sortOrder: number;
  fontCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptStyleAssetInput {
  id?: string;
  name: string;
  tibetanName?: string;
  sortOrder?: number;
}

export interface PresetAssetInput {
  id?: string;
  title: string;
  tibetanTitle?: string;
  content: string;
  translation?: string;
  sortOrder?: number;
  status?: PublishStatus;
}

export interface FontAsset {
  id: string;
  name: string;
  tibetanName: string;
  category: string;
  fontKind: FontKind;
  designer: string;
  releaseYear: string;
  version: string;
  description: string;
  tibetanDescription: string;
  cssClass: string;
  stylesCount: number;
  weights: number[];
  features: string[];
  fileSize: string;
  filename: string;
  sampleText: string;
  tags: string[];
  metrics: FontMetrics;
  supportedScripts: string[];
  status: PublishStatus;
  s3Key: string | null;
  fileUrl: string | null;
  keyboardId: string | null;
  presetConfigs: FontPresetConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface KeyboardAsset {
  id: string;
  name: string;
  tibetanName: string;
  description: string;
  layoutType: string;
  script: string;
  version: string;
  status: PublishStatus;
  s3Key: string | null;
  fileUrl: string | null;
  layoutJson: KeyMap[][] | null;
  layoutJsonMac: KeyMap[][] | null;
  layoutJsonWindows: KeyMap[][] | null;
  fontIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FontAssetInput {
  name: string;
  tibetanName?: string;
  category?: string;
  fontKind?: FontKind;
  designer?: string;
  releaseYear?: string;
  version?: string;
  description?: string;
  tibetanDescription?: string;
  cssClass?: string;
  stylesCount?: number;
  weights?: number[];
  features?: string[];
  filename?: string;
  sampleText?: string;
  tags?: string[];
  metrics?: Partial<FontMetrics>;
  supportedScripts?: string[];
  status?: PublishStatus;
  keyboardId?: string | null;
  presetConfigs?: FontPresetConfig[];
}

export interface KeyboardAssetInput {
  name: string;
  tibetanName?: string;
  description?: string;
  layoutType?: string;
  script?: string;
  version?: string;
  status?: PublishStatus;
  layoutJson?: KeyMap[][] | null;
  layoutJsonMac?: KeyMap[][] | null;
  layoutJsonWindows?: KeyMap[][] | null;
  fontIds?: string[];
}
