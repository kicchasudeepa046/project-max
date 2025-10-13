import { X, Mail, MailOpen, Paperclip, ArrowRight } from 'lucide-react';
import { Email } from '../types/email';

interface QuoteEmailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteNumber: string;
  emails: Email[];
}

export function QuoteEmailsModal({ isOpen, onClose, quoteNumber, emails }: QuoteEmailsModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'new_inquiry': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'quote_sent': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'follow_up': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      case 'closed': return 'text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Email History
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Quote: {quoteNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {emails.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No emails found for this quote
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Email correspondence will appear here once initiated
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {email.is_read ? (
                        <MailOpen className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-base font-semibold text-gray-900 dark:text-white ${!email.is_read ? 'font-bold' : ''}`}>
                              {email.subject}
                            </h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(email.category)}`}>
                              {email.category.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {email.direction === 'inbound' ? (
                              <>
                                <span className="font-medium">{email.sender_email}</span>
                                <ArrowRight className="w-4 h-4" />
                                <span>{email.recipient_email}</span>
                              </>
                            ) : (
                              <>
                                <span className="font-medium">{email.sender_email}</span>
                                <ArrowRight className="w-4 h-4" />
                                <span>{email.recipient_email}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {formatDate(email.sent_at || email.created_at)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                        {email.body}
                      </p>

                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
                          email.direction === 'inbound'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        }`}>
                          {email.direction === 'inbound' ? 'Received' : 'Sent'}
                        </span>

                        {email.has_attachments && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <Paperclip className="w-3 h-3" />
                            {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                          </span>
                        )}

                        {email.cc && email.cc.length > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            CC: {email.cc.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
