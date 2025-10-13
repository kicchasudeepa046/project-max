import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-full">
            <SettingsIcon className="w-16 h-16 text-gray-600 dark:text-gray-300" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings Coming Soon</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">Under Development</p>
        </div>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            User preferences and configuration options are currently being developed.
            Check back soon to customize your experience.
          </p>
        </div>
      </div>
    </div>
  );
}
