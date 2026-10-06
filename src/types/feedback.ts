export type FeedbackStatus = 'new' | 'reviewed' | 'archived';

export interface FeedbackAttachment {
  id: string;
  feedbackId: string;
  filename: string;
  mimeType: string;
  fileSize: string;
  storageKey: string;
  fileUrl: string;
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  message: string;
  contactEmail: string | null;
  status: FeedbackStatus;
  emailSent: boolean;
  emailError: string | null;
  createdAt: string;
  updatedAt: string;
  attachments: FeedbackAttachment[];
}

export interface FeedbackSubmitResponse {
  ok: boolean;
  feedback: FeedbackItem;
  emailSent: boolean;
  emailWarning: string | null;
}
