export interface Contact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  phone: string | null;
  position: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
}

export interface Email {
  id: string;
  account_id: string;
  contact_id: string | null;
  quote_id: string | null;
  subject: string;
  body: string;
  sender_email: string;
  recipient_email: string;
  cc: string[] | null;
  bcc: string[] | null;
  status: 'draft' | 'sent' | 'failed';
  category: 'new_inquiry' | 'quote_sent' | 'follow_up' | 'closed';
  direction: 'inbound' | 'outbound';
  is_read: boolean;
  has_attachments: boolean;
  attachments: EmailAttachment[];
  sent_at: string | null;
  created_at: string;
}

export interface EmailAttachment {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'follow_up' | 'quote' | 'inquiry';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FollowUpSchedule {
  id: string;
  quote_id: string;
  last_follow_up: string | null;
  next_follow_up: string | null;
  follow_up_count: number;
  frequency_days: number;
  is_active: boolean;
  created_at: string;
}

export interface EmailFilters {
  account_id?: string;
  category?: string;
  status?: string;
  direction?: string;
  isRead?: boolean;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
}
