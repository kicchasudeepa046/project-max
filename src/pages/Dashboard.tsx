import { FileText, TrendingUp, CheckCircle, DollarSign, Calendar, Users } from 'lucide-react';
import { mockQuotes, mockMeetings } from '../data/mockData';
import { DashboardCard } from '../components/DashboardCard';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const activeQuotes = mockQuotes.filter(q => !q.isCold);
  const coldQuotes = mockQuotes.filter(q => q.isCold);
  const upcomingMeetings = mockMeetings.filter(m => new Date(m.dateTime) > new Date('2025-10-08'));

  const totalValue = mockQuotes.reduce((sum, q) => sum + q.totalValue, 0);
  const activeValue = activeQuotes.reduce((sum, q) => sum + q.totalValue, 0);
  const totalFlowmeters = mockQuotes.reduce((sum, q) => sum + q.totalFlowmeters, 0);

  const statusBreakdown = {
    'Active': mockQuotes.filter(q => q.status === 'Active').length,
    'Order expected': mockQuotes.filter(q => q.status === 'Order expected').length,
    'Long-shot opportunity': mockQuotes.filter(q => q.status === 'Long-shot opportunity').length,
    'Project/Longterm': mockQuotes.filter(q => q.status === 'Project/Longterm').length,
    'Non-responsive': mockQuotes.filter(q => q.status === 'Non-responsive').length,
  };

  const stats = [
    {
      title: 'Total Quotes',
      value: mockQuotes.length.toString(),
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      change: '+12%'
    },
    {
      title: 'Active Quotes',
      value: activeQuotes.length.toString(),
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      change: '+8%'
    },
    {
      title: 'Cold Quotes',
      value: coldQuotes.length.toString(),
      icon: FileText,
      color: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
      change: '-3%'
    },
    {
      title: 'Total Pipeline Value',
      value: `$${(totalValue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      change: '+15%'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of your quotation pipeline and activities
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 ${stat.color} rounded-lg flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quote Status Breakdown
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(statusBreakdown).map(([status, count]) => {
              const percentage = ((count / mockQuotes.length) * 100).toFixed(0);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{status}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Stats
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Pipeline</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    ${activeValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Flowmeters</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {totalFlowmeters}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Meetings</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {upcomingMeetings.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unique Companies</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {new Set(mockQuotes.flatMap(q => q.companyNames)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Recent Active Quotes"
          icon={FileText}
          iconColor="bg-blue-600"
          onViewMore={() => {}}
        >
          <div className="space-y-2">
            {activeQuotes.slice(0, 5).map(quote => (
              <Link
                key={quote.id}
                to="/active-quotes"
                className="block p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {quote.companyNames.join(', ')}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {quote.projectName}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    ${quote.totalValue.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Upcoming Meetings"
          icon={Calendar}
          iconColor="bg-green-600"
          onViewMore={() => {}}
        >
          <div className="space-y-2">
            {upcomingMeetings.slice(0, 5).map(meeting => {
              const quote = mockQuotes.find(q => q.id === meeting.quoteId);
              const date = new Date(meeting.dateTime);
              return (
                <Link
                  key={meeting.id}
                  to="/meetings"
                  className="block p-3 bg-green-50 dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {quote?.companyNames.join(', ') || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {meeting.contactPerson} • {meeting.location}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-300 whitespace-nowrap">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
              );
            })}
            {upcomingMeetings.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No upcoming meetings
              </p>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
