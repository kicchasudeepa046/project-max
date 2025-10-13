import { useState, useEffect } from 'react';
import { X, Send, Paperclip, FileText, User } from 'lucide-react';
import { emailService } from '../services/emailService';
import { EmailTemplate } from '../types/email';
import { mockQuotes } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  toEmail?: string;
  quoteId?: string;
  onSent?: () => void;
}

export function EmailComposer({ isOpen, onClose, toEmail = '', quoteId = '', onSent }: EmailComposerProps) {
  const { showToast } = useToast();
  const [to, setTo] = useState(toEmail);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(quoteId);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      setTo(toEmail);
      setSelectedQuote(quoteId);
    }
  }, [isOpen, toEmail, quoteId]);

  const loadTemplates = async () => {
    try {
      const data = await emailService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    if (!templateId) return;

    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    let processedSubject = template.subject;
    let processedBody = template.body;

    if (selectedQuote) {
      const quote = mockQuotes.find(q => q.id === selectedQuote);
      if (quote) {
        const data = {
          client_name: quote.companyNames[0],
          quote_number: quote.quoteNumber,
          project_name: quote.projectName,
          total_value: quote.totalValue.toLocaleString(),
          total_flowmeters: quote.totalFlowmeters,
          quote_date: new Date(quote.dateOfLastResponse).toLocaleDateString(),
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          delivery_timeline: '4-6 weeks'
        };

        processedSubject = emailService.replacePlaceholders(processedSubject, data);
        processedBody = emailService.replacePlaceholders(processedBody, data);
      }
    }

    setSubject(processedSubject);
    setBody(processedBody);
    setSelectedTemplate(templateId);
  };

  const handleSend = async () => {
    if (!to || !subject || !body) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSending(true);

    try {
      const ccArray = cc ? cc.split(',').map(e => e.trim()) : [];
      const bccArray = bcc ? bcc.split(',').map(e => e.trim()) : [];

      let contactId = null;
      const existingContact = await emailService.getContactByEmail(to);
      if (existingContact) {
        contactId = existingContact.id;
      }

      await emailService.createEmail({
        contact_id: contactId,
        quote_id: selectedQuote || null,
        subject,
        body,
        sender_email: 'sales@company.com',
        recipient_email: to,
        cc: ccArray.length > 0 ? ccArray : null,
        bcc: bccArray.length > 0 ? bccArray : null,
        status: 'sent',
        category: selectedQuote ? 'quote_sent' : 'new_inquiry',
        direction: 'outbound',
        is_read: true,
        has_attachments: false,
        attachments: [],
        sent_at: new Date().toISOString()
      });

      if (selectedQuote) {
        const existingSchedule = await emailService.getFollowUpScheduleByQuote(selectedQuote);
        if (!existingSchedule) {
          const nextFollowUp = new Date();
          nextFollowUp.setDate(nextFollowUp.getDate() + 10);

          await emailService.createFollowUpSchedule({
            quote_id: selectedQuote,
            last_follow_up: new Date().toISOString(),
            next_follow_up: nextFollowUp.toISOString(),
            follow_up_count: 0,
            frequency_days: 10,
            is_active: true
          });
        }
      }

      showToast('Email sent successfully!', 'success');
      handleClose();
      onSent?.();
    } catch (error) {
      console.error('Error sending email:', error);
      showToast('Failed to send email', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setTo('');
    setCc('');
    setBcc('');
    setSubject('');
    setBody('');
    setSelectedQuote('');
    setSelectedTemplate('');
    setShowCc(false);
    setShowBcc(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compose Email</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Attach Quote
              </label>
              <select
                value={selectedQuote}
                onChange={(e) => setSelectedQuote(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">No quote attached</option>
                {mockQuotes.map(quote => (
                  <option key={quote.id} value={quote.id}>
                    {quote.quoteNumber} - {quote.companyNames[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <div className="flex gap-2 mt-2">
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Cc
                </button>
              )}
              {!showBcc && (
                <button
                  type="button"
                  onClick={() => setShowBcc(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Bcc
                </button>
              )}
            </div>
          </div>

          {showCc && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cc
              </label>
              <input
                type="text"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="cc@example.com, another@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          )}

          {showBcc && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bcc
              </label>
              <input
                type="text"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="bcc@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here..."
              rows={12}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {selectedQuote && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Quote {mockQuotes.find(q => q.id === selectedQuote)?.quoteNumber} will be attached
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Paperclip className="w-5 h-5" />
            Attach File
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
              {isSending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
