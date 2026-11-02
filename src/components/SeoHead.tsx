import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { getSiteOrigin } from '../config/siteUrl';
import { parseAppTabParam } from '../utils/appTabUrl';
import type { AppTab } from './Header';

type SeoPage = AppTab | 'licence' | 'admin';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const selector = extra?.hreflang
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
  if (extra?.hreflang) el.hreflang = extra.hreflang;
}

function upsertJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

type SeoHeadProps = {
  /** Force page kind (e.g. admin noindex). */
  page?: SeoPage;
};

export const SeoHead: React.FC<SeoHeadProps> = ({ page: pageOverride }) => {
  const { locale, t } = useI18n();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const page: SeoPage = React.useMemo(() => {
    if (pageOverride) return pageOverride;
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname === '/licence') return 'licence';
    return parseAppTabParam(searchParams.get('tab'));
  }, [location.pathname, pageOverride, searchParams]);

  React.useEffect(() => {
    const origin = getSiteOrigin();
    const path = `${location.pathname}${location.search}`;
    const canonical = `${origin}${path === '/' ? '/' : path}`;

    if (page === 'admin') {
      document.title = 'Monlam CMS';
      upsertMeta('name', 'robots', 'noindex, nofollow');
      return;
    }

    upsertMeta('name', 'robots', 'index, follow, max-image-preview:large');

    const tabTitleKey =
      page === 'catalog'
        ? 'seo.tabTypefaces'
        : page === 'compare'
          ? 'seo.tabCompare'
          : page === 'install'
            ? 'seo.tabInstall'
            : page === 'licence'
              ? 'seo.tabLicence'
              : page === 'typing'
                ? 'seo.tabTyping'
                : page === 'guide'
                  ? 'seo.tabGuide'
                  : null;

    const tabPart = tabTitleKey ? t(tabTitleKey) : '';
    const title =
      tabPart && page !== 'catalog'
        ? `${t('seo.siteName')} — ${tabPart} | ${t('seo.siteNameTibetan')}`
        : t('seo.documentTitle');

    const description = t('seo.metaDescription');
    const keywords = t('seo.keywords');

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:site_name', t('seo.siteName'));
    upsertMeta('property', 'og:locale', locale === 'bo' ? 'bo_IN' : 'en_US');
    upsertMeta('property', 'og:image', `${origin}/logos/bodyig.svg`);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', `${origin}/logos/bodyig.svg`);

    upsertLink('canonical', canonical);
    upsertLink('alternate', `${origin}/`, { hreflang: 'x-default' });
    upsertLink('alternate', `${origin}/`, { hreflang: 'en' });
    upsertLink('alternate', `${origin}/`, { hreflang: 'bo' });

    upsertJsonLd('seo-jsonld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: t('seo.siteName'),
      alternateName: [
        t('seo.siteNameTibetan'),
        'Monlam Bodyig',
        'Monlam Bod Yig',
        'Monlam Font Playground',
        'Monlam Tibetan fonts'
      ],
      url: `${origin}/`,
      description,
      inLanguage: ['en', 'bo'],
      publisher: {
        '@type': 'Organization',
        name: t('seo.organization'),
        url: `${origin}/`
      }
    });

    upsertJsonLd('seo-jsonld-app', {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: t('seo.siteName'),
      alternateName: [t('seo.siteNameTibetan'), 'Monlam Bodyig'],
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web',
      url: `${origin}/`,
      description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    });
  }, [locale, location.pathname, location.search, page, t]);

  return null;
};
