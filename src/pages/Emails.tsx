import { useState, useEffect } from 'react';
import {
  Mail, MailOpen, Search, Star, Archive, Trash2, Reply, ReplyAll, Forward,
  MoreVertical, Paperclip, Flag, Clock, User, Tag, Folder, Inbox,
  Send, FileText, AlertCircle, CheckCircle, X, ChevronLeft, ChevronRight,
  Menu, Plus, RefreshCw, Download, Printer, Edit3
} from 'lucide-react';
import { emailService } from '../services/emailService';
import { Email, EmailAccount } from '../types/email';
import { EmailComposer } from '../components/EmailComposer';
import { mockQuotes } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';

export function Emails() {
  const { showToast } = useToast();
  const [emails, setEmails] = useState<Email[]>([]);
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showEmailList, setShowEmailList] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [starredEmails, setStarredEmails] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadEmailAccounts();
  }, []);

  useEffect(() => {
    loadEmails();
  }, [selectedFolder, selectedCategory, selectedAccount]);

  const loadEmailAccounts = async () => {
    try {
      const accounts = await emailService.getEmailAccounts();
      setEmailAccounts(accounts);
    } catch (error) {
      console.error('Error loading email accounts:', error);
      showToast('Failed to load email accounts', 'error');
    }
  };

  const loadEmails = async () => {
    try {
      setIsLoading(true);
      let filters: any = {};

      if (selectedFolder === 'unread') {
        filters.isRead = false;
      } else if (selectedFolder === 'sent') {
        filters.direction = 'outbound';
      }

      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }

      if (selectedAccount !== 'all') {
        filters.account_id = selectedAccount;
      }

      if (searchQuery) {
        filters.searchQuery = searchQuery;
      }

      const data = await emailService.getEmails(filters);
      setEmails(data);
    } catch (error) {
      console.error('Error loading emails:', error);
      showToast('Failed to load emails', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEmail = async (email: Email) => {
    setSelectedEmail(email);
    setShowEmailList(false);

    if (!email.is_read) {
      try {
        await emailService.markAsRead(email.id);
        setEmails(emails.map(e => e.id === email.id ? { ...e, is_read: true } : e));
      } catch (error) {
        console.error('Error marking email as read:', error);
      }
    }
  };

  const handleDeleteEmail = async (emailId: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (!confirm('Move this email to trash?')) return;

    try {
      await emailService.deleteEmail(emailId);
      setEmails(emails.filter(e => e.id !== emailId));
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
        setShowEmailList(true);
      }
      showToast('Email moved to trash', 'success');
    } catch (error) {
      console.error('Error deleting email:', error);
      showToast('Failed to delete email', 'error');
    }
  };

  const toggleStar = (emailId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newStarred = new Set(starredEmails);
    if (newStarred.has(emailId)) {
      newStarred.delete(emailId);
    } else {
      newStarred.add(emailId);
    }
    setStarredEmails(newStarred);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'new_inquiry': return AlertCircle;
      case 'quote_sent': return Send;
      case 'follow_up': return Clock;
      case 'closed': return CheckCircle;
      default: return Mail;
    }
  };

  const getQuoteInfo = (quoteId: string | null) => {
    if (!quoteId) return null;
    return mockQuotes.find(q => q.id === quoteId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getAccountEmail = (accountId: string): string => {
    const account = emailAccounts.find(acc => acc.id === accountId);
    return account?.email || accountId;
  };

  const unreadCount = emails.filter(e => !e.is_read).length;
  const folders = [
    { id: 'inbox', label: 'Mails', icon: Inbox, count: emails.length },
    { id: 'unread', label: 'Unread', icon: Mail, count: unreadCount },
    { id: 'sent', label: 'Sent', icon: Send, count: emails.filter(e => e.direction === 'outbound').length },
    { id: 'starred', label: 'Starred', icon: Star, count: starredEmails.size },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {selectedEmail && !showEmailList ? (
            <button
              onClick={() => setShowEmailList(true)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          ) : null}

          <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
            {folders.find(f => f.id === selectedFolder)?.label || 'Inbox'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadEmails}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* <button
            onClick={() => setIsComposerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Email</span>
          </button> */}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`
          w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-y-auto
          ${isMobileSidebarOpen ? 'absolute inset-y-0 left-0 z-20 shadow-xl' : 'hidden'} lg:block
        `}>
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Folders
              </h3>
              <div className="space-y-1">
                {folders.map(folder => {
                  const Icon = folder.icon;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setSelectedFolder(folder.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                        ${selectedFolder === folder.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{folder.label}</span>
                      </div>
                      {folder.count > 0 && (
                        <span className={`
                          text-xs font-semibold px-2 py-0.5 rounded-full
                          ${selectedFolder === folder.id
                            ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }
                        `}>
                          {folder.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Accounts
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedAccount('all');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${selectedAccount === 'all'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">All Accounts</span>
                </button>
                {emailAccounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => {
                      setSelectedAccount(account.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${selectedAccount === account.id
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <User className="w-4 h-4" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{account.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{account.email}</div>
                    </div>
                  </button>
                ))}
                {/* Add Account Button */}
    <button
      onClick={() => {
        // Open your add account modal or handle adding logic here
        console.log('Add new account');
      }}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 mt-2"
    >
      <User className="w-4 h-4" />
      <span className="text-sm font-medium">Add Account</span>
    </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All', color: 'gray' },
                  { id: 'new_inquiry', label: 'New Inquiry', color: 'blue' },
                  { id: 'quote_sent', label: 'Quote Sent', color: 'green' },
                  { id: 'follow_up', label: 'Follow-Up', color: 'orange' },
                  { id: 'closed', label: 'Closed', color: 'gray' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${selectedCategory === cat.id
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <div className={`w-3 h-3 rounded-full bg-${cat.color}-500`} />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`
          w-full lg:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col
          ${showEmailList ? 'block' : 'hidden lg:flex'}
        `}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadEmails()}
                placeholder="Search emails..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-4">Loading emails...</p>
              </div>
            ) : emails.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No emails found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {emails.map(email => {
                  const CategoryIcon = getCategoryIcon(email.category);
                  const isStarred = starredEmails.has(email.id);

                  return (
                    <div
                      key={email.id}
                      onClick={() => handleSelectEmail(email)}
                      className={`
                        p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors
                        ${selectedEmail?.id === email.id ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-600' : ''}
                        ${!email.is_read ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {email.is_read ? (
                            <MailOpen className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className={`text-sm truncate ${!email.is_read ? 'font-bold' : 'font-semibold'} text-gray-900 dark:text-white`}>
                              {email.direction === 'outbound' ? `To: ${email.recipient_email}` : email.sender_email}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {formatDate(email.sent_at || email.created_at)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                              {getAccountEmail(email.account_id)}
                            </span>
                          </div>

                          <p className={`text-sm mb-2 truncate ${!email.is_read ? 'font-semibold' : ''} text-gray-900 dark:text-white`}>
                            {email.subject}
                          </p>

                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2">
                            {email.body.substring(0, 100)}...
                          </p>

                          <div className="flex items-center gap-2 flex-wrap">
                            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getCategoryColor(email.category)}`}>
                              <CategoryIcon className="w-3 h-3" />
                              <span className="font-medium">{email.category.replace('_', ' ')}</span>
                            </div>

                            {email.has_attachments && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Paperclip className="w-3 h-3" />
                                <span>{email.attachments.length}</span>
                              </div>
                            )}

                            {email.quote_id && (
                              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <FileText className="w-3 h-3" />
                                <span>Quote</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => toggleStar(email.id, e)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          >
                            <Star className={`w-4 h-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                          </button>

                          <button
                            onClick={(e) => handleDeleteEmail(email.id, e)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className={`
          flex-1 bg-white dark:bg-gray-800 flex flex-col
          ${showEmailList ? 'hidden lg:flex' : 'flex'}
        `}>
          {selectedEmail ? (
            <>
              <div className="border-b border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
                    {selectedEmail.subject}
                  </h2>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Reply">
                      <Reply className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Reply All">
                      <ReplyAll className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Forward">
                      <Forward className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Print">
                      <Printer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmail(selectedEmail.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {(selectedEmail.direction === 'inbound' ? selectedEmail.sender_email : selectedEmail.recipient_email).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {selectedEmail.direction === 'inbound' ? selectedEmail.sender_email : selectedEmail.recipient_email}
                        </span>
                        <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getCategoryColor(selectedEmail.category)}`}>
                          {selectedEmail.category.replace('_', ' ')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedEmail.direction === 'inbound' ? `To: ` : `From: `}
                        </p>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                          {getAccountEmail(selectedEmail.account_id)}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(selectedEmail.sent_at || selectedEmail.created_at).toLocaleString()}
                    </span>
                  </div>

                  {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Cc: </span>
                      <span className="text-gray-900 dark:text-white">{selectedEmail.cc.join(', ')}</span>
                    </div>
                  )}

                  {selectedEmail.quote_id && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              Quote {getQuoteInfo(selectedEmail.quote_id)?.quoteNumber}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {getQuoteInfo(selectedEmail.quote_id)?.companyNames.join(', ')} •
                              ${getQuoteInfo(selectedEmail.quote_id)?.totalValue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                          View Quote
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedEmail.has_attachments && selectedEmail.attachments.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {selectedEmail.attachments.length} Attachment{selectedEmail.attachments.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedEmail.attachments.map((attachment, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
                          >
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(attachment.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                            <Download className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-base text-gray-900 dark:text-white leading-relaxed">
                    {selectedEmail.body}
                  </pre>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsComposerOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors">
                    <ReplyAll className="w-4 h-4" />
                    Reply All
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors">
                    <Forward className="w-4 h-4" />
                    Forward
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Mail className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No email selected
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select an email from the list to view its contents
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <EmailComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        toEmail={selectedEmail ? (selectedEmail.direction === 'inbound' ? selectedEmail.sender_email : selectedEmail.recipient_email) : ''}
        quoteId={selectedEmail?.quote_id || ''}
        onSent={loadEmails}
      />
    </div>
  );
}
