import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Languages, 
  Loader2, 
  Plus, 
  CheckCircle2, 
  Clock,
  ArrowRight as ArrowIcon 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // --- FETCH LIVE DATA ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/auth/login');
          return;
        }

        const res = await axios.get('http://localhost:8000/api/v1/translation/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const recentTranslations = stats?.recent_projects || [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          {/* FIX: Ab yahan Name ayega jo backend se clean ho kar aya hai */}
          <h1 className="text-3xl font-bold text-gray-900">
             Hello, {stats?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here is your translation overview.</p>
        </div>
        
        <button 
          onClick={() => navigate('/translate')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-blue-500/30"
        >
          <Plus size={20} /> New Translation
        </button>
      </div>

      {/* --- STATS CARDS (Reduced to 2) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 1: Total */}
        <StatCard 
          title="Total Projects" 
          count={stats?.total_projects || 0} 
          icon={<Languages size={24} />} 
          bg="bg-blue-100 text-blue-600"
        />

        {/* Card 2: Completed */}
        <StatCard 
          title="Completed Translations" 
          count={stats?.completed || 0} 
          icon={<CheckCircle2 size={24} />} 
          bg="bg-green-100 text-green-600"
        />
      </div>

      {/* --- CALL TO ACTION (If empty) --- */}
      {(stats?.total_projects === 0) && (
        <div className="mb-8 bg-white border border-blue-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between">
             <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-800">Start Translating Now</h3>
                <p className="text-gray-500 mt-1">Translate text into multiple languages instantly with AI.</p>
             </div>
             <button 
               onClick={() => navigate('/translate')} 
               className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
             >
               Go to Translator
             </button>
        </div>
      )}

      {/* --- RECENT HISTORY --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Recent History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Languages</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Original Text</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTranslations.length > 0 ? (
                recentTranslations.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase">{item.source_lang}</span>
                        <ArrowIcon size={14} className="text-gray-400" />
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">{item.target_lang}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 truncate max-w-xs">{item.original_text}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Clock size={32} className="text-gray-300 mb-2" />
                      <p>No recent translations found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Stat Card Component ---
const StatCard = ({ title, count, icon, bg }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-gray-900 mt-1">{count}</h2>
    </div>
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;