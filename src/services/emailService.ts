// import { supabase } from '../lib/supabase';
// import { Email, Contact, EmailTemplate, FollowUpSchedule, EmailFilters } from '../types/email';

// export const emailService = {
//   async getEmails(filters?: EmailFilters): Promise<Email[]> {
//     let query = supabase
//       .from('emails')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (filters?.category) {
//       query = query.eq('category', filters.category);
//     }

//     if (filters?.status) {
//       query = query.eq('status', filters.status);
//     }

//     if (filters?.direction) {
//       query = query.eq('direction', filters.direction);
//     }

//     if (filters?.isRead !== undefined) {
//       query = query.eq('is_read', filters.isRead);
//     }

//     if (filters?.searchQuery) {
//       query = query.or(`subject.ilike.%${filters.searchQuery}%,body.ilike.%${filters.searchQuery}%,sender_email.ilike.%${filters.searchQuery}%,recipient_email.ilike.%${filters.searchQuery}%`);
//     }

//     const { data, error } = await query;

//     if (error) throw error;
//     return data as Email[];
//   },

//   async getEmailById(id: string): Promise<Email | null> {
//     const { data, error } = await supabase
//       .from('emails')
//       .select('*')
//       .eq('id', id)
//       .maybeSingle();

//     if (error) throw error;
//     return data as Email | null;
//   },

//   async createEmail(email: Omit<Email, 'id' | 'created_at'>): Promise<Email> {
//     const { data, error } = await supabase
//       .from('emails')
//       .insert(email)
//       .select()
//       .single();

//     if (error) throw error;
//     return data as Email;
//   },

//   async updateEmail(id: string, updates: Partial<Email>): Promise<Email> {
//     const { data, error } = await supabase
//       .from('emails')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data as Email;
//   },

//   async markAsRead(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('emails')
//       .update({ is_read: true })
//       .eq('id', id);

//     if (error) throw error;
//   },

//   async deleteEmail(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('emails')
//       .delete()
//       .eq('id', id);

//     if (error) throw error;
//   },

//   async getContacts(): Promise<Contact[]> {
//     const { data, error } = await supabase
//       .from('contacts')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (error) throw error;
//     return data as Contact[];
//   },

//   async getContactById(id: string): Promise<Contact | null> {
//     const { data, error } = await supabase
//       .from('contacts')
//       .select('*')
//       .eq('id', id)
//       .maybeSingle();

//     if (error) throw error;
//     return data as Contact | null;
//   },

//   async getContactByEmail(email: string): Promise<Contact | null> {
//     const { data, error } = await supabase
//       .from('contacts')
//       .select('*')
//       .eq('email', email)
//       .maybeSingle();

//     if (error) throw error;
//     return data as Contact | null;
//   },

//   async createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
//     const { data, error } = await supabase
//       .from('contacts')
//       .insert(contact)
//       .select()
//       .single();

//     if (error) throw error;
//     return data as Contact;
//   },

//   async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
//     const { data, error } = await supabase
//       .from('contacts')
//       .update({ ...updates, updated_at: new Date().toISOString() })
//       .eq('id', id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data as Contact;
//   },

//   async getEmailsByContact(contactId: string): Promise<Email[]> {
//     const { data, error } = await supabase
//       .from('emails')
//       .select('*')
//       .eq('contact_id', contactId)
//       .order('created_at', { ascending: false });

//     if (error) throw error;
//     return data as Email[];
//   },

//   async getEmailsByQuote(quoteId: string): Promise<Email[]> {
//     const { data, error } = await supabase
//       .from('emails')
//       .select('*')
//       .eq('quote_id', quoteId)
//       .order('created_at', { ascending: false });

//     if (error) throw error;
//     return data as Email[];
//   },

//   async getTemplates(): Promise<EmailTemplate[]> {
//     const { data, error } = await supabase
//       .from('email_templates')
//       .select('*')
//       .eq('is_active', true)
//       .order('name');

//     if (error) throw error;
//     return data as EmailTemplate[];
//   },

//   async getTemplateById(id: string): Promise<EmailTemplate | null> {
//     const { data, error } = await supabase
//       .from('email_templates')
//       .select('*')
//       .eq('id', id)
//       .maybeSingle();

//     if (error) throw error;
//     return data as EmailTemplate | null;
//   },

//   async createFollowUpSchedule(schedule: Omit<FollowUpSchedule, 'id' | 'created_at'>): Promise<FollowUpSchedule> {
//     const { data, error } = await supabase
//       .from('follow_up_schedule')
//       .insert(schedule)
//       .select()
//       .single();

//     if (error) throw error;
//     return data as FollowUpSchedule;
//   },

//   async updateFollowUpSchedule(id: string, updates: Partial<FollowUpSchedule>): Promise<FollowUpSchedule> {
//     const { data, error } = await supabase
//       .from('follow_up_schedule')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data as FollowUpSchedule;
//   },

//   async getFollowUpScheduleByQuote(quoteId: string): Promise<FollowUpSchedule | null> {
//     const { data, error } = await supabase
//       .from('follow_up_schedule')
//       .select('*')
//       .eq('quote_id', quoteId)
//       .maybeSingle();

//     if (error) throw error;
//     return data as FollowUpSchedule | null;
//   },

//   async getPendingFollowUps(): Promise<FollowUpSchedule[]> {
//     const now = new Date().toISOString();
//     const { data, error } = await supabase
//       .from('follow_up_schedule')
//       .select('*')
//       .eq('is_active', true)
//       .lte('next_follow_up', now);

//     if (error) throw error;
//     return data as FollowUpSchedule[];
//   },

//   replacePlaceholders(template: string, data: Record<string, string | number>): string {
//     let result = template;
//     Object.keys(data).forEach(key => {
//       const regex = new RegExp(`{{${key}}}`, 'g');
//       result = result.replace(regex, String(data[key]));
//     });
//     return result;
//   }
// };


import { Email, Contact, EmailTemplate, FollowUpSchedule, EmailFilters, EmailAttachment } from '../types/email';

// Mock Data
let emails: Email[] = [
  {
    id: '1',
    contact_id: '1',
    quote_id: '101',
    subject: 'Quote for Project X',
    body: 'Hello, please find the quote attached.',
    sender_email: 'sales@example.com',
    recipient_email: 'client@example.com',
    cc: [],
    bcc: [],
    status: 'sent',
    category: 'quote_sent',
    direction: 'outbound',
    is_read: false,
    has_attachments: true,
    attachments: [{ name: 'quote.pdf', size: 1024, type: 'application/pdf', url: '/mock/quote.pdf' }],
    sent_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    contact_id: '2',
    quote_id: null,
    subject: 'New Inquiry',
    body: 'I want more info about your services.',
    sender_email: 'client2@example.com',
    recipient_email: 'info@example.com',
    cc: [],
    bcc: [],
    status: 'draft',
    category: 'new_inquiry',
    direction: 'inbound',
    is_read: true,
    has_attachments: false,
    attachments: [],
    sent_at: null,
    created_at: new Date().toISOString(),
  },
];

let contacts: Contact[] = [
  { id: '1', email: 'client@example.com', first_name: 'John', last_name: 'Doe', company_name: 'ABC Corp', phone: '1234567890', position: 'Manager', notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', email: 'client2@example.com', first_name: 'Jane', last_name: 'Smith', company_name: 'XYZ Inc', phone: '9876543210', position: 'CEO', notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

let templates: EmailTemplate[] = [
  { id: '1', name: 'Follow Up', subject: 'Follow up on your request', body: 'Hi {{first_name}}, checking in...', category: 'follow_up', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

let followUps: FollowUpSchedule[] = [
  { id: '1', quote_id: '101', last_follow_up: null, next_follow_up: new Date().toISOString(), follow_up_count: 0, frequency_days: 3, is_active: true, created_at: new Date().toISOString() },
];

// Service with Mock Data
export const emailService = {
  async getEmails(filters?: EmailFilters): Promise<Email[]> {
    let result = [...emails];

    if (filters?.category) result = result.filter(e => e.category === filters.category);
    if (filters?.status) result = result.filter(e => e.status === filters.status);
    if (filters?.direction) result = result.filter(e => e.direction === filters.direction);
    if (filters?.isRead !== undefined) result = result.filter(e => e.is_read === filters.isRead);
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(e => 
        e.subject.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.sender_email.toLowerCase().includes(q) ||
        e.recipient_email.toLowerCase().includes(q)
      );
    }

    // Optional: filter by date range
    if (filters?.dateFrom) result = result.filter(e => e.created_at >= filters.dateFrom);
    if (filters?.dateTo) result = result.filter(e => e.created_at <= filters.dateTo);

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getEmailById(id: string): Promise<Email | null> {
    return emails.find(e => e.id === id) || null;
  },

  async createEmail(email: Omit<Email, 'id' | 'created_at'>): Promise<Email> {
    const newEmail: Email = { ...email, id: String(emails.length + 1), created_at: new Date().toISOString() };
    emails.push(newEmail);
    return newEmail;
  },

  async updateEmail(id: string, updates: Partial<Email>): Promise<Email> {
    const index = emails.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Email not found');
    emails[index] = { ...emails[index], ...updates };
    return emails[index];
  },

  async markAsRead(id: string): Promise<void> {
    const email = emails.find(e => e.id === id);
    if (email) email.is_read = true;
  },

  async deleteEmail(id: string): Promise<void> {
    emails = emails.filter(e => e.id !== id);
  },

  async getContacts(): Promise<Contact[]> {
    return contacts;
  },

  async getContactById(id: string): Promise<Contact | null> {
    return contacts.find(c => c.id === id) || null;
  },

  async getContactByEmail(email: string): Promise<Contact | null> {
    return contacts.find(c => c.email === email) || null;
  },

  async createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
    const newContact: Contact = { ...contact, id: String(contacts.length + 1), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    contacts.push(newContact);
    return newContact;
  },

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    contacts[index] = { ...contacts[index], ...updates, updated_at: new Date().toISOString() };
    return contacts[index];
  },

  async getEmailsByContact(contactId: string): Promise<Email[]> {
    return emails.filter(e => e.contact_id === contactId);
  },

  async getEmailsByQuote(quoteId: string): Promise<Email[]> {
    return emails.filter(e => e.quote_id === quoteId);
  },

  async getTemplates(): Promise<EmailTemplate[]> {
    return templates.filter(t => t.is_active).sort((a, b) => a.name.localeCompare(b.name));
  },

  async getTemplateById(id: string): Promise<EmailTemplate | null> {
    return templates.find(t => t.id === id) || null;
  },

  async createFollowUpSchedule(schedule: Omit<FollowUpSchedule, 'id' | 'created_at'>): Promise<FollowUpSchedule> {
    const newSchedule: FollowUpSchedule = { ...schedule, id: String(followUps.length + 1), created_at: new Date().toISOString() };
    followUps.push(newSchedule);
    return newSchedule;
  },

  async updateFollowUpSchedule(id: string, updates: Partial<FollowUpSchedule>): Promise<FollowUpSchedule> {
    const index = followUps.findIndex(f => f.id === id);
    if (index === -1) throw new Error('FollowUp not found');
    followUps[index] = { ...followUps[index], ...updates };
    return followUps[index];
  },

  async getFollowUpScheduleByQuote(quoteId: string): Promise<FollowUpSchedule | null> {
    return followUps.find(f => f.quote_id === quoteId) || null;
  },

  async getPendingFollowUps(): Promise<FollowUpSchedule[]> {
    const now = new Date().toISOString();
    return followUps.filter(f => f.is_active && f.next_follow_up && f.next_follow_up <= now);
  },

  replacePlaceholders(template: string, data: Record<string, string | number>): string {
    let result = template;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(data[key]));
    });
    return result;
  }
};
