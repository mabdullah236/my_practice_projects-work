import React, { useEffect, useState } from 'react';
import PublicNavbar from '../../layouts/PublicNavbar';
import { Target, Heart, Users, Globe, Loader2 } from 'lucide-react';
import api from '../../api/client'; // API Client use karein

const About = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Team from Database
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/admin/team');
        setTeam(res.data);
      } catch (error) {
        console.error("Failed to load team", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      <PublicNavbar />
      
      {/* ... (Hero Section aur Mission Section Same rahega - Copy from previous) ... */}
       <div className="relative py-24 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            Bridging the World <span className="text-blue-600">Through Language</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            At TransLingo, we believe that language shouldn't be a barrier to opportunity. 
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* ... (Mission Section same as before) ... */}

        {/* Dynamic Team Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Meet the Team</h2>
          
          {loading ? (
            <div className="flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : team.length === 0 ? (
            <p className="text-gray-500">Our team is growing! Check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member._id} className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition duration-300">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 group-hover:border-blue-500 transition">
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default About;