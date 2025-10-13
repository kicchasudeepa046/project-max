import { Send, CheckSquare, Square } from 'lucide-react';
import { Quote } from '../data/mockData';

interface QuoteItemProps {
  quote: Quote;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSendFollowUp: (id: string) => void;
}

export function QuoteItem({ quote, isSelected, onToggleSelect, onSendFollowUp }: QuoteItemProps) {
  const statusColors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'in-progress': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    cold: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggleSelect(quote.id)}
          className="flex-shrink-0"
        >
          {isSelected ? (
            <CheckSquare className="w-5 h-5 text-blue-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
        </button>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{quote.id}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{quote.clientName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{quote.projectName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{quote.projectType}</p>
          </div>

          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(quote.lastFollowUp).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[quote.status]}`}>
              {quote.status}
            </span>

            <button
              onClick={() => onSendFollowUp(quote.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Follow-up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
