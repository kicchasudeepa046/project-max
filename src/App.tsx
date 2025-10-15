


// import { useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import { ToastProvider } from './contexts/ToastContext';
// import { Header } from './components/Header';
// import { Sidebar } from './components/Sidebar';
// import { SignIn } from './pages/SignIn';
// import { Dashboard } from './pages/Dashboard';
// import { DashboardHome } from './pages/DashboardHome';
// import { ActiveQuotes } from './pages/ActiveQuotes';
// import { ColdQuotes } from './pages/ColdQuotes';
// import { Meetings } from './pages/Meetings';
// import { CreateQuote } from './pages/CreateQuote';
// import { UnderDevelopment } from './components/UnderDevelopment';
// import { ProtectedRoute } from './components/ProtectedRoute';

// function AppLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const { isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     return (
//       <Routes>
//         <Route path="/sign-in" element={<SignIn />} />
//         <Route path="*" element={<Navigate to="/sign-in" replace />} />
//       </Routes>
//     );
//   }

//   return (
//     <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
//       <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
//       <div className="mt-16 h-[calc(100vh-4rem)]">
//         <Sidebar
//           isOpen={isSidebarOpen}
//           onClose={() => setIsSidebarOpen(false)}
//           isCollapsed={isSidebarCollapsed}
//           onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
//         />
//         <main
//           className={`
//             h-full overflow-y-auto p-6 transition-all duration-300 relative z-0
//             ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
//           `}
//         >
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <DashboardHome onNavigate={(page) => window.location.href = `/${page}`} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/create-quote"
//               element={
//                 <ProtectedRoute>
//                   <CreateQuote onNavigate={(page) => window.location.href = `/${page}`} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/active-quotes"
//               element={
//                 <ProtectedRoute>
//                   <ActiveQuotes />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/cold-quotes"
//               element={
//                 <ProtectedRoute>
//                   <ColdQuotes />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/meetings"
//               element={
//                 <ProtectedRoute>
//                   <Meetings />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/reports"
//               element={
//                 <ProtectedRoute>
//                   <UnderDevelopment />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/settings"
//               element={
//                 <ProtectedRoute>
//                   <UnderDevelopment />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <ThemeProvider>
//         <AuthProvider>
//           <ToastProvider>
//             <AppLayout />
//           </ToastProvider>
//         </AuthProvider>
//       </ThemeProvider>
//     </BrowserRouter>
//   );
// }


import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SignIn } from './pages/SignIn';
import { DashboardHome } from './pages/DashboardHome';
import { ActiveQuotes } from './pages/ActiveQuotes';
import { ColdQuotes } from './pages/ColdQuotes';
import { Meetings } from './pages/Meetings';
import { CreateQuote } from './pages/CreateQuote';
import { Emails } from './pages/Emails';
import { UnderDevelopment } from './components/UnderDevelopment';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Settings } from './pages/Settings';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Navigation handler for client-side routing
  const handleNavigate = (page: string) => {
    console.log('Navigating to:', `/${page}`); // Debug log
    navigate(`/${page}`);
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="mt-16 h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main
          className={`
            h-full overflow-y-auto p-6 transition-all duration-300 relative z-0
            ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
          `}
        >
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardHome onNavigate={handleNavigate} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-quote"
              element={
                <ProtectedRoute>
                  <CreateQuote onNavigate={handleNavigate} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/active-quotes"
              element={
                <ProtectedRoute>
                  <ActiveQuotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cold-quotes"
              element={
                <ProtectedRoute>
                  <ColdQuotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetings"
              element={
                <ProtectedRoute>
                  <Meetings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emails"
              element={
                <ProtectedRoute>
                  <Emails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <UnderDevelopment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppLayout />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}