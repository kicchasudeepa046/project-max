import { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, User, Search, Filter, ChevronLeft, ChevronRight, List, CalendarDays } from 'lucide-react';
import { mockMeetings, mockQuotes } from '../data/mockData';
import { MeetingsCalendar } from '../components/MeetingsCalendar';

const ITEMS_PER_PAGE = 5;

export function Meetings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const getQuoteInfo = (quoteId: string) => {
    return mockQuotes.find(q => q.id === quoteId);
  };

  const isUpcoming = (dateTime: string) => {
    return new Date(dateTime) > new Date('2025-10-08');
  };

  const filteredMeetings = useMemo(() => {
    let filtered = [...mockMeetings].sort((a, b) =>
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );

    filtered = filtered.filter(meeting => {
      const quote = getQuoteInfo(meeting.quoteId);
      const matchesSearch =
        meeting.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.quoteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote?.companyNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        quote?.projectName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClient = selectedClient === 'all' || quote?.companyNames.includes(selectedClient);
      const matchesUpcoming = !showUpcomingOnly || isUpcoming(meeting.dateTime);

      return matchesSearch && matchesClient && matchesUpcoming;
    });

    return filtered;
  }, [searchTerm, selectedClient, showUpcomingOnly]);

  const totalPages = Math.ceil(filteredMeetings.length / ITEMS_PER_PAGE);
  const paginatedMeetings = filteredMeetings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clients = Array.from(new Set(mockQuotes.flatMap(q => q.companyNames)));

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scheduled Meetings</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upcoming client meetings and consultations
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <List className="w-4 h-4" />
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Calendar View
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client, contact, or quote ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
                Client
              </label>
              <select
                value={selectedClient}
                onChange={(e) => {
                  setSelectedClient(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Clients</option>
                {clients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Show
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="upcoming-only"
                  checked={showUpcomingOnly}
                  onChange={(e) => {
                    setShowUpcomingOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 text-green-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500"
                />
                <label htmlFor="upcoming-only" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Upcoming meetings only
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {viewMode === 'calendar' ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <MeetingsCalendar meetings={filteredMeetings} />
        </div>
      ) : (
        <>
      <div className="space-y-4">
        {paginatedMeetings.map(meeting => {
          const quote = getQuoteInfo(meeting.quoteId);
          const { date, time } = formatDateTime(meeting.dateTime);
          const upcoming = isUpcoming(meeting.dateTime);

          return (
            <div
              key={meeting.id}
              className={`
                bg-white dark:bg-gray-800 border-2 rounded-lg p-6
                transition-all duration-200 hover:shadow-lg
                ${upcoming
                  ? 'border-green-200 dark:border-green-800'
                  : 'border-gray-200 dark:border-gray-700 opacity-75'
                }
              `}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${upcoming ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      <Calendar className={`w-6 h-6 ${upcoming ? 'text-green-600 dark:text-green-300' : 'text-gray-600 dark:text-gray-300'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {quote?.projectName || 'Unknown Project'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {quote?.companyNames.join(', ') || 'Unknown Client'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {meeting.contactPerson}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {meeting.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Quote ID</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {meeting.quoteId}
                        </p>
                      </div>
                    </div>

                    {quote && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${quote.totalValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  {upcoming && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold whitespace-nowrap">
                      Upcoming
                    </span>
                  )}
                  {!upcoming && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-semibold whitespace-nowrap">
                      Past
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredMeetings.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No meetings found matching your criteria</p>
          </div>
        )}
      </div>

      {totalPages > 1 && viewMode === 'list' && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredMeetings.length)} of{' '}
            {filteredMeetings.length} results
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
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
      </>
      )}
    </div>
  );
}
