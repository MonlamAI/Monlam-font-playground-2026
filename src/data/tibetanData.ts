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
    title: 'Basic Consonants (First Two Rows)',
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
    title: 'Sacred Compassion Mantra',
    level: 'Advanced',
    description: 'Type the famous six-syllable mantra with proper tsheg and shad.',
    targetText: 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།',
    wylieGuide: "oM ma Ni pad+me hU~M/",
    hint: 'Contains anusvara (oM) and subjoined d+me in padme.'
  },
  {
    id: 'drill-6',
    title: 'Tibetan Greeting & Auspicious Wishes',
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

// Standard Monlam / Sambhota Tibetan Keyboard Mapping (QWERTY layout)
export interface KeyMap {
  key: string;
  char: string;
  shiftChar: string;
  label: string;
  wylie: string;
  shiftWylie: string;
}

export const TIBETAN_KEYBOARD_LAYOUT: KeyMap[][] = [
  // Row 1 (Numbers)
  [
    { key: '`', char: '༄', shiftChar: '༅', label: '`', wylie: '@', shiftWylie: '#' },
    { key: '1', char: '༡', shiftChar: '!', label: '1', wylie: '1', shiftWylie: '!' },
    { key: '2', char: '༢', shiftChar: '࿐', label: '2', wylie: '2', shiftWylie: '$' },
    { key: '3', char: '༣', shiftChar: '༑', label: '3', wylie: '3', shiftWylie: '༑' },
    { key: '4', char: '༤', shiftChar: '༏', label: '4', wylie: '4', shiftWylie: '༏' },
    { key: '5', char: '༥', shiftChar: '༐', label: '5', wylie: '5', shiftWylie: '༐' },
    { key: '6', char: '༦', shiftChar: '༒', label: '6', wylie: '6', shiftWylie: '༒' },
    { key: '7', char: '༧', shiftChar: '༸', label: '7', wylie: '7', shiftWylie: '༸' },
    { key: '8', char: '༨', shiftChar: '༺', label: '8', wylie: '8', shiftWylie: '༺' },
    { key: '9', char: '༩', shiftChar: '༻', label: '9', wylie: '9', shiftWylie: '༻' },
    { key: '0', char: '༠', shiftChar: '༽', label: '0', wylie: '0', shiftWylie: ')' },
    { key: '-', char: '༼', shiftChar: '—', label: '-', wylie: '(', shiftWylie: '_' },
    { key: '=', char: '༚', shiftChar: '༛', label: '=', wylie: '=', shiftWylie: '+' }
  ],
  // Row 2 (QWERTY)
  [
    { key: 'q', char: 'ཆ', shiftChar: 'ཎ', label: 'Q', wylie: 'cha', shiftWylie: 'Na' },
    { key: 'w', char: 'ཇ', shiftChar: 'ཝ', label: 'W', wylie: 'ja', shiftWylie: 'wa' },
    { key: 'e', char: 'ེ', shiftChar: 'ཻ', label: 'E', wylie: 'e', shiftWylie: 'ai' },
    { key: 'r', char: 'ར', shiftChar: 'ྲ', label: 'R', wylie: 'ra', shiftWylie: 'r-sub' },
    { key: 't', char: 'ཏ', shiftChar: 'ཊ', label: 'T', wylie: 'ta', shiftWylie: 'Ta' },
    { key: 'y', char: 'ཡ', shiftChar: 'ྱ', label: 'Y', wylie: 'ya', shiftWylie: 'y-sub' },
    { key: 'u', char: 'ུ', shiftChar: 'ཱུ', label: 'U', wylie: 'u', shiftWylie: 'U' },
    { key: 'i', char: 'ི', shiftChar: 'ཱི', label: 'I', wylie: 'i', shiftWylie: 'I' },
    { key: 'o', char: 'ོ', shiftChar: 'ཽ', label: 'O', wylie: 'o', shiftWylie: 'au' },
    { key: 'p', char: 'པ', shiftChar: 'ཕ', label: 'P', wylie: 'pa', shiftWylie: 'pha' },
    { key: '[', char: 'ཞ', shiftChar: 'ཟ', label: '[', wylie: 'zha', shiftWylie: 'za' },
    { key: ']', char: 'འ', shiftChar: 'ཨ', label: ']', wylie: "'a", shiftWylie: 'a' }
  ],
  // Row 3 (ASDFGHJKL)
  [
    { key: 'a', char: 'ཨ', shiftChar: 'ཱ', label: 'A', wylie: 'a', shiftWylie: 'A' },
    { key: 's', char: 'ས', shiftChar: 'ཤ', label: 'S', wylie: 'sa', shiftWylie: 'sha' },
    { key: 'd', char: 'ད', shiftChar: 'ཌ', label: 'D', wylie: 'da', shiftWylie: 'Da' },
    { key: 'f', char: 'ཐ', shiftChar: 'ཋ', label: 'F', wylie: 'tha', shiftWylie: 'Tha' },
    { key: 'g', char: 'ག', shiftChar: 'གྷ', label: 'G', wylie: 'ga', shiftWylie: 'Gha' },
    { key: 'h', char: 'ཧ', shiftChar: 'ལྷ', label: 'H', wylie: 'ha', shiftWylie: 'lha' },
    { key: 'j', char: 'ཅ', shiftChar: 'ཉ', label: 'J', wylie: 'ca', shiftWylie: 'nya' },
    { key: 'k', char: 'ཀ', shiftChar: 'ཁ', label: 'K', wylie: 'ka', shiftWylie: 'kha' },
    { key: 'l', char: 'ལ', shiftChar: 'ླ', label: 'L', wylie: 'la', shiftWylie: 'l-sub' },
    { key: ';', char: 'ཚ', shiftChar: 'ཛ', label: ';', wylie: 'tsha', shiftWylie: 'dza' },
    { key: "'", char: 'ཙ', shiftChar: 'ཝ', label: "'", wylie: 'tsa', shiftWylie: 'wa' }
  ],
  // Row 4 (ZXCVBNM)
  [
    { key: 'z', char: 'ཟ', shiftChar: 'ཞ', label: 'Z', wylie: 'za', shiftWylie: 'zha' },
    { key: 'x', char: 'ང', shiftChar: 'ྃ', label: 'X', wylie: 'nga', shiftWylie: 'om' },
    { key: 'c', char: 'བ', shiftChar: 'བྷ', label: 'C', wylie: 'ba', shiftWylie: 'Bha' },
    { key: 'v', char: 'མ', shiftChar: 'ཾ', label: 'V', wylie: 'ma', shiftWylie: 'M' },
    { key: 'b', char: 'ན', shiftChar: 'ཎ', label: 'B', wylie: 'na', shiftWylie: 'Na' },
    { key: 'n', char: 'ཉ', shiftChar: 'ྙ', label: 'N', wylie: 'nya', shiftWylie: 'ny-sub' },
    { key: 'm', char: 'མ', shiftChar: 'ྨ', label: 'M', wylie: 'ma', shiftWylie: 'm-sub' },
    { key: ',', char: '༌', shiftChar: '༚', label: ',', wylie: 'tsheg', shiftWylie: 'dot' },
    { key: '.', char: '།', shiftChar: '༎', label: '.', wylie: 'shad', shiftWylie: 'nyis-shad' },
    { key: '/', char: '༆', shiftChar: '༴', label: '/', wylie: 'symbol', shiftWylie: 'symbol' }
  ]
];

/** Windows US QWERTY adds the OEM backslash key on the second row. */
export function toWindowsKeyboardLayout(macLayout: KeyMap[][]): KeyMap[][] {
  const rows = macLayout.map((row) => row.map((k) => ({ ...k })));
  if (rows[1] && !rows[1].some((k) => k.key === '\\')) {
    rows[1].push({
      key: '\\',
      char: '྾',
      shiftChar: '|',
      label: '\\',
      wylie: 'backslash',
      shiftWylie: 'bar'
    });
  }
  return rows;
}

export const TIBETAN_KEYBOARD_LAYOUT_WINDOWS: KeyMap[][] =
  toWindowsKeyboardLayout(TIBETAN_KEYBOARD_LAYOUT);
