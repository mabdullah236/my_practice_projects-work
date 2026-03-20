import React, { useState, useEffect } from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: '', avatar: '' });

  // Load User Data from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  return (
    <div className="bg-white h-16 px-6 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
      
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
          <Menu size={20} />
        </button>
        <h2 className="text-xl font-bold text-blue-600 hidden md:block">TransLingo</h2>
      </div>

      {/* Right: Profile Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* --- PROFILE SECTION START --- */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          
          {/* Logic: Agar Avatar hai to Image dikhao, warnaa Initials */}
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold overflow-hidden border border-gray-200">
            {user.avatar ? (
               <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <span>{user.first_name ? user.first_name[0].toUpperCase() : 'U'}</span>
            )}
          </div>
          
        </div>
        {/* --- PROFILE SECTION END --- */}
      </div>
    </div>
  );
};

export default Navbar;