
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-700 transition-colors">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">SecureAuth</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                  <UserIcon className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">{user?.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
