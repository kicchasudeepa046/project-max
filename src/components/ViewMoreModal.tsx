import { X } from 'lucide-react';
import { Quote } from '../data/mockData';

interface ViewMoreModalProps {
  quote: Quote;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (quoteId: string, updates: Partial<Quote>) => void;
}

export function ViewMoreModal({ quote, isOpen, onClose, onUpdate }: ViewMoreModalProps) {
  if (!isOpen) return null;

  const handleFrequencyChange = (frequency: Quote['automatedFollowupFrequency']) => {
    onUpdate(quote.id, { automatedFollowupFrequency: frequency });
  };

  const handleNotesChange = (notes: string) => {
    onUpdate(quote.id, { managerNotes: notes });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Quote Details - {quote.quoteNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Summary of Last Response
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {quote.summaryOfLastResponse}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Date of Last Response
            </h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {new Date(quote.dateOfLastResponse).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Automated Follow-up Frequency
            </label>
            <select
              value={quote.automatedFollowupFrequency}
              onChange={(e) => handleFrequencyChange(e.target.value as Quote['automatedFollowupFrequency'])}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="Every 10 days">Every 10 days</option>
              <option value="Every 30 days">Every 30 days</option>
              <option value="Every 60 days">Every 60 days</option>
              <option value="Every 90 days">Every 90 days</option>
              <option value="Manual only">Manual only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Manager's Notes
            </label>
            <textarea
              value={quote.managerNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Add notes about this quote..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
