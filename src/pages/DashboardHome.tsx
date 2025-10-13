import { FileText, Snowflake, Calendar, CheckCircle, TrendingUp, DollarSign, BarChart3, Plus, RefreshCw, Eye } from 'lucide-react';
import { mockQuotes, mockMeetings } from '../data/mockData';
import { DashboardCard } from '../components/DashboardCard';
import { MeetingsCalendar } from '../components/MeetingsCalendar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface DashboardHomeProps {
  onNavigate: (page: string) => void;
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const activeQuotes = mockQuotes
    .filter(q => q.status === 'in-progress' || q.status === 'pending')
    .slice(0, 5);

  const coldQuotes = mockQuotes
    .filter(q => q.status === 'cold')
    .slice(0, 5);

  const upcomingMeetings = mockMeetings
    .filter(m => new Date(m.dateTime) > new Date('2025-10-03'))
    .slice(0, 5);

  const statusColors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'in-progress': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    cold: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  };

  const getQuoteInfo = (quoteId: string) => {
    return mockQuotes.find(q => q.id === quoteId);
  };



  const totalQuotesStats = mockQuotes.length;
  const activeQuotesStats = mockQuotes.filter(q => !q.isCold && !q.isArchived).length;
  const coldQuotesStats = mockQuotes.filter(q => q.isCold && !q.isArchived).length;
  const totalValueStats = mockQuotes.filter(q => !q.isCold && !q.isArchived).reduce((sum, q) => sum + q.totalValue, 0);
  const avgQuoteValue = activeQuotesStats > 0 ? Math.round(totalValueStats / activeQuotesStats) : 0;
  const upcomingMeetingsCount = mockMeetings.filter(m => new Date(m.dateTime) > new Date('2025-10-09')).length;
  const totalMeetings = mockMeetings.length;

  const stats = [
    {
      title: 'Total Quotes',
      value: totalQuotesStats,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      trend: '+12%'
    },
    {
      title: 'Active Quotes',
      value: activeQuotesStats,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      trend: '+8%'
    },
    {
      title: 'Cold Quotes',
      value: coldQuotesStats,
      icon: Snowflake,
      color: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
      trend: '-5%'
    },
    {
      title: 'Total Value',
      value: `$${(totalValueStats / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'bg-teal-500',
      textColor: 'text-teal-600 dark:text-teal-400',
      trend: '+15%'
    },
    {
      title: 'Meetings',
      value: totalMeetings,
      icon: Calendar,
      color: 'bg-pink-500',
      textColor: 'text-pink-600 dark:text-pink-400',
      trend: '+6%'
    }
  ];

  const statusData = [
    { name: 'Active', value: mockQuotes.filter(q => q.status === 'Active').length, color: '#3b82f6' },
    { name: 'Order Expected', value: mockQuotes.filter(q => q.status === 'Order expected').length, color: '#10b981' },
    { name: 'Long-shot', value: mockQuotes.filter(q => q.status === 'Long-shot opportunity').length, color: '#f59e0b' },
    { name: 'Project/Longterm', value: mockQuotes.filter(q => q.status === 'Project/Longterm').length, color: '#8b5cf6' },
    { name: 'Non-responsive', value: mockQuotes.filter(q => q.status === 'Non-responsive').length, color: '#ef4444' }
  ];

  const valueByMonthData = [
    { month: 'Jun', value: 180 },
    { month: 'Jul', value: 220 },
    { month: 'Aug', value: 195 },
    { month: 'Sep', value: 285 },
    { month: 'Oct', value: totalValueStats / 1000 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quick overview of your quotes and meetings
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Dashboard
          </button>
          {/* <button
            onClick={() => onNavigate('create-quote')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Create New Quote
          </button> */}
        </div>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs mt-2 font-semibold ${
                    stat.trend.startsWith('+')
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.trend} from last month
                  </p>
                </div>
                <div className={`p-4 ${stat.color} rounded-xl shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Quote Value Trend
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={valueByMonthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              Quotes by Status
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Active Quotes"
          icon={FileText}
          iconColor="bg-blue-600"
          onViewMore={() => onNavigate('active-quotes')}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => onNavigate('active-quotes')}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              <Eye className="w-4 h-4" />
              View All Quotes
            </button>
          </div>
          <div className="space-y-3">
            {activeQuotes.map(quote => (
              <div
                key={quote.id}
                className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => onNavigate('active-quotes')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {quote.clientName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {quote.projectName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {quote.id}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[quote.status]}`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}

            {activeQuotes.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No active quotes
              </p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Cold Quotes"
          icon={Snowflake}
          iconColor="bg-orange-600"
          onViewMore={() => onNavigate('cold-quotes')}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => onNavigate('cold-quotes')}
              className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
            >
              <Eye className="w-4 h-4" />
              View All Cold Quotes
            </button>
          </div>
          <div className="space-y-3">
            {coldQuotes.map(quote => {
              const daysSince = Math.ceil(
                Math.abs(new Date('2025-10-03').getTime() - new Date(quote.lastFollowUp).getTime()) /
                (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={quote.id}
                  className="p-3 bg-orange-50 dark:bg-gray-900 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => onNavigate('cold-quotes')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {quote.clientName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {quote.projectName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {quote.id}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-full text-xs font-bold whitespace-nowrap">
                      {daysSince}d
                    </span>
                  </div>
                </div>
              );
            })}

            {coldQuotes.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No cold quotes
              </p>
            )}
          </div>
        </DashboardCard>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              Upcoming Meetings Calendar
            </h3>
            <button
              onClick={() => onNavigate('meetings')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              View Meetings
            </button>
          </div>
          <MeetingsCalendar
            meetings={mockMeetings.filter(m => new Date(m.dateTime) > new Date('2025-10-03'))}
            onMeetingClick={() => onNavigate('meetings')}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Meetings List</h3>
          <div className="space-y-3">
            {upcomingMeetings.map(meeting => {
              const quote = getQuoteInfo(meeting.quoteId);
              const date = new Date(meeting.dateTime);
              const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={meeting.id}
                  className="p-3 bg-green-50 dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => onNavigate('meetings')}
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {quote?.companyNames[0] || 'Unknown Client'}
                      </p>
                      <span className="text-xs font-medium text-green-700 dark:text-green-300 whitespace-nowrap">
                        {dateStr}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {meeting.contactPerson}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {meeting.quoteId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {timeStr}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {upcomingMeetings.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No upcoming meetings
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Average Quote Value</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${avgQuoteValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Upcoming Meetings</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">{upcomingMeetingsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Order Expected</span>
              <span className="text-lg font-bold text-teal-600 dark:text-teal-400">{mockQuotes.filter(q => q.status === 'Order expected').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Total Flowmeters</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{mockQuotes.filter(q => !q.isCold).reduce((sum, q) => sum + q.totalFlowmeters, 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Quotes by Value</h3>
          <div className="space-y-3">
            {mockQuotes
              .filter(q => !q.isCold)
              .sort((a, b) => b.totalValue - a.totalValue)
              .slice(0, 4)
              .map(quote => (
                <div key={quote.id} className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {quote.companyNames[0]}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {quote.projectName}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                    ${(quote.totalValue / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
