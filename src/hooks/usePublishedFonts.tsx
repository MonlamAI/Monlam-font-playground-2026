import { useEffect, useState } from 'react';
import { MONLAM_FONTS } from '../data/fontsData';
import { publicApi } from '../admin/api';
import type { FontItem } from '../types/font';
import type { FontAsset } from '../types/cms';
import { useInjectFontFace } from '../admin/FontPreview';

function assetToFontItem(asset: FontAsset): FontItem {
  return {
    id: asset.id,
    name: asset.name,
    tibetanName: asset.tibetanName,
    category: asset.category,
    fontKind: asset.fontKind || 'normal',
    designer: asset.designer,
    releaseYear: asset.releaseYear,
    description: asset.description,
    tibetanDescription: asset.tibetanDescription,
    cssClass: asset.cssClass,
    stylesCount: asset.stylesCount,
    weights: asset.weights,
    features: asset.features,
    fileSize: asset.fileSize,
    filename: asset.filename,
    sampleText: asset.sampleText,
    tags: asset.tags,
    metrics: asset.metrics,
    fileUrl: asset.fileUrl,
    version: asset.version,
    supportedScripts: asset.supportedScripts,
    keyboardId: asset.keyboardId,
    sortOrder: asset.sortOrder,
    presetConfigs: asset.presetConfigs || []
  };
}

/** Loads published fonts from API; falls back to seed data if API is offline. */
export function usePublishedFonts() {
  const [fonts, setFonts] = useState<FontItem[]>(MONLAM_FONTS);
  const [source, setSource] = useState<'api' | 'seed'>('seed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicApi
      .fonts()
      .then((assets) => {
        if (cancelled) return;
        if (assets.length > 0) {
          setFonts(assets.map(assetToFontItem));
          setSource('api');
        }
      })
      .catch(() => {
        if (!cancelled) setSource('seed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { fonts, source, loading };
}

/** Injects @font-face rules for fonts that have file URLs. */
export function PublishedFontFaces({ fonts }: { fonts: FontItem[] }) {
  return (
    <>
      {fonts.map((font) =>
        font.fileUrl ? (
          <FontFaceInjector key={font.id} family={font.name} fileUrl={font.fileUrl} />
        ) : null
      )}
    </>
  );
}

function FontFaceInjector({ family, fileUrl }: { family: string; fileUrl: string }) {
  useInjectFontFace(family, fileUrl);
  return null;
}
