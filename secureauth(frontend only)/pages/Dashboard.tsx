
import React from 'react';
import { useAuth } from '../components/AuthContext';
import { Shield, Key, Clock, Settings, Bell, Search, Layout } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.fullName}!</h1>
          <p className="text-slate-500">Here's a snapshot of your protected session details.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Account Security</h3>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Secure</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Username</span>
              <span className="font-medium text-slate-900">@{user?.username}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-900">{user?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Account ID</span>
              <span className="font-mono text-xs font-medium text-slate-700">{user?.id}</span>
            </div>
          </div>
        </div>

        {/* Token Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">JWT Authentication Token</h3>
              <p className="text-xs text-slate-500">Encoded session token currently stored in LocalStorage</p>
            </div>
          </div>
          <div className="relative group">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 break-all font-mono text-xs text-slate-600 h-24 overflow-y-auto custom-scrollbar">
              {token}
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold shadow-sm hover:bg-slate-50">
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Status Activity */}
        <div className="md:col-span-3 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Layout className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-xl">Recent Activity</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="mt-1 w-2 h-2 rounded-full bg-indigo-600"></div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Successful Login Attempt</p>
                <p className="text-xs text-slate-500">Just now from Chrome Browser (macOS)</p>
              </div>
              <div className="ml-auto text-xs font-medium text-slate-400">
                <Clock className="w-3 h-3 inline mr-1" /> 2m ago
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="mt-1 w-2 h-2 rounded-full bg-slate-300"></div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Session Initialized</p>
                <p className="text-xs text-slate-500">LocalStorage synchronization complete</p>
              </div>
              <div className="ml-auto text-xs font-medium text-slate-400">
                <Clock className="w-3 h-3 inline mr-1" /> 5m ago
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="mt-1 w-2 h-2 rounded-full bg-slate-300"></div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Account Created</p>
                <p className="text-xs text-slate-500">Welcome to SecureAuth!</p>
              </div>
              <div className="ml-auto text-xs font-medium text-slate-400">
                <Clock className="w-3 h-3 inline mr-1" /> 15m ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
