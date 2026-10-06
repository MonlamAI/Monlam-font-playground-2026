import React, { useEffect } from 'react';

/** Injects @font-face for admin/public preview when a file URL exists. */
export function useInjectFontFace(family: string, fileUrl: string | null | undefined) {
  useEffect(() => {
    if (!fileUrl || !family) return;
    const id = `ff-${family.replace(/[^a-z0-9-]/gi, '-')}`;
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = `
      @font-face {
        font-family: '${family}';
        src: url('${fileUrl}');
        font-display: swap;
      }
    `;
  }, [family, fileUrl]);
}

export function FontPreview({
  family,
  fileUrl,
  sample,
  className = ''
}: {
  family: string;
  fileUrl?: string | null;
  sample: string;
  className?: string;
}) {
  useInjectFontFace(family, fileUrl);
  return (
    <div
      className={`tibetan-text text-2xl leading-relaxed break-words ${className}`}
      style={{
        fontFamily: fileUrl
          ? `'${family}', 'Noto Serif Tibetan', serif`
          : undefined,
        lineHeight: 1.85,
        wordBreak: 'normal'
      }}
    >
      {sample || 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།'}
    </div>
  );
}
