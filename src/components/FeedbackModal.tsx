import React from 'react';
import {
  MessageSquarePlus,
  Upload,
  X,
  Image as ImageIcon,
  Film,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import type { FeedbackQuota, FeedbackSubmitResponse } from '../types/feedback';
import { useI18n } from '../i18n/I18nProvider';
import { useLocaleFormatters } from '../hooks/useLocaleFormatters';
import { localizeDigitsInString } from '../utils/localeNumber';
import type { AppLocale } from '../i18n/localeStorage';

const MAX_FILES = 5;
const MAX_BYTES = 50 * 1024 * 1024;
const ACCEPT =
  'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov';

function formatBytes(n: number, locale: AppLocale) {
  let s: string;
  if (n < 1024) s = `${n} B`;
  else if (n < 1024 * 1024) s = `${(n / 1024).toFixed(0)} KB`;
  else s = `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return localizeDigitsInString(s, locale);
}

function formatResetUtc(iso: string, locale: AppLocale) {
  const d = new Date(iso);
  return d.toLocaleString(locale === 'bo' ? 'en-US' : locale, {
    timeZone: 'UTC',
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function isAllowedFile(file: File) {
  const mime = file.type;
  if (
    [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ].includes(mime)
  ) {
    return true;
  }
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'].includes(ext || '');
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { t, locale } = useI18n();
  const fmt = useLocaleFormatters();
  const [message, setMessage] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [files, setFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<
    { name: string; url: string; kind: 'image' | 'video' }[]
  >([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState<{
    emailSent: boolean;
    emailWarning: string | null;
  } | null>(null);
  const [quota, setQuota] = React.useState<FeedbackQuota | null>(null);
  const [quotaLoading, setQuotaLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose, submitting]);

  const refreshQuota = React.useCallback(async (email?: string) => {
    setQuotaLoading(true);
    try {
      const q = new URLSearchParams();
      const trimmed = (email ?? contactEmail).trim();
      if (trimmed) q.set('contactEmail', trimmed);
      const res = await fetch(`/api/feedback/quota?${q.toString()}`, { credentials: 'include' });
      if (res.ok) {
        setQuota((await res.json()) as FeedbackQuota);
      }
    } catch {
      /* quota hint is optional */
    } finally {
      setQuotaLoading(false);
    }
  }, [contactEmail]);

  React.useEffect(() => {
    if (!isOpen) return;
    setSuccess(null);
    setError('');
    void refreshQuota();
  }, [isOpen, refreshQuota]);

  React.useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => void refreshQuota(), 400);
    return () => window.clearTimeout(t);
  }, [contactEmail, isOpen, refreshQuota]);

  const resetForm = () => {
    setMessage('');
    setContactEmail('');
    setFiles([]);
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const addFiles = (list: FileList | File[]) => {
    setError('');
    const incoming = Array.from(list);
    const next = [...files];
    for (const file of incoming) {
      if (next.length >= MAX_FILES) {
        setError(`You can attach up to ${MAX_FILES} files.`);
        break;
      }
      if (!isAllowedFile(file)) {
        setError(
          `“${file.name}” is not an allowed type. Use images (JPEG/PNG/GIF/WebP) or videos (MP4/WebM/MOV).`
        );
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`“${file.name}” exceeds the 50 MB limit.`);
        continue;
      }
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      next.push(file);
    }
    setFiles(next);
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return next.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
        kind: f.type.startsWith('video/') ? 'video' : 'image'
      }));
    });
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return next.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
        kind: f.type.startsWith('video/') ? 'video' : 'image'
      }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

    const trimmed = message.trim();
    if (trimmed.length < 5) {
      setError('Please enter at least 5 characters of feedback.');
      return;
    }

    try {
      setSubmitting(true);
      const form = new FormData();
      form.append('message', trimmed);
      if (contactEmail.trim()) form.append('contactEmail', contactEmail.trim());
      files.forEach((f) => form.append('attachments', f));

      const res = await fetch('/api/feedback', {
        method: 'POST',
        body: form,
        credentials: 'include'
      });
      const data = (await res.json().catch(() => ({}))) as FeedbackSubmitResponse & {
        error?: string;
        code?: string;
        limit?: number;
        resetAt?: string;
      };
      if (res.status === 429 && data.code === 'FEEDBACK_DAILY_LIMIT') {
        const limit = data.limit ?? quota?.limit ?? 3;
        const resetAt = data.resetAt ?? quota?.resetAt ?? '';
        setError(
          t('feedbackModal.dailyLimit', {
            limit: fmt.n(limit),
            resetTime: resetAt ? formatResetUtc(resetAt, locale) : '—'
          })
        );
        if (data.resetAt) {
          setQuota({
            limit,
            used: limit,
            remaining: 0,
            resetAt: data.resetAt
          });
        } else {
          void refreshQuota();
        }
        return;
      }
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      if (data.quota) setQuota(data.quota);

      setSuccess({
        emailSent: data.emailSent,
        emailWarning: data.emailWarning
      });
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const atDailyLimit = quota != null && quota.remaining <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />

      <div className="relative min-h-full flex items-end sm:items-center justify-center p-0 sm:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden max-h-[min(92vh,880px)] flex flex-col"
        >
          <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-1.5">
                <MessageSquarePlus className="w-3 h-3" />
                {t('feedbackModal.badge')}
              </div>
              <h2
                id="feedback-modal-title"
                className="text-lg font-bold text-gray-900 dark:text-slate-100 tracking-tight"
              >
                {t('feedbackModal.title')}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                {t('feedbackModal.subtitle')}
              </p>
              {quota && !quotaLoading && (
                <p
                  className={`mt-1.5 text-[11px] leading-relaxed ${
                    atDailyLimit
                      ? 'text-amber-700 dark:text-amber-300'
                      : 'text-gray-500 dark:text-slate-500'
                  }`}
                >
                  {atDailyLimit
                    ? t('feedbackModal.quotaNone', { limit: fmt.n(quota.limit) })
                    : t('feedbackModal.quotaRemaining', {
                        remaining: fmt.n(quota.remaining),
                        limit: fmt.n(quota.limit)
                      })}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
              aria-label={t('feedbackModal.closeAria')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
            {success && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 space-y-1"
              >
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {t('feedbackModal.successTitle')}
                </div>
                <p className="text-xs text-emerald-700/90 dark:text-emerald-300/90 pl-6">
                  {success.emailSent
                    ? t('feedbackModal.successSavedEmail')
                    : t('feedbackModal.successSavedCms')}
                </p>
                {success.emailWarning && (
                  <p className="text-xs text-amber-700 dark:text-amber-300 pl-6 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{success.emailWarning}</span>
                  </p>
                )}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3.5 flex items-start gap-2 text-sm text-rose-800 dark:text-rose-200"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form id="feedback-modal-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="feedback-message"
                  className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-1.5"
                >
                  {t('feedbackModal.messageLabel')} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={8000}
                  placeholder={t('feedbackModal.messagePlaceholder')}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-950/60 px-3.5 py-3 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 resize-y min-h-[120px]"
                  required
                  autoFocus
                />
                <div className="mt-1 text-[11px] text-gray-400 dark:text-slate-500 text-right">
                  {fmt.n(message.length)} / {fmt.n(8000)}
                </div>
              </div>

              <div>
                <label
                  htmlFor="feedback-email"
                  className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-1.5"
                >
                  {t('feedbackModal.emailLabel')}{' '}
                  <span className="text-gray-400 dark:text-slate-500 font-normal">
                    {t('feedbackModal.emailOptional')}
                  </span>
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder={t('feedback.emailPlaceholder')}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-950/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
                />
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-1">
                  {t('feedbackModal.attachments')}
                </span>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
                  {t('feedbackModal.attachmentsHint', {
                    max: MAX_FILES,
                    maxMb: formatBytes(MAX_BYTES, locale)
                  })}
                </p>

                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT}
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) addFiles(e.target.files);
                    e.target.value = '';
                  }}
                />

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-950/40 px-4 py-5 text-sm text-gray-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition"
                >
                  <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-800 dark:text-slate-200 text-xs">
                    {t('feedbackModal.chooseFiles')}
                  </span>
                </button>

                {files.length > 0 && (
                  <ul className="mt-2.5 space-y-2">
                    {files.map((file, i) => (
                      <li
                        key={`${file.name}-${file.size}-${i}`}
                        className="flex items-center gap-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-950/50 p-2"
                      >
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                          {previews[i]?.kind === 'video' ? (
                            <video
                              src={previews[i].url}
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : previews[i] ? (
                            <img
                              src={previews[i].url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : file.type.startsWith('video/') ? (
                            <Film className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-gray-900 dark:text-slate-100 truncate">
                            {file.name}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-slate-400">
                            {formatBytes(file.size, locale)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </form>
          </div>

          <div className="px-5 py-3.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-950/40 flex justify-end shrink-0">
            <button
              type="submit"
              form="feedback-modal-form"
              disabled={submitting || atDailyLimit}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('feedbackModal.submitting')}
                </>
              ) : (
                <>
                  <MessageSquarePlus className="w-4 h-4" />
                  {t('feedbackModal.submit')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
