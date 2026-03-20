import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  LogOut, 
  CreditCard, 
  Menu,
  Bell
} from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: History, label: 'Translation History', path: '/dashboard/history' },
    { icon: CreditCard, label: 'Subscription', path: '/dashboard/billing' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <span className={`font-bold text-2xl text-blue-600 ${!sidebarOpen && 'hidden'}`}>
            TransLingo
          </span>
          {!sidebarOpen && <span className="text-xl font-bold text-blue-600">TL</span>}
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'} 
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <item.icon size={20} />
              <span className={`ml-3 font-medium ${!sidebarOpen && 'hidden'}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            <LogOut size={20} />
            <span className={`ml-3 font-medium ${!sidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Dashboard Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-blue-600">
            <Menu size={24} />
          </button>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;