/** Sidebar filter: `All` or a script style id from CMS (`fonts.category`). */
export type FontCategory = 'All' | string;

export interface FontMetrics {
  ascenderRatio: number; // relative height for superscripts & top vowels
  descenderRatio: number; // depth for subjoined consonants & bottom vowels
  strokeContrast: 'High' | 'Medium' | 'Low' | 'Monoline';
  strokeType: 'Calligraphic Reed Pen' | 'Chiseled Brush' | 'Modern Geometric' | 'Cursive Pen' | 'Traditional Woodblock';
  spacing: 'Standard' | 'Compact' | 'Expansive';
}

export type FontKind = 'normal' | 'special';

export interface FontPresetConfig {
  presetId: string;
  enabled: boolean;
  /** When set, replaces the global preset content for this font */
  contentOverride: string | null;
  /** Characters to strip from the effective preset text (Unicode code points) */
  excludedChars: string;
}

export interface FontItem {
  id: string;
  name: string;
  tibetanName: string;
  category: string;
  /** Normal = full preset support; Special = per-font preset exceptions */
  fontKind?: FontKind;
  designer: string;
  releaseYear: string;
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
  /** Present when a font file is stored locally via CMS (/uploads/…) */
  fileUrl?: string | null;
  version?: string;
  supportedScripts?: string[];
  keyboardId?: string | null;
  presetConfigs?: FontPresetConfig[];
}

export interface PresetText {
  id: string;
  title: string;
  tibetanTitle: string;
  content: string;
  translation: string;
  sortOrder?: number;
  status?: 'draft' | 'published';
}

export interface SyllableComponent {
  id: string;
  name: string;
  tibetanName: string;
  wylieName: string;
  char: string;
  color: string;
  description: string;
  rule: string;
  position: 'prefix' | 'superscript' | 'root' | 'subscript' | 'vowel' | 'suffix' | 'postsuffix';
}

export interface TypingDrill {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  description: string;
  targetText: string;
  wylieGuide: string;
  hint: string;
}
