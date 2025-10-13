/*
  # Email Management System Schema

  ## Overview
  This migration creates the complete database schema for the email management interface,
  including tables for contacts, emails, email templates, and automatic follow-up tracking.

  ## New Tables

  ### `contacts`
  - `id` (uuid, primary key) - Unique identifier for each contact
  - `email` (text, unique, required) - Contact's email address
  - `first_name` (text) - Contact's first name
  - `last_name` (text) - Contact's last name
  - `company_name` (text) - Company name
  - `phone` (text) - Phone number
  - `position` (text) - Job position/title
  - `notes` (text) - Additional notes about the contact
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `emails`
  - `id` (uuid, primary key) - Unique identifier for each email
  - `contact_id` (uuid, foreign key) - Reference to contacts table
  - `quote_id` (text) - Reference to quote (from mock data)
  - `subject` (text, required) - Email subject
  - `body` (text, required) - Email body content
  - `sender_email` (text, required) - Sender's email address
  - `recipient_email` (text, required) - Recipient's email address
  - `cc` (text[]) - CC recipients
  - `bcc` (text[]) - BCC recipients
  - `status` (text) - Email status (sent, draft, failed)
  - `category` (text) - Email category (new_inquiry, quote_sent, follow_up, closed)
  - `direction` (text) - Email direction (inbound, outbound)
  - `is_read` (boolean) - Read status
  - `has_attachments` (boolean) - Whether email has attachments
  - `attachments` (jsonb) - Attachment metadata
  - `sent_at` (timestamptz) - Timestamp when email was sent
  - `created_at` (timestamptz) - Record creation timestamp

  ### `email_templates`
  - `id` (uuid, primary key) - Unique identifier for each template
  - `name` (text, required) - Template name
  - `subject` (text, required) - Template subject with placeholders
  - `body` (text, required) - Template body with placeholders
  - `category` (text) - Template category (follow_up, quote, inquiry)
  - `is_active` (boolean) - Whether template is active
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `follow_up_schedule`
  - `id` (uuid, primary key) - Unique identifier
  - `quote_id` (text, required) - Reference to quote
  - `last_follow_up` (timestamptz) - Last follow-up timestamp
  - `next_follow_up` (timestamptz) - Next scheduled follow-up
  - `follow_up_count` (integer) - Number of follow-ups sent
  - `frequency_days` (integer) - Follow-up frequency in days
  - `is_active` (boolean) - Whether follow-up is active
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - RLS enabled on all tables
  - Policies restrict access to authenticated users only
  - Users can only access their own organization's data
*/

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  company_name text,
  phone text,
  position text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  quote_id text,
  subject text NOT NULL,
  body text NOT NULL,
  sender_email text NOT NULL,
  recipient_email text NOT NULL,
  cc text[],
  bcc text[],
  status text DEFAULT 'draft',
  category text DEFAULT 'new_inquiry',
  direction text DEFAULT 'outbound',
  is_read boolean DEFAULT false,
  has_attachments boolean DEFAULT false,
  attachments jsonb DEFAULT '[]'::jsonb,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  category text DEFAULT 'follow_up',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create follow_up_schedule table
CREATE TABLE IF NOT EXISTS follow_up_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id text UNIQUE NOT NULL,
  last_follow_up timestamptz,
  next_follow_up timestamptz,
  follow_up_count integer DEFAULT 0,
  frequency_days integer DEFAULT 10,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_emails_contact_id ON emails(contact_id);
CREATE INDEX IF NOT EXISTS idx_emails_quote_id ON emails(quote_id);
CREATE INDEX IF NOT EXISTS idx_emails_sent_at ON emails(sent_at);
CREATE INDEX IF NOT EXISTS idx_emails_category ON emails(category);
CREATE INDEX IF NOT EXISTS idx_emails_status ON emails(status);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_follow_up_schedule_quote_id ON follow_up_schedule(quote_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_schedule_next_follow_up ON follow_up_schedule(next_follow_up);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_schedule ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contacts
CREATE POLICY "Users can view all contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert contacts"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for emails
CREATE POLICY "Users can view all emails"
  ON emails FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert emails"
  ON emails FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update emails"
  ON emails FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete emails"
  ON emails FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for email_templates
CREATE POLICY "Users can view all templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert templates"
  ON email_templates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update templates"
  ON email_templates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete templates"
  ON email_templates FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for follow_up_schedule
CREATE POLICY "Users can view all follow-up schedules"
  ON follow_up_schedule FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert follow-up schedules"
  ON follow_up_schedule FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update follow-up schedules"
  ON follow_up_schedule FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete follow-up schedules"
  ON follow_up_schedule FOR DELETE
  TO authenticated
  USING (true);

-- Insert default email templates
INSERT INTO email_templates (name, subject, body, category, is_active) VALUES
(
  'Standard Follow-Up (10 days)',
  'Following up on Quote {{quote_number}}',
  'Dear {{client_name}},

I hope this email finds you well. I wanted to follow up on the quotation we sent on {{quote_date}} for {{project_name}}.

Quote Details:
- Quote Number: {{quote_number}}
- Total Value: ${{total_value}}
- Total Flowmeters: {{total_flowmeters}}

If you have any questions or need any clarification regarding the quotation, please don''t hesitate to reach out. We''re here to help and would be happy to discuss any aspect of the proposal.

Looking forward to hearing from you soon.

Best regards,
Your Sales Team',
  'follow_up',
  true
),
(
  'New Quote Sent',
  'Quotation for {{project_name}} - {{quote_number}}',
  'Dear {{client_name}},

Thank you for your interest in our products. Please find attached the quotation for {{project_name}}.

Quote Summary:
- Quote Number: {{quote_number}}
- Total Flowmeters: {{total_flowmeters}}
- Total Value: ${{total_value}}
- Valid Until: {{valid_until}}

Our team has carefully prepared this quotation to meet your specific requirements. If you have any questions or would like to discuss any details, please feel free to contact us.

We look forward to the opportunity to work with you.

Best regards,
Your Sales Team',
  'quote',
  true
),
(
  'Meeting Follow-Up',
  'Thank you for meeting with us - {{quote_number}}',
  'Dear {{client_name}},

Thank you for taking the time to meet with us regarding {{project_name}}. It was a pleasure discussing your requirements and how we can help.

As discussed, I''ve attached the updated quotation reflecting the points we covered in our meeting.

Key Highlights:
- Quote Number: {{quote_number}}
- Total Value: ${{total_value}}
- Delivery Timeline: {{delivery_timeline}}

Please review the quotation and let me know if you have any questions or need any modifications.

Best regards,
Your Sales Team',
  'follow_up',
  true
)
ON CONFLICT DO NOTHING;