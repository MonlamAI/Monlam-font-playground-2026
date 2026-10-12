/**
 * Tibetan Unicode Typing & Comparison Engine
 * Handles normalization, grapheme clustering, syllable extraction, and stack analysis.
 */

export const TSEK = '་'; // U+0F0B
export const SHAD = '།'; // U+0F0D
export const NYIS_SHAD = '༎'; // U+0F0E
export const GTER_TSHEG = '༌'; // U+0F0C

// Tibetan Unicode range: 0F00 - 0FFF
export function isTibetanChar(code: number): boolean {
  return code >= 0x0f00 && code <= 0x0fff;
}

// Tibetan combining vowel codepoints
export const TIBETAN_VOWELS = new Set([
  0x0F71, // a-chung
  0x0F72, // i (gigu)
  0x0F74, // u (zhabkyu)
  0x0F7A, // e (drengbu)
  0x0F7C, // o (naro)
  0x0F80, // reversed i
]);

// Subjoined consonants: 0x0F90 - 0x0FBC
export function isSubjoined(code: number): boolean {
  return code >= 0x0f90 && code <= 0x0fbc;
}

/**
 * Normalizes Tibetan text into standard Unicode Canonical Composition (NFC).
 * Also unifies non-breaking tsek with standard tsek.
 */
export function normalizeTibetan(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFC')
    .replace(/\u0F0C/g, TSEK) // Replace non-breaking tsek with standard tsek
    .replace(/\r\n/g, '\n')
    .trim();
}

/**
 * Breaks a Tibetan text into interactive typing units (graphemes / syllables).
 * In Tibetan, a syllable typically ends with a tsek (་) or shad (།).
 */
export function tokenizeTibetan(text: string): string[] {
  const norm = normalizeTibetan(text);
  const tokens: string[] = [];
  let current = '';

  for (let i = 0; i < norm.length; i++) {
    const char = norm[i];
    current += char;

    if (char === TSEK || char === SHAD || char === NYIS_SHAD || char === ' ' || char === '\n') {
      tokens.push(current);
      current = '';
    }
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Breaks down a complex Tibetan stack/syllable into its anatomical components
 */
export interface StackBreakdown {
  original: string;
  prefix?: string;
  superscript?: string;
  root: string;
  subjoined?: string;
  vowel?: string;
  suffix?: string;
  description: string;
}

export function analyzeTibetanStack(syllable: string): StackBreakdown {
  const clean = syllable.replace(/[་།]/g, '').trim();

  // Common sample analysis for key educational stacks
  if (clean === 'བསྒྲུབས') {
    return {
      original: syllable,
      prefix: 'བ (Ba)',
      superscript: 'ས (Sa-go)',
      root: 'ག (Ga)',
      subjoined: 'ྲ (Ra-tag)',
      vowel: 'ུ (Zhabkyu / u)',
      suffix: 'བ (Ba) + ས (Sa)',
      description: 'Grand complex stack: Prefix བ + Super ས + Root ག + Subjoined ྲ + Vowel ུ + Suffixes བས',
    };
  }
  if (clean.includes('བསྒྲ') || clean === 'བསྒྲ') {
    return {
      original: syllable,
      prefix: 'བ (Ba)',
      superscript: 'ས (Sa-go)',
      root: 'ག (Ga)',
      subjoined: 'ྲ (Ra-tag)',
      description: 'Prefix བ + Superscript ས + Root ག + Subjoined ྲ',
    };
  }
  if (clean.includes('རྒྱ') || clean === 'རྒྱ') {
    return {
      original: syllable,
      superscript: 'ར (Ra-go)',
      root: 'ག (Ga)',
      subjoined: 'ྱ (Ya-tag)',
      description: 'Superscript ར + Root ག + Subjoined ྱ (Rgya)',
    };
  }
  if (clean.includes('སྤྲ') || clean === 'སྤྲ') {
    return {
      original: syllable,
      superscript: 'ས (Sa-go)',
      root: 'པ (Pa)',
      subjoined: 'ྲ (Ra-tag)',
      description: 'Superscript ས + Root པ + Subjoined ྲ (Spra)',
    };
  }
  if (clean.includes('ཀྲ') || clean === 'ཀྲ') {
    return {
      original: syllable,
      root: 'ཀ (Ka)',
      subjoined: 'ྲ (Ra-tag)',
      description: 'Root ཀ + Subjoined ྲ (Kra)',
    };
  }
  if (clean.includes('ཕྱ') || clean === 'ཕྱ') {
    return {
      original: syllable,
      root: 'ཕ (Pha)',
      subjoined: 'ྱ (Ya-tag)',
      description: 'Root ཕ + Subjoined ྱ (Phya)',
    };
  }

  // Fallback generic decomposition
  return {
    original: syllable,
    root: clean[0] || 'ཀ',
    description: `Tibetan element: ${clean}`,
  };
}

/**
 * Calculates typing statistics accurately
 */
export function calculateTypingMetrics(
  typedLength: number,
  errors: number,
  durationSec: number
): { wpm: number; accuracy: number } {
  const safeDuration = Math.max(durationSec, 1);
  const minutes = safeDuration / 60;
  
  // In Tibetan, 4-5 characters/syllables count as 1 standard word
  const wordsTyped = typedLength / 4;
  const rawWpm = Math.round(wordsTyped / minutes);
  const wpm = Math.max(0, isFinite(rawWpm) ? rawWpm : 0);

  const totalAttempts = typedLength + errors;
  const accuracy = totalAttempts === 0 
    ? 100 
    : Math.max(0, Math.min(100, Math.round(((totalAttempts - errors) / totalAttempts) * 100)));

  return { wpm, accuracy };
}
