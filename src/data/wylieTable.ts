/**
 * Smart Wylie to Tibetan Unicode Transliteration Converter
 * Supports standard EWTS (Extended Wylie Transliteration Scheme)
 */

export const WYLIE_CONSONANTS: Record<string, string> = {
  'k': 'ཀ', 'kh': 'ཁ', 'g': 'ག', 'ng': 'ང',
  'c': 'ཅ', 'ch': 'ཆ', 'j': 'ཇ', 'ny': 'ཉ',
  't': 'ཏ', 'th': 'ཐ', 'd': 'ད', 'n': 'ན',
  'p': 'པ', 'ph': 'ཕ', 'b': 'བ', 'm': 'མ',
  'ts': 'ཙ', 'tsh': 'ཚ', 'dz': 'ཛ', 'w': 'ཝ',
  'zh': 'ཞ', 'z': 'ཟ', "'": 'འ', 'y': 'ཡ',
  'r': 'ར', 'l': 'ལ', 'sh': 'ཤ', 's': 'ས',
  'h': 'ཧ', 'a': 'ཨ',
};

export const WYLIE_SUBJOINED: Record<string, string> = {
  'k': 'ྐ', 'kh': 'ྑ', 'g': 'ྒ', 'ng': 'ྔ',
  'c': 'ྕ', 'ch': 'ྖ', 'j': 'ྗ', 'ny': 'ྙ',
  't': 'ྟ', 'th': 'ྠ', 'd': 'ྡ', 'n': 'ྣ',
  'p': 'ྤ', 'ph': 'ྥ', 'b': 'ྦ', 'm': 'ྨ',
  'ts': 'ྩ', 'tsh': 'ྪ', 'dz': 'ྫ', 'w': 'ྭ',
  'zh': 'ྮ', 'z': 'ྯ', "'": 'ྰ', 'y': 'ྱ',
  'r': 'ྲ', 'l': 'ླ', 'sh': 'ྵ', 's': 'ྶ',
  'h': 'ྷ', 'a': '',
};

export const WYLIE_VOWELS: Record<string, string> = {
  'i': 'ི',
  'u': 'ུ',
  'e': 'ེ',
  'o': 'ོ',
};

// Common whole-syllable or stack expansions
export const COMMON_STACKS: Record<string, string> = {
  'kra': 'ཀྲ', 'khra': 'ཁྲ', 'gra': 'གྲ', 'tra': 'ཏྲ', 'thra': 'ཐྲ', 'dra': 'དྲ', 'pra': 'པྲ', 'phra': 'ཕྲ', 'bra': 'བྲ', 'mra': 'མྲ', 'sra': 'སྲ', 'hra': 'ཧྲ',
  'kya': 'ཀྱ', 'khya': 'ཁྱ', 'gya': 'གྱ', 'pya': 'པྱ', 'phya': 'ཕྱ', 'bya': 'བྱ', 'mya': 'མྱ',
  'kla': 'ཀླ', 'gla': 'གླ', 'bla': 'བླ', 'rla': 'རླ', 'sla': 'སླ', 'zla': 'ཟླ',
  'rka': 'རྐ', 'rga': 'རྒ', 'rnga': 'རྔ', 'rja': 'རྗ', 'rnya': 'རྙ', 'rta': 'རྟ', 'rda': 'རྡ', 'rna': 'རྣ', 'rba': 'རྦ', 'rma': 'རྨ', 'rtsa': 'རྩ', 'rdza': 'རྫ',
  'lka': 'ལྐ', 'lga': 'ལྒ', 'lnga': 'ལྔ', 'lca': 'ལྕ', 'lja': 'ལྗ', 'lta': 'ལྟ', 'lda': 'ལྡ', 'lpa': 'ལྤ', 'lba': 'ལྦ', 'lha': 'ལྷ',
  'ska': 'སྐ', 'sga': 'སྒ', 'snga': 'སྔ', 'snya': 'སྙ', 'sta': 'སྟ', 'sda': 'སྡ', 'sna': 'སྣ', 'spa': 'སྤ', 'sba': 'སྦ', 'sma': 'སྨ', 'stsa': 'སྩ',
  'rkya': 'རྐྱ', 'rgya': 'རྒྱ', 'rmya': 'རྨྱ',
  'skya': 'སྐྱ', 'sgya': 'སྒྱ', 'spya': 'སྤྱ', 'sbya': 'སྦྱ', 'smya': 'སྨྱ',
  'skra': 'སྐྲ', 'sgra': 'སྒྲ', 'spra': 'སྤྲ', 'sbra': 'སྦྲ', 'smra': 'སྨྲ',
  'bskya': 'བསྐྱ', 'bsgya': 'བསྒྱ', 'bspya': 'བསྤྱ', 'bskro': 'བསྐྲོ', 'bskru': 'བསྐྲུ', 'bsgra': 'བསྒྲ', 'bspra': 'བསྤྲ', 'bsbra': 'བསྦྲ',
  'bkra': 'བཀྲ', 'bgra': 'བགྲ', 'bdra': 'བདྲ',
};

/**
 * Converts a typed Latin Wylie token into Tibetan Unicode
 */
export function wylieToTibetan(input: string): string {
  if (!input) return '';

  // Direct special replacements
  let str = input.trim();
  if (input === ' ') return '་';
  if (input === '/') return '།';
  if (input === '//') return '༎';

  // Check known stacks first
  if (COMMON_STACKS[str]) {
    return COMMON_STACKS[str];
  }

  // Handle vowels at the end
  let vowelChar = '';
  let vowelMatch = str.match(/([iueo])$/);
  if (vowelMatch) {
    vowelChar = WYLIE_VOWELS[vowelMatch[1]] || '';
    str = str.slice(0, -1);
  }

  if (COMMON_STACKS[str]) {
    return COMMON_STACKS[str] + vowelChar;
  }

  // Check simple consonant
  if (WYLIE_CONSONANTS[str]) {
    return WYLIE_CONSONANTS[str] + vowelChar;
  }

  // If ends in 'a'
  if (str.endsWith('a') && WYLIE_CONSONANTS[str.slice(0, -1)]) {
    return WYLIE_CONSONANTS[str.slice(0, -1)] + vowelChar;
  }

  return input;
}
