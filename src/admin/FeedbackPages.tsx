import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Paperclip, CheckCircle2, Archive } from 'lucide-react';
import { adminApi } from './api';
import type { FeedbackItem, FeedbackStatus } from '../types/feedback';

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const statusStyle: Record<FeedbackStatus, string> = {
  new: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 border-amber-200 dark:border-amber-800',
  reviewed:
    'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
  archived:
    'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300 border-gray-200 dark:border-slate-700'
};

export function FeedbackListPage() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [filter, setFilter] = useState<FeedbackStatus | 'all'>('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .listFeedback(filter === 'all' ? undefined : filter)
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Feedback</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Review user suggestions, issues, and attachments submitted from the public site.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl self-start">
          {(['all', 'new', 'reviewed', 'archived'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filter === s
                  ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      {loading && <p className="mt-6 text-sm text-gray-500">Loading…</p>}

      {!loading && items.length === 0 && (
        <div className="mt-10 text-center text-sm text-gray-500 dark:text-slate-400">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
          No feedback yet.
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/admin/feedback/${item.id}`}
              className="block bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-800 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900 dark:text-slate-100 line-clamp-2 whitespace-pre-wrap">
                    {item.message}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-slate-400">
                    <span>{formatWhen(item.createdAt)}</span>
                    {item.contactEmail && (
                      <>
                        <span>·</span>
                        <span>{item.contactEmail}</span>
                      </>
                    )}
                    {item.attachments.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          {item.attachments.length}
                        </span>
                      </>
                    )}
                    {item.emailSent ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Email sent
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">Email not sent</span>
                    )}
                  </div>
                </div>
                <span
                  className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusStyle[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FeedbackDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<FeedbackItem | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminApi
      .getFeedback(id)
      .then(setItem)
      .catch((e) => setError(e.message));
  }, [id]);

  const setStatus = async (status: FeedbackStatus) => {
    try {
      setBusy(true);
      const updated = await adminApi.updateFeedbackStatus(id, status);
      setItem(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this feedback and its attachments permanently?')) return;
    try {
      setBusy(true);
      await adminApi.deleteFeedback(id);
      navigate('/admin/feedback');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
      setBusy(false);
    }
  };

  if (error && !item) {
    return (
      <div className="p-6">
        <p className="text-sm text-rose-600">{error}</p>
        <Link to="/admin/feedback" className="text-sm text-blue-600 mt-2 inline-block">
          ← Back to feedback
        </Link>
      </div>
    );
  }

  if (!item) {
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/feedback" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← All feedback
        </Link>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusStyle[item.status]}`}
        >
          {item.status}
        </span>
      </div>

      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Feedback detail</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          Submitted {formatWhen(item.createdAt)}
          {item.contactEmail ? ` · ${item.contactEmail}` : ''}
        </p>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
        <p className="text-sm text-gray-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
          {item.message}
        </p>
      </div>

      <div className="text-xs text-gray-500 dark:text-slate-400 space-y-1">
        <p>
          Email notification:{' '}
          {item.emailSent ? (
            <span className="text-emerald-600 dark:text-emerald-400">sent</span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400">not sent</span>
          )}
        </p>
        {item.emailError && <p className="text-amber-700 dark:text-amber-300">{item.emailError}</p>}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
          Attachments ({item.attachments.length})
        </h2>
        {item.attachments.length === 0 ? (
          <p className="text-xs text-gray-500">No attachments</p>
        ) : (
          <ul className="space-y-3">
            {item.attachments.map((att) => (
              <li
                key={att.id}
                className="rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden bg-gray-50 dark:bg-slate-950/50"
              >
                {att.mimeType.startsWith('image/') ? (
                  <a href={att.fileUrl} target="_blank" rel="noreferrer" className="block">
                    <img
                      src={att.fileUrl}
                      alt={att.filename}
                      className="max-h-72 w-full object-contain bg-black/5 dark:bg-black/20"
                    />
                  </a>
                ) : att.mimeType.startsWith('video/') ? (
                  <video src={att.fileUrl} controls className="w-full max-h-96 bg-black" />
                ) : null}
                <div className="px-3 py-2 flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-gray-800 dark:text-slate-200 truncate">
                    {att.filename}
                  </span>
                  <a
                    href={att.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 shrink-0 hover:underline"
                  >
                    Open ({att.fileSize})
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
        <button
          type="button"
          disabled={busy || item.status === 'reviewed'}
          onClick={() => setStatus('reviewed')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-50"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Mark reviewed
        </button>
        <button
          type="button"
          disabled={busy || item.status === 'archived'}
          onClick={() => setStatus('archived')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          <Archive className="w-3.5 h-3.5" />
          Archive
        </button>
        <button
          type="button"
          disabled={busy || item.status === 'new'}
          onClick={() => setStatus('new')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          Mark new
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={remove}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-50 ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
