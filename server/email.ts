import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { getLocalUploadDir } from './storage';

export type FeedbackEmailAttachment = {
  filename: string;
  storageKey: string;
  mimeType: string;
};

export type FeedbackEmailPayload = {
  id: string;
  message: string;
  contactEmail: string | null;
  createdAt: string;
  attachments: FeedbackEmailAttachment[];
};

export type EmailResult = {
  sent: boolean;
  error?: string;
};

function getAdminEmail(): string | null {
  const email = (process.env.ADMIN_EMAIL || '').trim();
  return email || null;
}

function createTransport() {
  const host = (process.env.SMTP_HOST || '').trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  const secure =
    process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1' || port === 465;

  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user ? { user, pass } : undefined
  });
}

/**
 * Send feedback notification to ADMIN_EMAIL from env.
 * Returns { sent: false } with error when mail is not configured or delivery fails.
 * Callers must still persist feedback independently of this result.
 */
export async function sendFeedbackEmail(payload: FeedbackEmailPayload): Promise<EmailResult> {
  const adminEmail = getAdminEmail();
  if (!adminEmail) {
    return {
      sent: false,
      error: 'ADMIN_EMAIL is not configured. Feedback was saved in the CMS.'
    };
  }

  const transport = createTransport();
  if (!transport) {
    return {
      sent: false,
      error: 'SMTP is not configured (SMTP_HOST). Feedback was saved in the CMS.'
    };
  }

  const from =
    (process.env.FEEDBACK_FROM_EMAIL || '').trim() ||
    (process.env.SMTP_USER || '').trim() ||
    adminEmail;

  const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  const cmsLink = `${appUrl}/admin/feedback/${payload.id}`;

  const attachmentLines = payload.attachments.length
    ? payload.attachments
        .map(
          (a, i) =>
            `${i + 1}. ${a.filename} (${a.mimeType}) — ${appUrl}/uploads/${a.storageKey.replace(/^feedback\//, 'feedback/')}`
        )
        .join('\n')
    : 'None';

  const text = `New feedback submitted on Monlam Font Playground

ID: ${payload.id}
Submitted: ${payload.createdAt}
Contact: ${payload.contactEmail || '(not provided)'}

Message:
${payload.message}

Attachments:
${attachmentLines}

Review in CMS:
${cmsLink}
`;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:640px;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 12px">New feedback — Monlam Font Playground</h2>
      <p style="margin:0 0 8px"><strong>ID:</strong> ${escapeHtml(payload.id)}</p>
      <p style="margin:0 0 8px"><strong>Submitted:</strong> ${escapeHtml(payload.createdAt)}</p>
      <p style="margin:0 0 16px"><strong>Contact:</strong> ${escapeHtml(payload.contactEmail || '(not provided)')}</p>
      <div style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;white-space:pre-wrap">${escapeHtml(payload.message)}</div>
      <h3 style="margin:20px 0 8px;font-size:15px">Attachments</h3>
      ${
        payload.attachments.length
          ? `<ul>${payload.attachments
              .map((a) => {
                const url = `${appUrl}/uploads/${a.storageKey}`;
                return `<li><a href="${escapeHtml(url)}">${escapeHtml(a.filename)}</a> <span style="color:#64748b">(${escapeHtml(a.mimeType)})</span></li>`;
              })
              .join('')}</ul>`
          : '<p style="color:#64748b">None</p>'
      }
      <p style="margin-top:20px"><a href="${escapeHtml(cmsLink)}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none">Open in CMS</a></p>
    </div>
  `;

  const mailAttachments = payload.attachments
    .map((a) => {
      const abs = path.join(getLocalUploadDir(), a.storageKey);
      if (!fs.existsSync(abs)) return null;
      return {
        filename: a.filename,
        path: abs,
        contentType: a.mimeType
      };
    })
    .filter(Boolean) as { filename: string; path: string; contentType: string }[];

  try {
    await transport.sendMail({
      from,
      to: adminEmail,
      subject: `[Monlam Feedback] ${payload.message.slice(0, 60).replace(/\s+/g, ' ')}${payload.message.length > 60 ? '…' : ''}`,
      text,
      html,
      attachments: mailAttachments
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Email delivery failed';
    console.error('Feedback email failed:', message);
    return { sent: false, error: `${message}. Feedback was saved in the CMS.` };
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
