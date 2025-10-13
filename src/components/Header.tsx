// import { Menu, LogOut, User } from 'lucide-react';
// import { ThemeToggle } from './ThemeToggle';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '../contexts/ToastContext';

// interface HeaderProps {
//   onToggleSidebar: () => void;
// }

// export function Header({ onToggleSidebar }: HeaderProps) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   const handleLogout = () => {
//     logout();
//     showToast('Successfully logged out', 'success');
//     navigate('/sign-in');
//   };

//   return (
//     <header className="fixed inset-x-0 top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 h-16 flex items-center transition-colors duration-200">
//       <div className="flex items-center justify-between w-full">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={onToggleSidebar}
//             className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//             aria-label="Toggle sidebar"
//           >
//             <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Project Max
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <ThemeToggle />

//           {user && (
//             <div className="flex items-center gap-3">
//               <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
//                 <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   {user.name}
//                 </span>
//               </div>

//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg transition-colors"
//                 title="Logout"
//               >
//                 <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
//                 <span className="hidden sm:inline text-sm font-medium text-red-600 dark:text-red-400">
//                   Logout
//                 </span>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }


// Header component remains unchanged
import { Menu, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Successfully logged out', 'success');
    navigate('/sign-in');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 h-16 flex items-center transition-colors duration-200">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Project Max
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="hidden sm:inline text-sm font-medium text-red-600 dark:text-red-400">
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}