import { SyllableComponent, TypingDrill } from '../types/font';

// Tibetan Alphabet Consonants (Thirty letters - ཀ་མད་སུམ་ཅུ)
export const TIBETAN_ALPHABET = [
  { char: 'ཀ', wylie: 'ka', name: 'Ka', row: 1 },
  { char: 'ཁ', wylie: 'kha', name: 'Kha', row: 1 },
  { char: 'ག', wylie: 'ga', name: 'Ga', row: 1 },
  { char: 'ང', wylie: 'nga', name: 'Nga', row: 1 },
  { char: 'ཅ', wylie: 'ca', name: 'Ca', row: 2 },
  { char: 'ཆ', wylie: 'cha', name: 'Cha', row: 2 },
  { char: 'ཇ', wylie: 'ja', name: 'Ja', row: 2 },
  { char: 'ཉ', wylie: 'nya', name: 'Nya', row: 2 },
  { char: 'ཏ', wylie: 'ta', name: 'Ta', row: 3 },
  { char: 'ཐ', wylie: 'tha', name: 'Tha', row: 3 },
  { char: 'ད', wylie: 'da', name: 'Da', row: 3 },
  { char: 'ན', wylie: 'na', name: 'Na', row: 3 },
  { char: 'པ', wylie: 'pa', name: 'Pa', row: 4 },
  { char: 'ཕ', wylie: 'pha', name: 'Pha', row: 4 },
  { char: 'བ', wylie: 'ba', name: 'Ba', row: 4 },
  { char: 'མ', wylie: 'ma', name: 'Ma', row: 4 },
  { char: 'ཙ', wylie: 'tsa', name: 'Tsa', row: 5 },
  { char: 'ཚ', wylie: 'tsha', name: 'Tsha', row: 5 },
  { char: 'ཛ', wylie: 'dza', name: 'Dza', row: 5 },
  { char: 'ཝ', wylie: 'wa', name: 'Wa', row: 5 },
  { char: 'ཞ', wylie: 'zha', name: 'Zha', row: 6 },
  { char: 'ཟ', wylie: 'za', name: 'Za', row: 6 },
  { char: 'འ', wylie: "'a", name: "'A (A-chung)", row: 6 },
  { char: 'ཡ', wylie: 'ya', name: 'Ya', row: 6 },
  { char: 'ར', wylie: 'ra', name: 'Ra', row: 7 },
  { char: 'ལ', wylie: 'la', name: 'La', row: 7 },
  { char: 'ཤ', wylie: 'sha', name: 'Sha', row: 7 },
  { char: 'ས', wylie: 'sa', name: 'Sa', row: 7 },
  { char: 'ཧ', wylie: 'ha', name: 'Ha', row: 8 },
  { char: 'ཨ', wylie: 'a', name: 'A', row: 8 }
];

// The Four Vowels (དབྱངས་བཞི)
export const TIBETAN_VOWELS = [
  { sign: 'ི', name: 'Gi-gu', tibetanName: 'གི་གུ', vowel: 'i', unicode: 'U+0F72', example: 'ཀི (ki)', position: 'Top diacritic' },
  { sign: 'ུ', name: 'Zhabs-kyu', tibetanName: 'ཞབས་ཀྱུ', vowel: 'u', unicode: 'U+0F74', example: 'ཀུ (ku)', position: 'Subjoined hook' },
  { sign: 'ེ', name: 'Dreng-bu', tibetanName: 'འགྲེང་བུ', vowel: 'e', unicode: 'U+0F7A', example: 'ཀེ (ke)', position: 'Top diacritic' },
  { sign: 'ོ', name: 'Na-ro', tibetanName: 'ན་རོ', vowel: 'o', unicode: 'U+0F7C', example: 'ཀོ (ko)', position: 'Top diacritic' }
];

// Subjoined letters (འདོགས་ཅན)
export const SUBJOINED_LETTERS = [
  {
    name: 'Ya-tags (ya-ta)',
    tibetanName: 'ཡ་བཏགས',
    sign: 'ྱ',
    examples: ['ཀྱ', 'ཁྱ', 'གྱ', 'པྱ', 'ཕྱ', 'བྱ', 'མྱ'],
    wylieExamples: ['kya', 'khya', 'gya', 'pya', 'phya', 'bya', 'mya'],
    description: 'Subjoined Y attached beneath 7 consonants. Sweeps down and curls gently rightwards.'
  },
  {
    name: 'Ra-tags (ra-ta)',
    tibetanName: 'ར་བཏགས',
    sign: 'ྲ',
    examples: ['ཀྲ', 'ཁྲ', 'གྲ', 'ཏྲ', 'ཐྲ', 'དྲ', 'པྲ', 'ཕྲ', 'བྲ', 'མྲ', 'སྲ', 'ཧྲ'],
    wylieExamples: ['kra', 'khra', 'gra', 'tra', 'thra', 'dra', 'pra', 'phra', 'bra', 'mra', 'sra', 'hra'],
    description: 'Subjoined R attached beneath 12 consonants. Forms a sharp diagonal down-stroke or hook.'
  },
  {
    name: 'La-tags (la-ta)',
    tibetanName: 'ལ་བཏགས',
    sign: 'ླ',
    examples: ['ཀླ', 'གླ', 'བླ', 'ཟླ', 'རླ', 'སླ'],
    wylieExamples: ['kla', 'gla', 'bla', 'zla', 'rla', 'sla'],
    description: 'Subjoined L beneath 6 consonants. Renders a reduced form of letter La directly anchored to the bottom.'
  },
  {
    name: 'Wa-zur (wa-corner)',
    tibetanName: 'ཝ་ཟུར',
    sign: 'ྭ',
    examples: ['ཀྭ', 'ཁྭ', 'གྭ', 'ཉྭ', 'དྭ', 'ཚྭ', 'ཞྭ', 'ཟྭ', 'རྭ', 'ལྭ', 'ཤྭ', 'སྭ', 'ཧྭ'],
    wylieExamples: ['kwa', 'khwa', 'gwa', 'nywa', 'dwa', 'tshwa', 'zhwa', 'zwa', 'rwa', 'lwa', 'shwa', 'swa', 'hwa'],
    description: 'Small triangular corner attached to lower right corner of consonants.'
  }
];

// Superscript letters (མགོ་ཅན)
export const SUPERSCRIPT_LETTERS = [
  {
    name: 'Ra-go (R-head)',
    tibetanName: 'ར་མགོ',
    char: 'ར',
    stacks: ['རྐ', 'རྒ', 'རྔ', 'རྗ', 'རྙ', 'རྟ', 'རྡ', 'རྣ', 'རྦ', 'རྨ', 'རྩ', 'རྫ'],
    wylie: ['rka', 'rga', 'rnga', 'rja', 'rnya', 'rta', 'rda', 'rna', 'rba', 'rma', 'rtsa', 'rdza']
  },
  {
    name: 'La-go (L-head)',
    tibetanName: 'ལ་མགོ',
    char: 'ལ',
    stacks: ['ལྐ', 'ལྒ', 'ལྔ', 'ལྕ', 'ལྗ', 'ལྟ', 'ལྡ', 'ལྤ', 'ལྦ', 'ལྷ'],
    wylie: ['lka', 'lga', 'lnga', 'lca', 'lja', 'lta', 'lda', 'lpa', 'lba', 'lha']
  },
  {
    name: 'Sa-go (S-head)',
    tibetanName: 'ས་མགོ',
    char: 'ས',
    stacks: ['སྐ', 'སྒ', 'སྔ', 'སྙ', 'སྟ', 'སྡ', 'སྣ', 'སྤ', 'སྦ', 'སྨ', 'སྩ'],
    wylie: ['ska', 'sga', 'snga', 'snya', 'sta', 'sda', 'sna', 'spa', 'sba', 'sma', 'stsa']
  }
];

// Interactive Syllable Dissection Data for བསྒྲུབས (sgrubs / accomplished)
export const DISSECTED_SYLLABLE_BGRUBS: SyllableComponent[] = [
  {
    id: 'ngon-jug',
    name: 'Prefix',
    tibetanName: 'སྔོན་འཇུག',
    wylieName: 'Ngon-jug',
    char: 'བ',
    color: '#3b82f6', // blue
    position: 'prefix',
    description: 'Prefix letter placed before the root stack. In classical Tibetan, there are 5 prefix letters: ག, ད, བ, མ, འ.',
    rule: 'Affects the initial tone and aspiration of the syllable. Often silent in Central Tibetan spoken dialect.'
  },
  {
    id: 'go-chan',
    name: 'Superscript',
    tibetanName: 'མགོ་ཅན',
    wylieName: 'Go-chan (Ra-go, La-go, Sa-go)',
    char: 'ས',
    color: '#8b5cf6', // purple
    position: 'superscript',
    description: 'Superscript "Sa" perched right on top of the root consonant. The 3 head letters are ར, ལ, ས.',
    rule: 'Modifies the pitch contour to high tone and prevents softening of the consonant.'
  },
  {
    id: 'ming-zhi',
    name: 'Root Letter (Base)',
    tibetanName: 'མིང་གཞི',
    wylieName: 'Ming-zhi',
    char: 'ག',
    color: '#ef4444', // red
    position: 'root',
    description: 'The core base consonant anchor of the entire syllable around which all affixes cluster.',
    rule: 'Every Tibetan syllable must have exactly one root letter (mingzhi) that carries the primary consonant phoneme.'
  },
  {
    id: 'tag-chan',
    name: 'Subscript',
    tibetanName: 'འདོགས་ཅན',
    wylieName: 'Tag-chan (Ra-ta)',
    char: 'ྲ',
    color: '#f59e0b', // amber
    position: 'subscript',
    description: 'Subjoined "Ra-ta" attached directly under the root letter.',
    rule: 'When joined with ག, forms the retroflex phoneme /ʈʂ/ (tra/dra).'
  },
  {
    id: 'yang',
    name: 'Vowel Diacritic',
    tibetanName: 'དབྱངས',
    wylieName: 'Yang (Zhabs-kyu)',
    char: 'ུ',
    color: '#10b981', // green
    position: 'vowel',
    description: 'The vowel sign "u" (ཞབས་ཀྱུ / foot hook) placed beneath the bottom-most subjoined element.',
    rule: 'Changes the default inherent vowel "a" to "u". In OpenType fonts, zhabs-kyu must dynamically attach to the lowest descender.'
  },
  {
    id: 'je-jug',
    name: 'Suffix',
    tibetanName: 'རྗེས་འཇུག',
    wylieName: 'Je-jug',
    char: 'བ',
    color: '#ec4899', // pink
    position: 'suffix',
    description: 'Suffix consonant following the root stack. The 10 suffixes are: ག, ང, ད, ན, བ, མ, འ, ར, ལ, ས.',
    rule: 'Pronounced as final stop /p/ or modifies vowel length and nasalization.'
  },
  {
    id: 'yang-jug',
    name: 'Post-suffix',
    tibetanName: 'ཡང་འཇུག',
    wylieName: 'Yang-jug (Second Suffix)',
    char: 'ས',
    color: '#06b6d4', // cyan
    position: 'postsuffix',
    description: 'Secondary suffix consonant appended after the primary suffix. Only ད and ས can act as post-suffixes.',
    rule: 'Silent in modern pronunciation, but historically gave a falling glottal tone and signifies past or causative verb morphology.'
  }
];

// Typing Drills for Practice Module
export const TYPING_DRILLS: TypingDrill[] = [
  {
    id: 'drill-1',
    title: 'Basic consonants (First two rows)',
    level: 'Beginner',
    description: 'Practice the foundational 8 consonants of the Tibetan alphabet with tsheg delimiters.',
    targetText: 'ཀ་ཁ་ག་ང་། ཅ་ཆ་ཇ་ཉ།',
    wylieGuide: 'ka kha ga nga / ca cha ja nya /',
    hint: 'Type standard consonants. Press space or tsheg key between each syllable.'
  },
  {
    id: 'drill-2',
    title: 'Consonants (Rows 3, 4 and 5)',
    level: 'Beginner',
    description: 'Master the dental, labial, and affricate consonant sets.',
    targetText: 'ཏ་ཐ་ད་ན། པ་ཕ་བ་མ། ཙ་ཚ་ཛ་ཝ།',
    wylieGuide: 'ta tha da na / pa pha ba ma / tsa tsha dza wa /',
    hint: 'Pay attention to aspirated vs unaspirated pairs (ta/tha, pa/pha).'
  },
  {
    id: 'drill-3',
    title: 'The Four Vowels (Gi-gu, Zhabs-kyu, Dreng-bu, Na-ro)',
    level: 'Intermediate',
    description: 'Attach vowel signs to base consonants.',
    targetText: 'ཀི ཀུ ཀེ ཀོ གི གུ གེ གོ མི མུ མེ མོ',
    wylieGuide: 'ki ku ke ko gi gu ge go mi mu me mo',
    hint: 'In Tibetan input method, type the base letter first, then the vowel mark.'
  },
  {
    id: 'drill-4',
    title: 'Subjoined Consonants (Ya-ta & Ra-ta)',
    level: 'Intermediate',
    description: 'Form common subjoined clusters: kya, khya, gya, kra, khra, gra, bra.',
    targetText: 'ཀྱ་ཁྱ་གྱ་པྱ་བྱ། ཀྲ་ཁྲ་གྲ་བྲ་སྲ།',
    wylieGuide: 'kya khya gya pya bya / kra khra gra bra sra /',
    hint: 'Subjoined consonants are triggered by the subjoin modifier or typing cluster in Wylie.'
  },
  {
    id: 'drill-5',
    title: 'Six Syllable Mantra',
    level: 'Advanced',
    description: 'Type the famous six-syllable mantra with proper tsheg and shad.',
    targetText: 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།',
    wylieGuide: "oM ma Ni pad+me hU~M/",
    hint: 'Contains anusvara (oM) and subjoined d+me in padme.'
  },
  {
    id: 'drill-6',
    title: 'Tibetan Greetings & Auspicious Wishes',
    level: 'Advanced',
    description: 'Common social greeting and benediction.',
    targetText: 'བཀྲ་ཤིས་བདེ་ལེགས་ཞུ། ཁྱེད་རང་སྐུ་གཟུགས་བདེ་ཐང་ཡིན་པར་སྨོན།',
    wylieGuide: 'bkra shis bde legs zhu / khyed rang sku gzugs bde thang yin par smon /',
    hint: 'Notice the prefix b- in bkra-shis and bde-legs.'
  },
  {
    id: 'drill-7',
    title: 'Pangram of Bodhisattva Wisdom',
    level: 'Master',
    description: 'Full sentence rich in complex stacks, prefixes, and suffixes.',
    targetText: 'སེམས་ཅན་ཐམས་ཅད་བདེ་བ་དང་བདེ་བའི་རྒྱུ་དང་ལྡན་པར་གྱུར་ཅིག སྡུག་བསྔལ་ཀུན་ལས་གྲོལ་བར་ཤོག',
    wylieGuide: 'sems can thams cad bde ba dang bde ba\'i rgyu dang ldan par gyur cig / sdug bsngal kun las grol bar shog',
    hint: 'Test your flow across multiple syllable boundaries with authentic tsheg rhythm.'
  }
];

// Official Monlam Bodyig 2025 / TCRC Monlam keyboard (from Monlam_Bodyig_2025.keylayout)
export interface KeyMap {
  key: string;
  char: string;
  shiftChar: string;
  label: string;
  wylie: string;
  shiftWylie: string;
  /** Caps Lock layer (optional; Bodyig 2025) */
  capsChar?: string;
  /** Caps Lock + Shift layer (optional; Bodyig 2025) */
  capsShiftChar?: string;
}

/**
 * Monlam Bodyig 3.1 default keyboard (MLBYHMLY.dll from Monlam_Bodyig_3.1.exe).
 * Distinct from Bodyig 2025: e.g. c→ཀ, v→ཁ, k→ག, j→་ (tsheg), Space→Latin space.
 * M is a dead key for subjoined forms; shown as ྄ / ྅ for the virtual keyboard.
 */
export const TIBETAN_KEYBOARD_LAYOUT_BODYIG_31: KeyMap[][] = [
  [
    { key: '`', char: 'ཨ', shiftChar: '༁', label: '`', wylie: 'a', shiftWylie: 'mark' },
    { key: '1', char: '༡', shiftChar: '༪', label: '1', wylie: '1', shiftWylie: '1h' },
    { key: '2', char: '༢', shiftChar: '༫', label: '2', wylie: '2', shiftWylie: '2h' },
    { key: '3', char: '༣', shiftChar: '༬', label: '3', wylie: '3', shiftWylie: '3h' },
    { key: '4', char: '༤', shiftChar: '༭', label: '4', wylie: '4', shiftWylie: '4h' },
    { key: '5', char: '༥', shiftChar: '༮', label: '5', wylie: '5', shiftWylie: '5h' },
    { key: '6', char: '༦', shiftChar: '༯', label: '6', wylie: '6', shiftWylie: '6h' },
    { key: '7', char: '༧', shiftChar: '༰', label: '7', wylie: '7', shiftWylie: '7h' },
    { key: '8', char: '༨', shiftChar: '༱', label: '8', wylie: '8', shiftWylie: '8h' },
    { key: '9', char: '༩', shiftChar: '༲', label: '9', wylie: '9', shiftWylie: '9h' },
    { key: '0', char: '༠', shiftChar: '༳', label: '0', wylie: '0', shiftWylie: '0h' },
    { key: '-', char: 'ཧ', shiftChar: '༼', label: '-', wylie: 'ha', shiftWylie: '(' },
    { key: '=', char: 'ཝ', shiftChar: '༽', label: '=', wylie: 'wa', shiftWylie: ')' },
  ],
  [
    { key: 'q', char: 'ཅ', shiftChar: '༕', label: 'Q', wylie: 'ca', shiftWylie: 'mark' },
    { key: 'w', char: 'ཆ', shiftChar: '༖', label: 'W', wylie: 'cha', shiftWylie: 'mark' },
    { key: 'e', char: 'ེ', shiftChar: '༗', label: 'E', wylie: 'e', shiftWylie: 'mark' },
    { key: 'r', char: 'ར', shiftChar: 'ྼ', label: 'R', wylie: 'ra', shiftWylie: 'r-sub' },
    { key: 't', char: 'ཏ', shiftChar: 'ཊ', label: 'T', wylie: 'ta', shiftWylie: 'Ta' },
    { key: 'y', char: 'ཡ', shiftChar: 'ྻ', label: 'Y', wylie: 'ya', shiftWylie: 'y-sub' },
    { key: 'u', char: 'ུ', shiftChar: '༘', label: 'U', wylie: 'u', shiftWylie: 'mark' },
    { key: 'i', char: 'ི', shiftChar: '༙', label: 'I', wylie: 'i', shiftWylie: 'mark' },
    { key: 'o', char: 'ོ', shiftChar: '༚', label: 'O', wylie: 'o', shiftWylie: 'mark' },
    { key: 'p', char: 'ཕ', shiftChar: '༛', label: 'P', wylie: 'pha', shiftWylie: 'mark' },
    { key: '[', char: 'ཙ', shiftChar: '༜', label: '[', wylie: 'tsa', shiftWylie: 'mark' },
    { key: ']', char: 'ཚ', shiftChar: '༝', label: ']', wylie: 'tsha', shiftWylie: 'mark' },
  ],
  [
    { key: 'a', char: 'འ', shiftChar: 'ཱ', label: 'A', wylie: "'a", shiftWylie: 'A' },
    { key: 's', char: 'ས', shiftChar: '༟', label: 'S', wylie: 'sa', shiftWylie: 'mark' },
    { key: 'd', char: 'ད', shiftChar: 'ཌ', label: 'D', wylie: 'da', shiftWylie: 'Da' },
    { key: 'f', char: 'བ', shiftChar: '༾', label: 'F', wylie: 'ba', shiftWylie: 'mark' },
    { key: 'g', char: 'ང', shiftChar: '༿', label: 'G', wylie: 'nga', shiftWylie: 'mark' },
    { key: 'h', char: 'མ', shiftChar: '࿏', label: 'H', wylie: 'ma', shiftWylie: 'mark' },
    { key: 'j', char: '་', shiftChar: '༂', label: 'J', wylie: 'tsheg', shiftWylie: 'mark' },
    { key: 'k', char: 'ག', shiftChar: '༃', label: 'K', wylie: 'ga', shiftWylie: 'mark' },
    { key: 'l', char: 'ལ', shiftChar: '༆', label: 'L', wylie: 'la', shiftWylie: 'mark' },
    { key: ';', char: 'ཞ', shiftChar: '༇', label: ';', wylie: 'zha', shiftWylie: 'mark' },
    { key: "'", char: '།', shiftChar: '༸', label: "'", wylie: 'shad', shiftWylie: 'mark' },
  ],
  [
    { key: 'z', char: 'ཟ', shiftChar: '༴', label: 'Z', wylie: 'za', shiftWylie: 'mark' },
    { key: 'x', char: 'ཤ', shiftChar: 'ཥ', label: 'X', wylie: 'sha', shiftWylie: 'Sha' },
    { key: 'c', char: 'ཀ', shiftChar: 'ཀྵ', label: 'C', wylie: 'ka', shiftWylie: 'kSha' },
    { key: 'v', char: 'ཁ', shiftChar: '྇', label: 'V', wylie: 'kha', shiftWylie: 'mark' },
    { key: 'b', char: 'པ', shiftChar: '྆', label: 'B', wylie: 'pa', shiftWylie: 'mark' },
    { key: 'n', char: 'ན', shiftChar: 'ཎ', label: 'N', wylie: 'na', shiftWylie: 'Na' },
    { key: 'm', char: '྄', shiftChar: '྅', label: 'M', wylie: 'sub', shiftWylie: 'paluta' },
    { key: ',', char: 'ཐ', shiftChar: 'ཋ', label: ',', wylie: 'tha', shiftWylie: 'Tha' },
    { key: '.', char: 'ཇ', shiftChar: '༺', label: '.', wylie: 'ja', shiftWylie: 'mark' },
    { key: '/', char: 'ཉ', shiftChar: '༻', label: '/', wylie: 'nya', shiftWylie: 'mark' },
    // Space is Latin space on Bodyig 3.1 (tsheg is on J)
    { key: ' ', char: ' ', shiftChar: ' ', label: 'SPACE', wylie: 'space', shiftWylie: 'space' },
  ],
];

/** Windows OEM backslash for Bodyig 3.1 (from MLBYHMLY.dll). */
function withBodyig31WindowsBackslash(macLayout: KeyMap[][]): KeyMap[][] {
  const rows = macLayout.map((row) => row.map((k) => ({ ...k })));
  if (rows[1] && !rows[1].some((k) => k.key === '\\')) {
    rows[1].push({
      key: '\\',
      char: 'ཛ',
      shiftChar: '༞',
      label: '\\',
      wylie: 'dza',
      shiftWylie: 'mark'
    });
  }
  return rows;
}

export const TIBETAN_KEYBOARD_LAYOUT_BODYIG_31_WINDOWS: KeyMap[][] =
  withBodyig31WindowsBackslash(TIBETAN_KEYBOARD_LAYOUT_BODYIG_31);

/**
 * Official Monlam Bodyig 2025 layout.
 * Corrections + Caps Lock layer from "Monlam Keyboard To be fixed.xlsx".
 * Space → ་ (tsheg); Shift+Space → regular space.
 */
export const TIBETAN_KEYBOARD_LAYOUT: KeyMap[][] = [
  [
    { key: '`', char: '་', shiftChar: '༸', label: '`', wylie: 'tsheg', shiftWylie: 'mark', capsChar: '༉', capsShiftChar: '༕' },
    { key: '1', char: '༡', shiftChar: '༑', label: '1', wylie: '1', shiftWylie: '!', capsChar: '༪', capsShiftChar: '༖' },
    { key: '2', char: '༢', shiftChar: '༄༅', label: '2', wylie: '2', shiftWylie: 'yig-mgo', capsChar: '༫', capsShiftChar: '࿀' },
    { key: '3', char: '༣', shiftChar: '༅', label: '3', wylie: '3', shiftWylie: 'yig-mgo', capsChar: '༬', capsShiftChar: '࿁' },
    { key: '4', char: '༤', shiftChar: '༹', label: '4', wylie: '4', shiftWylie: 'mark', capsChar: '༭', capsShiftChar: '࿂' },
    { key: '5', char: '༥', shiftChar: '༵', label: '5', wylie: '5', shiftWylie: 'mark', capsChar: '༮', capsShiftChar: '࿄' },
    { key: '6', char: '༦', shiftChar: '༈', label: '6', wylie: '6', shiftWylie: 'mark', capsChar: '༯', capsShiftChar: '࿅' },
    { key: '7', char: '༧', shiftChar: '༼', label: '7', wylie: '7', shiftWylie: '(', capsChar: '༰', capsShiftChar: '࿆' },
    { key: '8', char: '༨', shiftChar: '༽', label: '8', wylie: '8', shiftWylie: ')', capsChar: '༱', capsShiftChar: '࿈' },
    { key: '9', char: '༩', shiftChar: '(', label: '9', wylie: '9', shiftWylie: '(', capsChar: '༲', capsShiftChar: '࿉' },
    { key: '0', char: '༠', shiftChar: ')', label: '0', wylie: '0', shiftWylie: ')', capsChar: '༳', capsShiftChar: '࿊' },
    { key: '-', char: 'ྀ', shiftChar: 'ཱྀ', label: '-', wylie: 'i-rev', shiftWylie: 'i-rev', capsChar: '༘', capsShiftChar: '࿋' },
    { key: '=', char: 'ྃ', shiftChar: 'ཾ', label: '=', wylie: 'M', shiftWylie: 'M', capsChar: 'ཱི', capsShiftChar: '࿌' },
  ],
  [
    { key: 'q', char: 'ཊ', shiftChar: 'ཋ', label: 'Q', wylie: 'Ta', shiftWylie: 'Tha', capsChar: '༺', capsShiftChar: '࿏' },
    { key: 'w', char: 'ཝ', shiftChar: 'ྭ', label: 'W', wylie: 'wa', shiftWylie: 'w-sub', capsChar: '༻' },
    { key: 'e', char: 'ེ', shiftChar: 'ཻ', label: 'E', wylie: 'e', shiftWylie: 'ai', capsChar: '྿' },
    { key: 'r', char: 'ར', shiftChar: 'ར྄', label: 'R', wylie: 'ra', shiftWylie: 'r+', capsChar: '྆' },
    { key: 't', char: 'ཏ', shiftChar: 'ཐ', label: 'T', wylie: 'ta', shiftWylie: 'tha', capsChar: '྇' },
    { key: 'y', char: 'ཡ', shiftChar: 'ྱ', label: 'Y', wylie: 'ya', shiftWylie: 'y-sub', capsChar: '༁' },
    { key: 'u', char: 'ུ', shiftChar: 'ཱུ', label: 'U', wylie: 'u', shiftWylie: 'U', capsChar: '༂' },
    { key: 'i', char: 'ི', shiftChar: 'ྀ', label: 'I', wylie: 'i', shiftWylie: 'i-rev', capsChar: '༿' },
    { key: 'o', char: 'ོ', shiftChar: 'ཽ', label: 'O', wylie: 'o', shiftWylie: 'au', capsChar: '༾' },
    { key: 'p', char: 'པ', shiftChar: 'ཕ', label: 'P', wylie: 'pa', shiftWylie: 'pha', capsChar: '༆' },
    { key: '[', char: '༷', shiftChar: 'ྂ', label: '[', wylie: 'mark', shiftWylie: 'mark', capsChar: '༇' },
    { key: ']', char: '྄', shiftChar: '༵', label: ']', wylie: 'stack', shiftWylie: 'mark', capsChar: '༓' },
  ],
  [
    { key: 'a', char: '྄', shiftChar: 'ཨ', label: 'A', wylie: 'stack', shiftWylie: 'a', capsChar: '࿉' },
    { key: 's', char: 'ས', shiftChar: 'ཤ', label: 'S', wylie: 'sa', shiftWylie: 'sha', capsChar: '࿊' },
    { key: 'd', char: 'ད', shiftChar: 'ཛ', label: 'D', wylie: 'da', shiftWylie: 'dza', capsChar: '࿋' },
    { key: 'f', char: 'ང', shiftChar: 'དྷ', label: 'F', wylie: 'nga', shiftWylie: 'dha', capsChar: '࿌' },
    { key: 'g', char: 'ག', shiftChar: 'གྷ', label: 'G', wylie: 'ga', shiftWylie: 'gha', capsChar: '༊' },
    { key: 'h', char: 'ཧ', shiftChar: 'ྷ', label: 'H', wylie: 'ha', shiftWylie: 'h-sub', capsChar: '༏' },
    { key: 'j', char: 'ཇ', shiftChar: 'ྫྷ', label: 'J', wylie: 'ja', shiftWylie: 'j-sub', capsChar: '༐' },
    { key: 'k', char: 'ཀ', shiftChar: 'ཁ', label: 'K', wylie: 'ka', shiftWylie: 'kha', capsChar: 'ྈ' },
    { key: 'l', char: 'ལ', shiftChar: 'ལ྄', label: 'L', wylie: 'la', shiftWylie: 'l+', capsChar: '༒' },
    { key: ';', char: 'ཌྷ', shiftChar: 'ཿ', label: ';', wylie: 'ddha', shiftWylie: 'H', capsChar: '༓', capsShiftChar: ':' },
    { key: '\'', char: 'འ', shiftChar: 'ཱ', label: '\'', wylie: '\'a', shiftWylie: 'A', capsChar: 'འ', capsShiftChar: '༕' },
  ],
  [
    { key: 'z', char: 'ཟ', shiftChar: 'ཞ', label: 'Z', wylie: 'za', shiftWylie: 'zha', capsChar: '༗' },
    { key: 'x', char: 'ཙ', shiftChar: 'ཚ', label: 'X', wylie: 'tsa', shiftWylie: 'tsha', capsChar: '༙' },
    { key: 'c', char: 'ཅ', shiftChar: 'ཆ', label: 'C', wylie: 'ca', shiftWylie: 'cha', capsChar: '༚' },
    { key: 'v', char: 'ཌ', shiftChar: 'ཎ', label: 'V', wylie: 'Da', shiftWylie: 'Na', capsChar: '༛' },
    { key: 'b', char: 'བ', shiftChar: 'བྷ', label: 'B', wylie: 'ba', shiftWylie: 'bha', capsChar: '༜' },
    { key: 'n', char: 'ན', shiftChar: 'ཉ', label: 'N', wylie: 'na', shiftWylie: 'nya', capsChar: '༝' },
    { key: 'm', char: 'མ', shiftChar: 'ཥ', label: 'M', wylie: 'ma', shiftWylie: 'Sha', capsChar: '༞' },
    { key: ',', char: 'ྱ', shiftChar: 'ཱ', label: ',', wylie: 'y-sub', shiftWylie: 'A', capsChar: '༟' },
    { key: '.', char: 'ྲ', shiftChar: 'ྼ', label: '.', wylie: 'r-sub', shiftWylie: 'r-fixed', capsChar: 'ྉ' },
    { key: '/', char: '།', shiftChar: 'ས྄', label: '/', wylie: 'shad', shiftWylie: 's+', capsChar: '།' },
    { key: ' ', char: '་', shiftChar: ' ', label: 'SPACE', wylie: 'tsheg', shiftWylie: 'space' },
  ],
];

/** Windows US QWERTY adds the OEM backslash key on the second row. */
export function toWindowsKeyboardLayout(macLayout: KeyMap[][]): KeyMap[][] {
  const rows = macLayout.map((row) => row.map((k) => ({ ...k })));
  if (rows[1] && !rows[1].some((k) => k.key === '\\')) {
    rows[1].push({
      key: '\\',
      char: '༔',
      shiftChar: '༈',
      label: '\\',
      wylie: 'gter',
      shiftWylie: 'nyis',
      capsChar: '༃'
    });
  }
  return rows;
}

export const TIBETAN_KEYBOARD_LAYOUT_WINDOWS: KeyMap[][] =
  toWindowsKeyboardLayout(TIBETAN_KEYBOARD_LAYOUT);

/** Resolve the character a key produces for the current shift/caps state. */
export function keyMapOutput(key: KeyMap, shift: boolean, caps: boolean): string {
  if (caps) {
    if (shift) return key.capsShiftChar ?? key.capsChar ?? key.shiftChar;
    return key.capsChar ?? key.char;
  }
  return shift ? key.shiftChar : key.char;
}
