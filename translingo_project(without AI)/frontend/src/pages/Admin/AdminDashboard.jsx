import React, { useEffect, useState } from 'react';
import Navbar from '../../layouts/Navbar'; // Use standard Navbar for now or create AdminNavbar
import { Users, Globe, DollarSign, Trash2, Plus, BarChart3 } from 'lucide-react';
import api from '../../api/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [team, setTeam] = useState([]);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);

  // Load Data
  const fetchData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      const teamRes = await api.get('/admin/team');
      setStats(statsRes.data);
      setTeam(teamRes.data);
    } catch (error) {
      console.error("Error loading admin data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if(!newName || !newRole) return;
    setLoading(true);
    try {
      await api.post('/admin/team', {
        name: newName,
        role: newRole,
        // Random Avatar generator based on name
        image_url: `https://ui-avatars.com/api/?name=${newName}&background=random`
      });
      setNewName(''); setNewRole('');
      fetchData(); // Refresh list
    } catch (error) {
      alert("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  // Delete Member
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/admin/team/${id}`);
      fetchData();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Navbar (Simple) */}
      <div className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-600 flex items-center gap-2">
          <BarChart3 /> Admin Portal
        </h1>
        <button className="text-sm text-gray-500" onClick={() => window.location.href='/'}>Back to Site</button>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        
        {/* STATS CARDS */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_users}</h2>
                </div>
                <div className="bg-blue-100 p-3 rounded-full"><Users className="text-blue-600"/></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Translations</p>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_translations}</h2>
                </div>
                <div className="bg-purple-100 p-3 rounded-full"><Globe className="text-purple-600"/></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Revenue</p>
                  <h2 className="text-3xl font-bold text-green-600">${stats.revenue}</h2>
                </div>
                <div className="bg-green-100 p-3 rounded-full"><DollarSign className="text-green-600"/></div>
              </div>
            </div>
            
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
               <p className="text-gray-500 text-sm mb-2">Plan Distribution</p>
               <div className="flex gap-2 text-xs">
                 <span className="px-2 py-1 bg-gray-100 rounded">Free: {stats.active_plans.Free}</span>
                 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Pro: {stats.active_plans.Pro}</span>
               </div>
            </div>
          </div>
        )}

        {/* TEAM MANAGEMENT SECTION */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Add Member Form */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-fit">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Plus size={20}/> Add Team Member
            </h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input 
                  type="text" value={newName} onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. Ali Khan" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                <input 
                  type="text" value={newRole} onChange={e => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. CEO" required
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                {loading ? 'Adding...' : 'Add Member'}
              </button>
            </form>
          </div>

          {/* Members List */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Current Team</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b dark:border-gray-700 text-gray-500 text-sm">
                    <th className="pb-3">Avatar</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {team.map(member => (
                    <tr key={member._id} className="group">
                      <td className="py-3">
                        <img src={member.image_url} className="w-10 h-10 rounded-full" alt="avatar" />
                      </td>
                      <td className="py-3 font-medium dark:text-white">{member.name}</td>
                      <td className="py-3 text-gray-500 text-sm">{member.role}</td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => handleDelete(member._id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {team.length === 0 && <p className="text-center text-gray-400 py-4">No members yet.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;