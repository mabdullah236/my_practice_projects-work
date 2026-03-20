import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const PublicNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Check karein k user login hai ya nahi
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">TransLingo</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/features" className="text-gray-600 hover:text-blue-600 font-medium">Features</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-blue-600 font-medium">Pricing</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium">Contact</Link>
          </div>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              // Agar Login hai to Dashboard Button aur Avatar dikhao
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-blue-600 font-medium"
                 >
                   Go to Dashboard
                 </button>
                 <div 
                   onClick={() => navigate('/dashboard/settings')}
                   className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold cursor-pointer border border-blue-200"
                 >
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span>{user.first_name ? user.first_name[0].toUpperCase() : 'U'}</span>
                    )}
                 </div>
              </div>
            ) : (
              // Agar Login NAHI hai to Login/Signup dikhao
              <>
                <Link to="/auth/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link to="/auth/signup" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">Home</Link>
          <Link to="/features" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">Features</Link>
          <Link to="/pricing" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">Pricing</Link>
          <Link to="/contact" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">Contact</Link>
          <div className="border-t border-gray-100 my-2"></div>
          {user ? (
             <button onClick={() => navigate('/dashboard')} className="block w-full text-left px-4 py-2 text-blue-600 font-bold">
               Go to Dashboard
             </button>
          ) : (
            <>
              <Link to="/auth/login" className="block px-4 py-2 text-gray-600">Login</Link>
              <Link to="/auth/signup" className="block px-4 py-2 text-blue-600 font-bold">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;