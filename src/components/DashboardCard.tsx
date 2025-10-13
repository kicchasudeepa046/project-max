import { ReactNode } from 'react';
import { ArrowRight, Video as LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  onViewMore: () => void;
  children: ReactNode;
}

export function DashboardCard({ title, icon: Icon, iconColor, onViewMore, children }: DashboardCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${iconColor} rounded-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onViewMore}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          View More
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
