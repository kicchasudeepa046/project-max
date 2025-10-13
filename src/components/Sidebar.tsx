// import { LayoutDashboard, FileText, Snowflake, Calendar, BarChart3, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';
// import { Link, useLocation } from 'react-router-dom';

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   isCollapsed: boolean;
//   onToggleCollapse: () => void;
// }

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
//   { id: 'active-quotes', label: 'Active Quotes', icon: FileText, path: '/active-quotes' },
//   { id: 'cold-quotes', label: 'Cold Quotes', icon: Snowflake, path: '/cold-quotes' },
//   { id: 'meetings', label: 'Meetings', icon: Calendar, path: '/meetings' },
//   { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
//   { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
// ];

// export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
//   const location = useLocation();

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-x-0 top-16 bottom-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`
//           bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto
//           fixed top-16 bottom-0 left-0 z-50 lg:static lg:top-auto lg:bottom-auto lg:left-auto lg:z-auto
//           transform transition-all duration-300 ease-in-out
//           ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
//           ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64
//         `}
//       >
//         <div className="hidden lg:flex items-center justify-end p-4 border-b border-gray-200 dark:border-gray-700">
//           <button
//             onClick={onToggleCollapse}
//             className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//             title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//           >
//             {isCollapsed ? (
//               <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//             ) : (
//               <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//             )}
//           </button>
//         </div>

//         <div className="flex items-center justify-between p-6 lg:hidden">
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//           </button>
//         </div>

//         <nav className="p-4 space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;

//             return (
//               <Link
//                 key={item.id}
//                 to={item.path}
//                 onClick={onClose}
//                 className={`
//                   flex items-center gap-3 px-4 py-3 rounded-lg
//                   transition-all duration-200
//                   ${isActive
//                     ? 'bg-blue-600 text-white shadow-lg'
//                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                   }
//                   ${isCollapsed ? 'lg:justify-center' : ''}
//                 `}
//                 title={isCollapsed ? item.label : ''}
//               >
//                 <Icon className="w-5 h-5 flex-shrink-0" />
//                 {!isCollapsed && <span className="font-medium lg:block">{item.label}</span>}
//                 <span className={`font-medium lg:hidden`}>{item.label}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>
//     </>
//   );
// }


import { LayoutDashboard, FileText, Snowflake, Calendar, BarChart3, Settings, X, ChevronLeft, ChevronRight, Mail, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'emails', label: 'AI Emails', icon: Mail, path: '/emails' },
  { id: 'active-quotes', label: 'Active Quotes', icon: FileText, path: '/active-quotes' },
  { id: 'cold-quotes', label: 'Cold Quotes', icon: Snowflake, path: '/cold-quotes' },
  // { id: 'create-quote', label: 'Create Quote', icon: Plus, path: '/create-quote' },
  { id: 'meetings', label: 'Meetings', icon: Calendar, path: '/meetings' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
];

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-x-0 top-16 bottom-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto
          fixed top-16 bottom-0 left-0 z-50
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64
        `}
      >
        <div className="hidden lg:flex items-center justify-end p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between p-6 lg:hidden">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                  ${isCollapsed ? 'lg:justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium lg:block">{item.label}</span>}
                <span className={`font-medium lg:hidden`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}