import { useEffect, useState } from 'react';
import axios from 'axios';
// Agar aap react-router-dom use kr rhy hain navigation k liye
import { useNavigate } from 'react-router-dom'; 

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token'); 

        if (!token) {
            // Agar token nahi hai to login pe bhejo
            navigate('/auth/login'); 
            return;
        }

        const response = await axios.get('http://localhost:8000/api/v1/translation/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStats(response.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) return <div className="text-center p-4">Loading stats...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      
      {/* Welcome Message */}
      {stats?.message && (
        <p className="text-gray-600 mb-6">{stats.message}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" count={stats?.total_projects || 0} color="text-blue-600" />
        <StatCard title="Completed" count={stats?.completed || 0} color="text-green-600" />
        <StatCard title="Pending" count={stats?.pending || 0} color="text-orange-600" />
        <StatCard title="Active Translators" count={stats?.active_translators || 0} color="text-purple-600" />
      </div>
    </div>
  );
};

// Simple internal component for UI
const StatCard = ({ title, count, color }) => (
  <div className="bg-gray-50 p-4 rounded border border-gray-100 text-center">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className={`text-3xl font-bold ${color} mt-2`}>{count}</p>
  </div>
);

export default DashboardStats;