export type FormUploadProgress = {
  phase: 'uploading' | 'processing';
  loaded: number;
  total: number;
  /** 0–100; upload caps at 99 until the server responds */
  percent: number;
};

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
        reject(new Error(xhr.responseText?.slice(0, 200) || xhr.statusText || 'Request failed'));
        return;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        const err = body as { error?: string };
        reject(new Error(err.error || `Request failed (${xhr.status})`));
        return;
      }
      resolve(body as T);
    };

    xhr.onerror = () => reject(new Error('Network error while uploading'));
    xhr.onabort = () => reject(new Error('Upload cancelled'));
    xhr.send(form);
  });
}
