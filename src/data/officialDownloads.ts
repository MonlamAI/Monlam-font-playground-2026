/**
 * Official Monlam IT Font & Keyboard Suite downloads
 * Source: https://monlamit.com/software/2 (Monlam Bodyig v4.0)
 * Releases: https://github.com/MonlamTech/Monlam-App-Store/releases
 */

export type OfficialPlatform = 'mac' | 'windows' | 'ios';

export interface OfficialDownload {
  id: string;
  name: string;
  tibetanName?: string;
  version: string;
  platform: OfficialPlatform;
  label: string;
  url: string;
  fileSize?: string;
  description: string;
  sourcePage: string;
}

/** Primary Font & Keyboard Suite — Monlam Bodyig v4.0.1 */
export const BODYIG_SUITE = {
  id: 'monlam-bodyig-4',
  name: 'Monlam Bodyig',
  tibetanName: 'སྨོན་ལམ་བོད་ཡིག་བཞི་བ།',
  version: 'v4.0.1',
  sourcePage: 'https://monlamit.com/software/2',
  description:
    'Official Monlam Font & Keyboard Complete Suite. Includes Tibetan Unicode typefaces (including PayTsik, Lanja, Tsugma Akhyug, and Uchen Lagbris) and keyboard installers for your operating system.',
} as const;

export const OFFICIAL_BODYIG_DOWNLOADS: OfficialDownload[] = [
  {
    id: 'bodyig-4-mac',
    name: BODYIG_SUITE.name,
    tibetanName: BODYIG_SUITE.tibetanName,
    version: BODYIG_SUITE.version,
    platform: 'mac',
    label: 'Download for Mac',
    url: 'https://github.com/MonlamTech/Monlam-App-Store/releases/download/4.0.1/Monlam.Bodyig.4.0.1.Mac.zip',
    fileSize: '≈11 MB',
    description: 'Monlam Bodyig v4.0.1 installer package for macOS',
    sourcePage: BODYIG_SUITE.sourcePage,
  },
  {
    id: 'bodyig-4-windows',
    name: BODYIG_SUITE.name,
    tibetanName: BODYIG_SUITE.tibetanName,
    version: BODYIG_SUITE.version,
    platform: 'windows',
    label: 'Download for Windows',
    url: 'https://github.com/MonlamTech/Monlam-App-Store/releases/download/4.0.1/Monlam.Bodyig.4.0.1.Win.zip',
    fileSize: '≈11 MB',
    description: 'Monlam Bodyig v4.0.1 installer package for Windows',
    sourcePage: BODYIG_SUITE.sourcePage,
  },
];

/** Extra Windows keyboard package listed on Monlam App Store */
export const OFFICIAL_KEYBOARD_DOWNLOADS: OfficialDownload[] = [
  {
    id: 'bodyig-keyboard-win-2025',
    name: 'Monlam Bodyig Keyboard',
    tibetanName: 'སྨོན་ལམ་མཐེབ་གཞོང་།',
    version: '2025',
    platform: 'windows',
    label: 'Windows Keyboard (2025)',
    url: 'https://github.com/MonlamTech/Monlam-App-Store/releases/download/v3/Monlam.bodyig.Keboard.2025.UAS.zip',
    description: 'Monlam Bodyig v3 keyboard package for Windows 10/11',
    sourcePage: 'https://monlamit.com/software/3',
  },
  {
    id: 'monlam-keyboard-ios',
    name: 'Monlam Keyboard',
    tibetanName: 'སྨོན་ལམ་མཐེབ་གཞོང་།',
    version: 'App Store',
    platform: 'ios',
    label: 'iOS App Store',
    url: 'https://apps.apple.com/in/app/monlam-keyboard/id6736928098',
    description: 'Monlam Keyboard for iPhone and iPad',
    sourcePage: 'https://monlamit.com/software/3',
  },
];

export function getBodyigDownload(platform: 'mac' | 'windows'): OfficialDownload {
  return OFFICIAL_BODYIG_DOWNLOADS.find((d) => d.platform === platform)!;
}

export function openOfficialDownload(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
