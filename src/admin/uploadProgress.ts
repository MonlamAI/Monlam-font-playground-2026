export type FormUploadProgress = {
  phase: 'local' | 'uploading' | 'processing';
  loaded: number;
  total: number;
  /** 0–100; upload caps at 99 until the server responds */
  percent: number;
};

/** Shown when CDN/origin rejects a large keyboard .zip (e.g. Cloudflare ~100 MB). */
export const LARGE_PACKAGE_UPLOAD_HINT =
  'Cloudflare (orange-cloud proxy) allows about 100 MB per upload. For Save, use a Mac-only zip under 100 MB, or raise limits on nginx (client_max_body_size 300m) and bypass Cloudflare for admin/API traffic.';

export function httpUploadErrorMessage(status: number, responseText: string): string {
  const tooLarge =
    status === 413 ||
    /413/i.test(responseText) ||
    /Payload Too Large|Content Too Large/i.test(responseText);
  if (tooLarge) {
    return `Upload rejected — file too large for the CDN or web server. ${LARGE_PACKAGE_UPLOAD_HINT}`;
  }
  if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
    return `Request failed (${status}). ${tooLarge ? LARGE_PACKAGE_UPLOAD_HINT : 'Try again or check server logs.'}`;
  }
  return responseText.slice(0, 240) || `Request failed (${status})`;
}

export function formatUploadBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function requestFormDataWithProgress<T>(
  url: string,
  form: FormData,
  onProgress?: (progress: FormUploadProgress) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.withCredentials = true;

    xhr.upload.addEventListener('progress', (event) => {
      if (!onProgress || !event.lengthComputable) return;
      onProgress({
        phase: 'uploading',
        loaded: event.loaded,
        total: event.total,
        percent: Math.min(99, Math.round((event.loaded / event.total) * 100))
      });
    });

    xhr.upload.addEventListener('loadend', () => {
      onProgress?.({ phase: 'processing', loaded: 0, total: 0, percent: 100 });
    });

    xhr.onload = () => {
      let body: { error?: string } | T;
      try {
        body = JSON.parse(xhr.responseText) as { error?: string } | T;
      } catch {
        reject(
          new Error(httpUploadErrorMessage(xhr.status, xhr.responseText || xhr.statusText))
        );
        return;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        const err = body as { error?: string };
        reject(
          new Error(
            err.error || httpUploadErrorMessage(xhr.status, xhr.responseText || xhr.statusText)
          )
        );
        return;
      }
      resolve(body as T);
    };

    xhr.onerror = () => reject(new Error('Network error while uploading'));
    xhr.onabort = () => reject(new Error('Upload cancelled'));
    xhr.send(form);
  });
}
