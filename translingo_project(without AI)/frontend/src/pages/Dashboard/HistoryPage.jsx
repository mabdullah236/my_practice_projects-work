import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, ArrowRight, Loader2, Search } from 'lucide-react';

const HistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        // Filhal dashboard stats wala endpoint use kr rhy hain data k liye
        const res = await axios.get('http://localhost:8000/api/v1/translation/dashboard/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data.recent_projects || []);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Translation History</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Bar (Dummy) */}
        <div className="p-4 border-b border-gray-100 flex gap-2">
            <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input type="text" placeholder="Search translations..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Original Text</th>
                <th className="px-6 py-4 font-medium">Languages</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 max-w-xs truncate text-gray-700 font-medium">{item.original_text}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">{item.source_lang}</span>
                        <ArrowRight size={14} className="text-gray-400" />
                        <span className="bg-green-50 text-green-600 px-2 py-1 rounded">{item.target_lang}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                        </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        <Clock className="mx-auto mb-2 text-gray-300" size={32} />
                        No history found.
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

export default HistoryPage;