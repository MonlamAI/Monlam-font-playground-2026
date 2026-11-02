/** Public site origin for canonical URLs, Open Graph, and sitemap (no trailing slash). */
export function getSiteOrigin(): string {
  const configured = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  if (configured) return configured.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://monlamfonts.com';
}
