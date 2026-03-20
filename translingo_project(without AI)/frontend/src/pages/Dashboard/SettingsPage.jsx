import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User, Camera, Save, Loader2, Mail, Phone, Lock, Shield, Globe, Bell } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general'); // Tabs Logic Added
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // User State
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    avatar: ''
  });

  // Fetch Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData({
            first_name: res.data.first_name || '',
            last_name: res.data.last_name || '',
            email: res.data.email || '',
            phone_number: res.data.phone_number || '',
            avatar: res.data.avatar || ''
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/v1/auth/update-profile', 
        { avatar: userData.avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.avatar = userData.avatar;
      localStorage.setItem('user', JSON.stringify(currentUser));
      window.location.reload(); 
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Account Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- Sidebar Tabs --- */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <SidebarButton 
              active={activeTab === 'general'} 
              onClick={() => setActiveTab('general')} 
              icon={<User size={18} />} label="General" 
            />
            <SidebarButton 
              active={activeTab === 'security'} 
              onClick={() => setActiveTab('security')} 
              icon={<Shield size={18} />} label="Security" 
            />
            <SidebarButton 
              active={activeTab === 'preferences'} 
              onClick={() => setActiveTab('preferences')} 
              icon={<Globe size={18} />} label="Preferences" 
            />
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-50 border-4 border-white shadow-md flex items-center justify-center">
                    {userData.avatar ? (
                      <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-blue-600">{userData.first_name?.[0]}</span>
                    )}
                  </div>
                  <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-sm transition transform hover:scale-105">
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*"/>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Profile Photo</h3>
                  <p className="text-sm text-gray-500">Update your avatar.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReadOnlyField label="First Name" value={userData.first_name} />
                <ReadOnlyField label="Last Name" value={userData.last_name} />
                <ReadOnlyField label="Email Address" value={userData.email} icon={<Mail size={16}/>} fullWidth />
                <ReadOnlyField label="Phone Number" value={userData.phone_number || 'Not Added'} icon={<Phone size={16}/>} fullWidth />
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleSaveChanges} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-md disabled:opacity-50">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h3 className="text-xl font-bold mb-4">Security Settings</h3>
               <p className="text-gray-500 mb-6">Manage your password and security preferences.</p>
               
               <div className="space-y-4">
                  <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center">
                     <div>
                        <h4 className="font-medium text-gray-900">Change Password</h4>
                        <p className="text-sm text-gray-500">Update your password regularly to keep your account secure.</p>
                     </div>
                     <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white transition">Update</button>
                  </div>

                  <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center">
                     <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                     </div>
                     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Enable</button>
                  </div>
               </div>
            </div>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === 'preferences' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h3 className="text-xl font-bold mb-4">Preferences</h3>
               
               <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select className="w-full md:w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none">
                       <option>English (United States)</option>
                       <option>Urdu</option>
                       <option>Punjabi</option>
                    </select>
                 </div>

                 <div className="flex items-center justify-between py-4 border-t border-gray-100">
                    <div>
                       <h4 className="font-medium text-gray-900">Email Notifications</h4>
                       <p className="text-sm text-gray-500">Receive emails about new features and updates.</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-blue-600 translate-x-6"/>
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-600 cursor-pointer"></label>
                    </div>
                 </div>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const SidebarButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
      active 
      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
      : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const ReadOnlyField = ({ label, value, icon, fullWidth }) => (
  <div className={fullWidth ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input 
        type="text" value={value} disabled
        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
      />
      {icon && <div className="absolute right-3 top-3 text-gray-400">{icon}</div>}
      <Lock size={16} className={`absolute ${icon ? 'right-10' : 'right-3'} top-3 text-gray-400`} />
    </div>
  </div>
);

export default SettingsPage;