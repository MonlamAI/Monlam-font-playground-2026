import type { AppLocale } from '../i18n/localeStorage';

export type BodyigInstallOs = 'windows' | 'mac';

const MAC_STEPS = 6;
const WINDOWS_STEPS = 4;

function guideLang(locale: AppLocale): 'en' | 'bo' {
  return locale === 'bo' ? 'bo' : 'en';
}

export function bodyigVisualGuideSlides(os: BodyigInstallOs, locale: AppLocale): string[] {
  const lang = guideLang(locale);
  const count = os === 'mac' ? MAC_STEPS : WINDOWS_STEPS;
  const base = `/install-guides/${os}/${lang}`;
  return Array.from({ length: count }, (_, i) => `${base}/${i + 1}.png`);
}

export function bodyigVisualGuidePdfUrl(os: BodyigInstallOs): string {
  return os === 'mac'
    ? '/install-guides/mac/bodyig-visual-guide-mac.pdf'
    : '/install-guides/windows/bodyig-visual-guide-windows.pdf';
}

export function bodyigVisualGuidePdfFilename(os: BodyigInstallOs): string {
  return os === 'mac'
    ? 'Visual-Guide-Monlam-Bodyig-v5-Mac.pdf'
    : 'Visual-Guide-Monlam-Bodyig-v5-Windows.pdf';
}
