import { FontItem, PresetText } from '../types/font';

/**
 * Monlam Bodyig v4.0.1 font catalog — assets from the official Mac package.
 * Binary files live under server/uploads/fonts (served at /uploads/fonts/…).
 */
export const MONLAM_FONTS: FontItem[] = [
  {
    id: 'monlam-ouchan-1',
    name: 'Monlam Uni OuChan 1',
    tibetanName: 'སྨོན་ལམ་དབུ་ཅན་དང་པོ།',
    category: 'Uchen',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'Classical Uchen typeface from Monlam Bodyig 4.0.1. Harmonized vowel heights and balanced tsheg spacing for long-form reading, literature, and official publishing.',
    tibetanDescription: 'སྨོན་ལམ་གྱིས་གསར་བཟོ་གནང་བའི་དབུ་ཅན་ཚད་ལྡན་ཡིག་གཟུགས་ཤིག་ཡིན།',
    cssClass: 'font-monlam-ouchan-1',
    stylesCount: 1,
    weights: [400],
    features: ['Unicode Tibetan', 'OpenType GSUB/GPOS', 'Bodyig 4.0.1'],
    fileSize: '1.15 MB',
    filename: 'Monlam_Uni_OuChan1.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_OuChan1.ttf',
    sampleText: 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ། བོད་ཀྱི་ཡི་གེ་ནི་འཛམ་གླིང་གི་རིག་གཞུང་བང་མཛོད་ཆེན་པོ་ཞིག་ཡིན།',
    tags: ['Classical', 'Uchen', 'Primary Reader', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.25,
      descenderRatio: 1.45,
      strokeContrast: 'High',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Standard'
    }
  },
  {
    id: 'monlam-ouchan-2',
    name: 'Monlam Uni OuChan 2',
    tibetanName: 'སྨོན་ལམ་དབུ་ཅན་གཉིས་པ།',
    category: 'Uchen',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'Bold headline Uchen from Bodyig 4.0.1 — suited to banners, book titles, headers, and signage.',
    tibetanDescription: 'དབུ་ཅན་ཚགས་སྦོམ་དཔེ་དེབ་ཀྱི་མགོ་བརྗོད་དང་སྦྱར་བྱང་སོགས་ལ་འཚམས་པ།',
    cssClass: 'font-monlam-ouchan-2',
    stylesCount: 1,
    weights: [700],
    features: ['Headline Weight', 'Display Uchen', 'Bodyig 4.0.1'],
    fileSize: '1.24 MB',
    filename: 'Monlam_Uni_OuChan2.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_OuChan2.ttf',
    sampleText: 'བཀྲ་ཤིས་བདེ་ལེགས། དེང་རབས་བོད་ཀྱི་བརྡ་འཕྲིན་འཕྲུལ་རིག',
    tags: ['Headline', 'Bold', 'Title', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.2,
      descenderRatio: 1.4,
      strokeContrast: 'High',
      strokeType: 'Chiseled Brush',
      spacing: 'Compact'
    }
  },
  {
    id: 'monlam-ouchan-3',
    name: 'Monlam Uni OuChan 3',
    tibetanName: 'སྨོན་ལམ་དབུ་ཅན་གསུམ་པ།',
    category: 'Uchen',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'Refined modern Uchen with graceful curves — ideal for contemporary branding, poetry, and editorial design.',
    tibetanDescription: 'སྒྱུ་རྩལ་གྱི་ཉམས་དང་ལྡན་པའི་དབུ་ཅན་དེང་རབས་ཅན།',
    cssClass: 'font-monlam-ouchan-3',
    stylesCount: 1,
    weights: [400],
    features: ['Artistic Terminals', 'Editorial', 'Bodyig 4.0.1'],
    fileSize: '1.24 MB',
    filename: 'Monlam_Uni_OuChan3.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_OuChan3.ttf',
    sampleText: 'སྙན་ངག་གི་གཤོག་ཟུང་བརྐྱངས་ཏེ་རང་དབང་གི་ནམ་མཁར་ལྡིང་།',
    tags: ['Artistic', 'Poetry', 'Refined', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.3,
      descenderRatio: 1.5,
      strokeContrast: 'Medium',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Expansive'
    }
  },
  {
    id: 'monlam-ouchan-4',
    name: 'Monlam Uni OuChan 4',
    tibetanName: 'སྨོན་ལམ་དབུ་ཅན་བཞི་པ།',
    category: 'Uchen',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description: 'Fourth Uchen style in the Bodyig 4.0.1 family — clear structure for general publishing and screens.',
    tibetanDescription: 'སྨོན་ལམ་བོད་ཡིག་བཞི་པའི་དབུ་ཅན་བཞི་པ།',
    cssClass: 'font-monlam-ouchan-4',
    stylesCount: 1,
    weights: [400],
    features: ['Uchen', 'Bodyig 4.0.1'],
    fileSize: '1.15 MB',
    filename: 'Monlam_Uni_OuChan4.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_OuChan4.ttf',
    sampleText: 'བོད་ཀྱི་སྐད་ཡིག་དང་རིག་གཞུང་འཛིན་སྐྱོང་།',
    tags: ['Uchen', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.25,
      descenderRatio: 1.45,
      strokeContrast: 'High',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Standard'
    }
  },
  {
    id: 'monlam-ouchan-5',
    name: 'Monlam Uni OuChan 5',
    tibetanName: 'སྨོན་ལམ་དབུ་ཅན་ལྔ་པ།',
    category: 'Uchen',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description: 'Fifth Uchen style in Bodyig 4.0.1 — complementary display and body text option.',
    tibetanDescription: 'སྨོན་ལམ་བོད་ཡིག་བཞི་པའི་དབུ་ཅན་ལྔ་པ།',
    cssClass: 'font-monlam-ouchan-5',
    stylesCount: 1,
    weights: [400],
    features: ['Uchen', 'Bodyig 4.0.1'],
    fileSize: '1.07 MB',
    filename: 'Monlam_Uni_OuChan5.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_OuChan5.ttf',
    sampleText: 'ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པའི་སྙིང་པོ།',
    tags: ['Uchen', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.25,
      descenderRatio: 1.45,
      strokeContrast: 'Medium',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Standard'
    }
  },
  {
    id: 'monlam-lakdi-ouchen',
    name: 'Monlam Lakdi Ouchen',
    tibetanName: 'སྨོན་ལམ་ལག་བྲིས་དབུ་ཅན།',
    category: 'Uchen',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'Handwritten-style Uchen (ལག་བྲིས་དབུ་ཅན) introduced in Bodyig 4 — warm calligraphic character with full Unicode coverage.',
    tibetanDescription: 'ལག་བྲིས་ཀྱི་ཉམས་ལྡན་དབུ་ཅན་ཡིག་གཟུགས་གསར་པ།',
    cssClass: 'font-monlam-lakdi-ouchen',
    stylesCount: 1,
    weights: [400],
    features: ['Handwritten Uchen', 'New in Bodyig 4', 'Calligraphic'],
    fileSize: '1.74 MB',
    filename: 'Monlam_Lakdi_Ouchen.ttf',
    fileUrl: '/uploads/fonts/Monlam_Lakdi_Ouchen.ttf',
    sampleText: 'ལག་བྲིས་དབུ་ཅན་གྱི་མཛེས་ཉམས་གསལ་བར་མཚོན།',
    tags: ['Handwritten', 'Uchen', 'New', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.3,
      descenderRatio: 1.5,
      strokeContrast: 'High',
      strokeType: 'Cursive Pen',
      spacing: 'Expansive'
    }
  },
  {
    id: 'monlam-chouk',
    name: 'Monlam Uni Chouk',
    tibetanName: 'སྨོན་ལམ་འཁྱུག་ཡིག',
    category: 'Umê',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'Authentic Chuyig / Chouk fast cursive hand script — fluid joined strokes with full Unicode typing consistency.',
    tibetanDescription: 'བོད་ཀྱི་འཁྱུག་ཡིག་རང་བཞིན་གྱི་ཡིག་གཟུགས།',
    cssClass: 'font-monlam-chouk',
    stylesCount: 1,
    weights: [400],
    features: ['Cursive', 'Chuyig', 'Bodyig 4.0.1'],
    fileSize: '1.75 MB',
    filename: 'Monlam_Uni_Chouk.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_Chouk.ttf',
    sampleText: 'བདེ་སྐྱིད་ཀྱི་འབྱུང་གནས་དམ་པའི་ཆོས་ལ་གུས་པས་འཇུག་པར་བྱའོ།',
    tags: ['Cursive', 'Chuyig', 'Umê', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.35,
      descenderRatio: 1.6,
      strokeContrast: 'Low',
      strokeType: 'Cursive Pen',
      spacing: 'Expansive'
    }
  },
  {
    id: 'monlam-chouk-matik',
    name: 'Monlam Uni ChoukMatik',
    tibetanName: 'སྨོན་ལམ་འཁྱུག་མ་ཏིག',
    category: 'Umê',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description: 'Companion ChoukMatik cursive style — denser rhythm for notes and informal manuscripts.',
    tibetanDescription: 'འཁྱུག་ཡིག་གི་རྣམ་པ་གཞན་ཞིག',
    cssClass: 'font-monlam-chouk-matik',
    stylesCount: 1,
    weights: [400],
    features: ['Cursive', 'ChoukMatik', 'Bodyig 4.0.1'],
    fileSize: '1.75 MB',
    filename: 'Monlam_Uni_ChoukMatik.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_ChoukMatik.ttf',
    sampleText: 'འཁྱུག་ཡིག་གི་རྒྱུན་ལྡན་ཉམས་འགྱུར།',
    tags: ['Cursive', 'Umê', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.35,
      descenderRatio: 1.55,
      strokeContrast: 'Low',
      strokeType: 'Cursive Pen',
      spacing: 'Compact'
    }
  },
  {
    id: 'monlam-tsikmachok',
    name: 'Monlam Tsikmachok',
    tibetanName: 'སྨོན་ལམ་ཚུགས་མ་འཁྱུག',
    category: 'Umê',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'Tsugma Akhyug / Tsikmachok — new Bodyig 4 cursive style bridging formal and fast handwriting.',
    tibetanDescription: 'ཚུགས་མ་འཁྱུག་ཡིག་གཟུགས་གསར་པ།',
    cssClass: 'font-monlam-tsikmachok',
    stylesCount: 1,
    weights: [400],
    features: ['New in Bodyig 4', 'Tsugma Akhyug', 'Cursive'],
    fileSize: '1.08 MB',
    filename: 'Monlam_Tsikmachok.ttf',
    fileUrl: '/uploads/fonts/Monlam_Tsikmachok.ttf',
    sampleText: 'ཚུགས་མ་འཁྱུག་གི་ཡིག་གཟུགས་གསར་པ།',
    tags: ['New', 'Cursive', 'Umê', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.3,
      descenderRatio: 1.55,
      strokeContrast: 'Medium',
      strokeType: 'Cursive Pen',
      spacing: 'Standard'
    }
  },
  {
    id: 'monlam-dutsa-1',
    name: 'Monlam Uni Dutsa 1',
    tibetanName: 'སྨོན་ལམ་འབྲུ་ཚ་དང་པོ།',
    category: 'Drutsa',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'Drutsa / Dutsa script with rounded belly curves — historically used in sacred manuscripts and calligraphy scrolls.',
    tibetanDescription: 'འབྲུ་ཚའི་ཡིག་གཟུགས་རྙིང་མའི་ཉམས་ཅན།',
    cssClass: 'font-monlam-dutsa-1',
    stylesCount: 1,
    weights: [400],
    features: ['Drutsa', 'Manuscript', 'Bodyig 4.0.1'],
    fileSize: '1.41 MB',
    filename: 'Monlam_Uni_Dutsa1.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_Dutsa1.ttf',
    sampleText: 'འབྲུ་ཚའི་མཛེས་པ་ཟླ་བའི་འོད་བཞིན་དཀར་ཞིང་གསལ་བར་འཕྲོ།',
    tags: ['Drutsa', 'Manuscript', 'Sacred', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.35,
      descenderRatio: 1.55,
      strokeContrast: 'High',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Standard'
    }
  },
  {
    id: 'monlam-dutsa-2',
    name: 'Monlam Uni Dutsa 2',
    tibetanName: 'སྨོན་ལམ་འབྲུ་ཚ་གཉིས་པ།',
    category: 'Drutsa',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description: 'Second Dutsa style — alternate curvatures for display and ceremonial text.',
    tibetanDescription: 'འབྲུ་ཚའི་རྣམ་པ་གཉིས་པ།',
    cssClass: 'font-monlam-dutsa-2',
    stylesCount: 1,
    weights: [400],
    features: ['Drutsa', 'Display', 'Bodyig 4.0.1'],
    fileSize: '1.73 MB',
    filename: 'Monlam_Uni_Dutsa2.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_Dutsa2.ttf',
    sampleText: 'འབྲུ་ཚ་གཉིས་པའི་ཡིག་གཟུགས།',
    tags: ['Drutsa', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.35,
      descenderRatio: 1.55,
      strokeContrast: 'High',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Standard'
    }
  },
  {
    id: 'monlam-paytsik',
    name: 'Monlam Uni PayTsik',
    tibetanName: 'སྨོན་ལམ་དཔེ་ཚུགས།',
    category: 'Petsug',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'PayTsik (Petsug) pecha printing script — now with expanded mantra / Sanskrit coverage in Bodyig 4.0.1.',
    tibetanDescription: 'དཔེ་ཚུགས་ཡིག་གཟུགས་སྔགས་ཡིག་ཁ་སྣོན་དང་བཅས།',
    cssClass: 'font-monlam-paytsik',
    stylesCount: 1,
    weights: [400],
    features: ['Petsug / PayTsik', 'Mantra coverage', 'Pecha', 'Bodyig 4.0.1'],
    fileSize: '407 KB',
    filename: 'Monlam_Uni_PayTsik.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_PayTsik.ttf',
    sampleText: 'དམ་པའི་ཆོས་འདུལ་བ་རྒྱ་མཚོའི་དོན་གསལ་བར་བྱེད་པའི་དཔེ་ཚུགས།',
    tags: ['Petsug', 'PayTsik', 'Pecha', 'Mantra', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.25,
      descenderRatio: 1.45,
      strokeContrast: 'Medium',
      strokeType: 'Traditional Woodblock',
      spacing: 'Standard'
    }
  },
  {
    id: 'monlam-tiktong',
    name: 'Monlam Uni TikTong',
    tibetanName: 'སྨོན་ལམ་ཐིག་ཐོང་།',
    category: 'Tsugring',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description: 'TikTong formal tall bookhand proportions — disciplined stems for scholarly pecha layouts.',
    tibetanDescription: 'ཐིག་ཐོང་ཡིག་གཟུགས་ཚད་ལྡན།',
    cssClass: 'font-monlam-tiktong',
    stylesCount: 1,
    weights: [400],
    features: ['Formal', 'Tall stems', 'Bodyig 4.0.1'],
    fileSize: '1.83 MB',
    filename: 'Monlam_Uni_TikTong.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_TikTong.ttf',
    sampleText: 'གཞུང་ལུགས་ཀྱི་དོན་རྣམས་ཐིག་ཐོང་གི་ལམ་ནས་གསལ་བར་མཚོན།',
    tags: ['Tsugring', 'Formal', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.4,
      descenderRatio: 1.5,
      strokeContrast: 'Medium',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Standard'
    }
  },
  {
    id: 'monlam-tikrang',
    name: 'Monlam Uni Tikrang',
    tibetanName: 'སྨོན་ལམ་ཐིག་རང་།',
    category: 'Tsugring',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description: 'Tikrang companion formal style — geometric cadence for canonical texts.',
    tibetanDescription: 'ཐིག་རང་ཡིག་གཟུགས།',
    cssClass: 'font-monlam-tikrang',
    stylesCount: 1,
    weights: [400],
    features: ['Formal', 'Canonical', 'Bodyig 4.0.1'],
    fileSize: '1.86 MB',
    filename: 'Monlam_Uni_Tikrang.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_Tikrang.ttf',
    sampleText: 'ཐིག་རང་གི་ཡིག་གཟུགས་ཚད་ལྡན།',
    tags: ['Tsugring', 'Formal', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.4,
      descenderRatio: 1.5,
      strokeContrast: 'Medium',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Standard'
    }
  },
  {
    id: 'monlam-sans',
    name: 'Monlam Uni Sans Serif',
    tibetanName: 'སྨོན་ལམ་མགོ་མེད།',
    category: 'Modern',
    designer: 'Monlam IT Design Team',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'Minimalist Tibetan sans-serif for mobile apps, software UI, and high-density screens.',
    tibetanDescription: 'དེང་རབས་མཉེན་ཆས་དང་ཁ་པར་གྱི་ངོས་སུ་སྤྱོད་བདེ་བའི་མགོ་མེད་ཡིག་གཟུགས།',
    cssClass: 'font-monlam-sans',
    stylesCount: 1,
    weights: [400],
    features: ['Sans Serif', 'UI Optimized', 'Bodyig 4.0.1'],
    fileSize: '1.78 MB',
    filename: 'Monlam_Uni_Sans_Serif.ttf',
    fileUrl: '/uploads/fonts/Monlam_Uni_Sans_Serif.ttf',
    sampleText: 'དེང་རབས་ཀྱི་མཉེན་ཆས་དང་དྲ་རྒྱའི་ཐོག་ཏུ་བཀོལ་སྤྱོད་བྱེད་བདེ་བའི་ཡིག་གཟུགས།',
    tags: ['Sans Serif', 'Modern', 'UI', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.15,
      descenderRatio: 1.35,
      strokeContrast: 'Monoline',
      strokeType: 'Modern Geometric',
      spacing: 'Compact'
    }
  },
  {
    id: 'monlam-lanza',
    name: 'Monlam Lanza',
    tibetanName: 'སྨོན་ལམ་ལཉྫ།',
    category: 'Standard',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'Lanja (Lanza) script newly included in Bodyig 4 — for Sanskrit / ornamental liturgical letterforms.',
    tibetanDescription: 'ལཉྫ་ཡིག་གཟུགས་གསར་པ།',
    cssClass: 'font-monlam-lanza',
    stylesCount: 1,
    weights: [400],
    features: ['Lanja', 'New in Bodyig 4', 'Sanskrit / ornamental'],
    fileSize: '1012 KB',
    filename: 'Monlam_Lanza-Regular.ttf',
    fileUrl: '/uploads/fonts/Monlam_Lanza-Regular.ttf',
    sampleText: 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།',
    tags: ['Lanja', 'New', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.3,
      descenderRatio: 1.4,
      strokeContrast: 'High',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Standard'
    }
  },
  {
    id: 'monlam-yigchung',
    name: 'Monlam Yig-chong',
    tibetanName: 'སྨོན་ལམ་ཡིག་ཆུང་།',
    category: 'Standard',
    designer: 'Ven. Geshe Lobsang Monlam',
    releaseYear: '2025',
    version: '4.0.1',
    description:
      'Compact Yig-chong for footnotes, commentaries, and dense sublinear text.',
    tibetanDescription: 'མཆན་འགྲེལ་དང་ཡིག་ཆུང་འབྲི་བཀོད་ལ་འཚམས་པ།',
    cssClass: 'font-monlam-yigchung',
    stylesCount: 1,
    weights: [400],
    features: ['Micro-typography', 'Compact', 'Bodyig 4.0.1'],
    fileSize: '67 KB',
    filename: 'Monlam_yig-chong.TTF',
    fileUrl: '/uploads/fonts/Monlam_yig-chong.TTF',
    sampleText: 'འདི་ནི་མཆན་འགྲེལ་དང་ཡིག་ཆུང་གི་ཆེད་དུ་བཟོས་པའི་ཡིག་གཟུགས་ཡིན།',
    tags: ['Footnotes', 'Compact', 'Bodyig 4'],
    metrics: {
      ascenderRatio: 1.1,
      descenderRatio: 1.25,
      strokeContrast: 'Medium',
      strokeType: 'Calligraphic Reed Pen',
      spacing: 'Compact'
    }
  }
];

/** Default catalog / card preview preset. */
export const DEFAULT_PRESET_ID = 'jamyang-praise';

export function resolveDefaultPreset(presets: PresetText[]): PresetText {
  return presets.find((p) => p.id === DEFAULT_PRESET_ID) ?? presets[0];
}

export const PRESET_TEXTS: PresetText[] = [
  {
    id: 'jamyang-praise',
    title: 'Praise of Mañjuśrī',
    tibetanTitle: 'འཇམ་དབྱངས་བསྟོད་པ།',
    content:
      'དཀར་མཛེས་ཨ་ཡིག་ལས་འཁྲུངས་ཡེ་ཤེས་གཏེར།།\nཕས་རྒོལ་ཝ་སྐྱེས་ཟིལ་གནོན་གདོང་ལྔ་བཞིན།།\nཆགས་ཐོགས་ཀུན་བྲལ་མཚུངས་མེད་འཇམ་དབྱངས་རྗེ།།\nམ་ཧཱ་མཁས་པའི་གཙོ་བོ་ཉིད་གྱུར་ཅིག།།',
    translation:
      'Born from the white, beautiful letter A—the treasure of wisdom; like the five-faced conqueror of Māra and the gods; peerless Mañjuśrī, free from all attachment—may I become the chief of great adepts.'
  },
  {
    id: 'alphabet',
    title: 'The 30 Consonants',
    tibetanTitle: 'ཀ་མད་སུམ་ཅུ།',
    content: 'ཀ་ཁ་ག་ང་། ཅ་ཆ་ཇ་ཉ། ཏ་ཐ་ད་ན། པ་ཕ་བ་མ། ཙ་ཚ་ཛ་ཝ། ཞ་ཟ་འ་ཡ། ར་ལ་ཤ་ས། ཧ་ཨ།',
    translation: 'The thirty root consonants of the Tibetan script created by Thonmi Sambhota'
  },
  {
    id: 'mantra',
    title: 'Six Syllable Mantra',
    tibetanTitle: 'མ་ཎི་ཡིག་དྲུག',
    content: 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།',
    translation: 'Om Mani Padme Hum (The Great Compassion Mantra)'
  },
  {
    id: 'pangram',
    title: 'Auspicious Blessing Pangram',
    tibetanTitle: 'བཀྲ་ཤིས་ཤིས་བརྗོད།',
    content:
      'ཨེ་མ་ཧོ། ཕྱོགས་བཅུའི་རྒྱལ་བ་སྲས་དང་བཅས་པ་རྣམས་ཀྱིས་བདག་ཅག་འགྲོ་བ་ཀུན་ལ་བྱིན་གྱིས་བརླབས་པར་གྱུར་ཅིག',
    translation:
      'E-ma-ho! May all the Buddhas and Bodhisattvas of the ten directions grant their supreme blessings unto all beings.'
  },
  {
    id: 'four-immeasurables',
    title: 'The Four Immeasurables',
    tibetanTitle: 'ཚད་མེད་བཞི།',
    content:
      'སེམས་ཅན་ཐམས་ཅད་བདེ་བ་དང་བདེ་བའི་རྒྱུ་དང་ལྡན་པར་གྱུར་ཅིག སྡུག་བསྔལ་དང་སྡུག་བསྔལ་གྱི་རྒྱུ་དང་བྲལ་བར་གྱུར་ཅིག',
    translation:
      'May all beings possess happiness and its causes; may they be free from suffering and its causes.'
  },
  {
    id: 'complex-stacks',
    title: 'Complex Stacks & Sanskrit',
    tibetanTitle: 'བརྩེགས་ཡིག་དང་ལེགས་སྦྱར།',
    content:
      'བསྒྲུབས། བསྐྱེད། བརྩམས། བརྒྱན། མཁྱེན། ཀྵྨྲྱཱ། ཨོཾ་ཨཱཿཧཱུྃ་ཧྲཱིཿབཛྲ་གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ།',
    translation:
      'Test for complex consonant stacks, prefixes, superscripts, subjoined letters, and Sanskrit dharani ligatures.'
  },
  {
    id: 'numerals',
    title: 'Tibetan Numerals',
    tibetanTitle: 'བོད་ཡིག་ཨང་ཀི།',
    content: '༡ ༢ ༣ ༤ ༥ ༦ ༧ ༨ ༩ ༠ ། ༡༠༨ ༢༠༢༦ ། ༡༩༥༩',
    translation: 'Traditional Tibetan numerical glyphs: 1 2 3 4 5 6 7 8 9 0'
  },
  {
    id: 'bilingual',
    title: 'Bilingual Quote',
    tibetanTitle: 'བོད་དབྱིན་ཤན་སྦྱར་གྱི་སྡོམ་ཚིག།',
    content:
      'བོད་ཀྱི་ཡི་གེ་དང་རིག་གནས། Tibetan Typography: Living Calligraphy Across Millennia.',
    translation: 'Tibetan script & culture: harmonious bilingual typesetting.'
  }
];
