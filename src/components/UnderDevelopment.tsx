import { Wrench } from 'lucide-react';

export function UnderDevelopment() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-6 rounded-full">
            <Wrench className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Under Development
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          This feature is currently being developed and will be available soon.
          Thank you for your patience!
        </p>
      </div>
    </div>
  );
}
