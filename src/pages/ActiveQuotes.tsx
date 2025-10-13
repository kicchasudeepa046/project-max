import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Send, MessageSquare, ChevronLeft, ChevronRight, Eye, ArrowDown, Trash2 } from 'lucide-react';
import { mockQuotes, Quote } from '../data/mockData';
import { ViewMoreModal } from '../components/ViewMoreModal';
import { CustomMessageModal } from '../components/CustomMessageModal';
import { QuoteEmailsModal } from '../components/QuoteEmailsModal';
import { useToast } from '../contexts/ToastContext';
import { emailService } from '../services/emailService';
import { Email } from '../types/email';

const ITEMS_PER_PAGE = 10;

export function ActiveQuotes() {
  const { showToast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuoteForModal, setSelectedQuoteForModal] = useState<Quote | null>(null);
  const [showCustomMessageModal, setShowCustomMessageModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedQuoteForEmails, setSelectedQuoteForEmails] = useState<Quote | null>(null);
  const [quoteEmails, setQuoteEmails] = useState<Email[]>([]);

  const activeQuotes = quotes.filter(q => !q.isCold);

  const filteredQuotes = useMemo(() => {
    return activeQuotes.filter(quote => {
      const matchesSearch =
        quote.companyNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        quote.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || quote.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus, activeQuotes]);

  const totalPages = Math.ceil(filteredQuotes.length / ITEMS_PER_PAGE);
  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedQuotes);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedQuotes(newSelected);
  };

  const handleToggleSelectAll = () => {
    if (selectedQuotes.size === paginatedQuotes.length) {
      setSelectedQuotes(new Set());
    } else {
      setSelectedQuotes(new Set(paginatedQuotes.map(q => q.id)));
    }
  };

  const handleSendFollowUp = () => {
    if (selectedQuotes.size === 0) {
      showToast('Please select at least one quote', 'warning');
      return;
    }
    showToast(`Standard follow-up sent for ${selectedQuotes.size} quotes`, 'success');
    setSelectedQuotes(new Set());
  };

  const handleSendCustomMessage = (message: string) => {
    showToast(`Custom message sent to ${selectedQuotes.size} quotes`, 'success');
    setSelectedQuotes(new Set());
  };

  const handleMoveToCold = () => {
    if (selectedQuotes.size === 0) {
      showToast('Please select at least one quote', 'warning');
      return;
    }
    const updatedQuotes = quotes.map(q =>
      selectedQuotes.has(q.id) ? { ...q, isCold: true } : q
    );
    setQuotes(updatedQuotes);
    setSelectedQuotes(new Set());
    showToast(`${selectedQuotes.size} quotes moved to Cold Quotes`, 'success');
  };

  const handleUpdateQuote = (quoteId: string, updates: Partial<Quote>) => {
    const updatedQuotes = quotes.map(q =>
      q.id === quoteId ? { ...q, ...updates } : q
    );
    setQuotes(updatedQuotes);
  };

  const handleStatusChange = (quoteId: string, newStatus: Quote['status']) => {
    handleUpdateQuote(quoteId, { status: newStatus });
  };

  const handleShowEmails = async (quote: Quote, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedQuoteForEmails(quote);
    try {
      const emails = await emailService.getEmailsByQuote(quote.id);
      setQuoteEmails(emails);
      setShowEmailModal(true);
    } catch (error) {
      console.error('Error loading emails:', error);
      showToast('Failed to load emails', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Quotes</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and follow up on active project quotes
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, project, or quote number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Order expected">Order expected</option>
                <option value="Long-shot opportunity">Long-shot opportunity</option>
                <option value="Project/Longterm">Project/Longterm</option>
                <option value="Non-responsive">Non-responsive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {selectedQuotes.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedQuotes.size} {selectedQuotes.size === 1 ? 'quote' : 'quotes'} selected
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleSendFollowUp}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                <Send className="w-4 h-4" />
                Send Follow-up Now
              </button>
              <button
                onClick={() => setShowCustomMessageModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Send Custom Message
              </button>
              <button
                onClick={handleMoveToCold}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                <ArrowDown className="w-4 h-4" />
                Move to Cold Quotes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedQuotes.size === paginatedQuotes.length && paginatedQuotes.length > 0}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Quote #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Company Name(s)
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Flowmeters
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Last Response
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Summary
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Follow-up Freq.
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedQuotes.has(quote.id)}
                      onChange={() => handleToggleSelect(quote.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => handleShowEmails(quote, e)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                    >
                      {quote.quoteNumber}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {quote.companyNames.join(', ')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {quote.projectName || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {quote.totalFlowmeters}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${quote.totalValue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={quote.status}
                      onChange={(e) => handleStatusChange(quote.id, e.target.value as Quote['status'])}
                      className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Order expected">Order expected</option>
                      <option value="Long-shot opportunity">Long-shot opportunity</option>
                      <option value="Project/Longterm">Project/Longterm</option>
                      <option value="Non-responsive">Non-responsive</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(quote.dateOfLastResponse).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedQuoteForModal(quote)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View More
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-700 dark:text-gray-300">
                      {quote.automatedFollowupFrequency}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No quotes found matching your criteria</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredQuotes.length)} of{' '}
            {filteredQuotes.length} results
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      )}

      {selectedQuoteForModal && (
        <ViewMoreModal
          quote={selectedQuoteForModal}
          isOpen={!!selectedQuoteForModal}
          onClose={() => setSelectedQuoteForModal(null)}
          onUpdate={handleUpdateQuote}
        />
      )}

      <CustomMessageModal
        isOpen={showCustomMessageModal}
        onClose={() => setShowCustomMessageModal(false)}
        selectedQuoteIds={Array.from(selectedQuotes)}
        onSend={handleSendCustomMessage}
      />

      <QuoteEmailsModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setSelectedQuoteForEmails(null);
          setQuoteEmails([]);
        }}
        quoteNumber={selectedQuoteForEmails?.quoteNumber || ''}
        emails={quoteEmails}
      />
    </div>
  );
}
