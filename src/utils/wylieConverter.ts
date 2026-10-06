/**
 * Wylie Transliteration to Tibetan Unicode Converter
 * Implements Extended Wylie transliteration scheme for standard Tibetan syllables.
 */

// Root consonants
const WYLIE_CONSONANTS: Record<string, string> = {
  k: 'ཀ',
  kh: 'ཁ',
  g: 'ག',
  ng: 'ང',
  c: 'ཅ',
  ch: 'ཆ',
  j: 'ཇ',
  ny: 'ཉ',
  t: 'ཏ',
  th: 'ཐ',
  d: 'ད',
  n: 'ན',
  p: 'པ',
  ph: 'ཕ',
  b: 'བ',
  m: 'མ',
  ts: 'ཙ',
  tsh: 'ཚ',
  dz: 'ཛ',
  w: 'ཝ',
  zh: 'ཞ',
  z: 'ཟ',
  "'": 'འ',
  y: 'ཡ',
  r: 'ར',
  l: 'ལ',
  sh: 'ཤ',
  s: 'ས',
  h: 'ཧ',
  a: 'ཨ',
  // Sanskrit retroflex / aspirated
  T: 'ཊ',
  TH: 'ཋ',
  D: 'ཌ',
  N: 'ཎ',
  SH: 'ཥ',
  kS: 'ཀྵ'
};

// Subjoined consonants (U+0F90 to U+0FB9)
const WYLIE_SUBJOINED: Record<string, string> = {
  k: 'ྐ',
  kh: 'ྑ',
  g: 'ྒ',
  ng: 'ྔ',
  c: 'ྕ',
  ch: 'ྖ',
  j: 'ྗ',
  ny: 'ྙ',
  t: 'ྟ',
  th: 'ྠ',
  d: 'ྡ',
  n: 'ྣ',
  p: 'ྤ',
  ph: 'ྥ',
  b: 'ྦ',
  m: 'ྨ',
  ts: 'ྩ',
  tsh: 'ྪ',
  dz: 'ྫ',
  w: 'ྭ',
  zh: 'ྮ',
  z: 'ྯ',
  "'": 'ྰ',
  y: 'ྱ',
  r: 'ྲ',
  l: 'ླ',
  sh: 'ྴ',
  s: 'ྶ',
  h: 'ྷ'
};

// Vowels
const WYLIE_VOWELS: Record<string, string> = {
  i: 'ི',
  u: 'ུ',
  e: 'ེ',
  o: 'ོ',
  I: 'ཱི',
  U: 'ཱུ',
  ai: 'ཻ',
  au: 'ཽ'
};

// Common punctuation
const WYLIE_PUNCTUATION: Record<string, string> = {
  '/': '།',
  '//': '༎',
  '*': '༌',
  '@': '༄',
  '#': '༅',
  '$': '༑',
  '%': '༏'
};

// Common whole-word or syllable overrides for natural typing
const SYLLABLE_DICTIONARY: Record<string, string> = {
  'om': 'ཨོཾ',
  'hum': 'ཧཱུྃ',
  'hrih': 'ཧྲཱིཿ',
  'ah': 'ཨཱཿ',
  'svaha': 'སྭཱ་ཧཱ',
  'guru': 'གུ་རུ',
  'padma': 'པདྨ',
  'mani': 'མ་ཎི',
  'siddhi': 'སིདྡྷི',
  'bod': 'བོད',
  'yig': 'ཡིག',
  'bkra': 'བཀྲ',
  'shis': 'ཤིས',
  'bde': 'བདེ',
  'legs': 'ལེགས',
  'tashi': 'བཀྲ་ཤིས',
  'delek': 'བདེ་ལེགས',
  'sangye': 'སངས་རྒྱས',
  'chos': 'ཆོས',
  'gedun': 'དགེ་འདུན',
  'lama': 'བླ་མ',
  'sems': 'སེམས',
  'can': 'ཅན',
  'thams': 'ཐམས',
  'cad': 'ཅད',
  'bgrubs': 'བསྒྲུབས',
  'sgrubs': 'བསྒྲུབས',
  'dbyangs': 'དབྱངས',
  'gsal': 'གསལ',
  'byed': 'བྱེད'
};

/**
 * Converts Romanized Wylie string to Tibetan Unicode
 */
export function convertWylieToTibetan(input: string): string {
  if (!input) return '';

  // Split input into words/tokens separated by spaces or punctuation
  const tokens = input.split(/([ \t\n/]+)/);

  return tokens
    .map(token => {
      if (!token) return '';
      if (token === ' ') return '་'; // spaces in Tibetan typically become tsheg
      if (token === '\n') return '\n';
      if (token === '/') return '།';
      if (token === '//') return '༎';

      const cleanLower = token.toLowerCase().trim();

      // Check dictionary first
      if (SYLLABLE_DICTIONARY[cleanLower]) {
        return SYLLABLE_DICTIONARY[cleanLower];
      }

      // Handle common stack clusters
      return convertSyllable(token);
    })
    .join('');
}

/**
 * Fallback converter for an individual syllable
 */
function convertSyllable(syllable: string): string {
  let result = '';
  let i = 0;
  let isSubjoined = false;

  while (i < syllable.length) {
    const twoChar = syllable.substring(i, i + 2);
    const threeChar = syllable.substring(i, i + 3);
    const oneChar = syllable.substring(i, i + 1);

    // Check punctuation
    if (WYLIE_PUNCTUATION[syllable.substring(i, i + 2)]) {
      result += WYLIE_PUNCTUATION[syllable.substring(i, i + 2)];
      i += 2;
      isSubjoined = false;
      continue;
    }
    if (WYLIE_PUNCTUATION[oneChar]) {
      result += WYLIE_PUNCTUATION[oneChar];
      i += 1;
      isSubjoined = false;
      continue;
    }

    // Check vowels
    if (WYLIE_VOWELS[twoChar]) {
      result += WYLIE_VOWELS[twoChar];
      i += 2;
      isSubjoined = false;
      continue;
    }
    if (WYLIE_VOWELS[oneChar]) {
      // If starts with vowel, implicit 'a' (ཨ) root
      if (result === '') {
        result += 'ཨ';
      }
      result += WYLIE_VOWELS[oneChar];
      i += 1;
      isSubjoined = false;
      continue;
    }

    // Check '+' explicit subjoin operator in EWTS (e.g. pad+me)
    if (oneChar === '+') {
      isSubjoined = true;
      i += 1;
      continue;
    }

    // Check 3-char consonants (tsh)
    if (threeChar === 'tsh') {
      result += isSubjoined ? (WYLIE_SUBJOINED['tsh'] || 'ྪ') : (WYLIE_CONSONANTS['tsh'] || 'ཚ');
      i += 3;
      isSubjoined = true;
      continue;
    }

    // Check 2-char consonants (kh, ng, ch, ny, th, ph, ts, dz, zh, sh)
    if (WYLIE_CONSONANTS[twoChar]) {
      result += isSubjoined ? (WYLIE_SUBJOINED[twoChar] || WYLIE_CONSONANTS[twoChar]) : WYLIE_CONSONANTS[twoChar];
      i += 2;
      isSubjoined = true;
      continue;
    }

    // Check 1-char consonants
    if (WYLIE_CONSONANTS[oneChar]) {
      result += isSubjoined ? (WYLIE_SUBJOINED[oneChar] || WYLIE_CONSONANTS[oneChar]) : WYLIE_CONSONANTS[oneChar];
      i += 1;
      isSubjoined = true;
      continue;
    }

    // If letter is 'a', it is default inherent vowel in Tibetan
    if (oneChar === 'a') {
      if (result === '') {
        result += 'ཨ';
      }
      i += 1;
      isSubjoined = false;
      continue;
    }

    // Preserve unknown characters (digits, symbols, punctuation)
    result += oneChar;
    i += 1;
    isSubjoined = false;
  }

  return result;
}
