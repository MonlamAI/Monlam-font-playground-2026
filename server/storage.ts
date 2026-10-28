import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

function resolveUploadsDir(): string {
  const configured = process.env.UPLOADS_DIR?.trim();
  if (!configured) return path.join(__dirname, 'uploads');
  if (path.isAbsolute(configured)) return configured;
  return path.normalize(path.join(repoRoot, configured));
}

/** Project-local upload root (overridable via UPLOADS_DIR). */
const localUploadDir = resolveUploadsDir();

export type StoredFile = {
  /** Relative storage key under the uploads root, e.g. fonts/uuid-name.ttf */
  storageKey: string;
  fileUrl: string;
  fileSize: string;
  filename: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Persist an uploaded font/keyboard file under the project's local uploads directory.
 * Served publicly at /uploads/...
 */
export async function storeUpload(
  file: Express.Multer.File,
  folder: 'fonts' | 'keyboards' | 'feedback'
): Promise<StoredFile> {
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `${folder}/${randomUUID()}-${safeName}`;
  const fileSize = formatSize(file.size);

  const destDir = path.join(localUploadDir, folder);
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, path.basename(key));
  fs.writeFileSync(dest, file.buffer);

  const fileUrl = `/uploads/${folder}/${path.basename(key)}`;
  return { storageKey: key, fileUrl, fileSize, filename: safeName };
}

export async function deleteStoredFile(storageKey: string | null | undefined) {
  if (!storageKey) return;
  // Prevent path traversal
  const resolved = path.resolve(localUploadDir, storageKey);
  if (!resolved.startsWith(path.resolve(localUploadDir) + path.sep)) {
    console.warn('Refused to delete path outside uploads dir', storageKey);
    return;
  }
  if (fs.existsSync(resolved)) fs.unlinkSync(resolved);
}

export function getLocalUploadDir() {
  fs.mkdirSync(localUploadDir, { recursive: true });
  return localUploadDir;
}
