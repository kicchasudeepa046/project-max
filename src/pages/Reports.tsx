import { BarChart3 } from 'lucide-react';

export function Reports() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-6 bg-blue-100 dark:bg-blue-900 rounded-full">
            <BarChart3 className="w-16 h-16 text-blue-600 dark:text-blue-300" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reports Coming Soon</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">Under Development</p>
        </div>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Advanced reporting and analytics features are currently being developed.
            Check back soon for detailed insights and visualizations.
          </p>
        </div>
      </div>
    </div>
  );
}
