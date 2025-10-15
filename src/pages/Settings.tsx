// import { Settings as SettingsIcon } from 'lucide-react';

// export function Settings() {
//   return (
//     <div className="flex items-center justify-center min-h-[60vh]">
//       <div className="text-center space-y-6">
//         <div className="flex justify-center">
//           <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-full">
//             <SettingsIcon className="w-16 h-16 text-gray-600 dark:text-gray-300" />
//           </div>
//         </div>
//         <div className="space-y-2">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings Coming Soon</h2>
//           <p className="text-lg text-gray-600 dark:text-gray-400">Under Development</p>
//         </div>
//         <div className="max-w-md mx-auto">
//           <p className="text-sm text-gray-500 dark:text-gray-500">
//             User preferences and configuration options are currently being developed.
//             Check back soon to customize your experience.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Settings as SettingsIcon, Clock, Mail, Bell, Database } from 'lucide-react';

export function Settings() {
  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>
      </div>

      {/* Automatic Follow-up Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Automatic Follow-ups</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Configure how often automatic follow-up emails are sent after a quotation.
        </p>
        <div className="flex space-x-4">
          <select className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white">
            <option>Every 10 days</option>
            <option>Every 30 days</option>
            <option>Every 60 days</option>
            <option>Every 90 days</option>
            <option>Manual Only</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Save
          </button>
        </div>
      </div>

      {/* Email Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <Mail className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Email Preferences</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage sender details and templates used for follow-up messages.
        </p>
        <div className="space-y-3">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Default Sender Email</span>
            <input
              type="email"
              placeholder="sales@abc.com"
              className="mt-1 block w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
          </label>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Choose how you want to receive alerts for quote updates and follow-ups.
        </p>
        <div className="flex flex-col space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-blue-600" />
            <span>Email Notifications</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-blue-600" />
            <span>In-App Alerts</span>
          </label>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg w-fit">
            Update Notifications
          </button>
        </div>
      </div>

      {/* Data Settings */}
      {/* <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Data Management</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage synchronization, mock data refresh, and backup options.
        </p>
        <div className="flex space-x-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Refresh Mock Data
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Clear All Data
          </button>
        </div>
      </div> */}
    </div>
  );
}
