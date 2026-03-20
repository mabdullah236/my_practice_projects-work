import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ya tumhara 'api/client.js' agr bna hua hy
import { Eye, EyeOff, X, Check, AlertCircle } from 'lucide-react'; // Icons

const AdminResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // URL se token uthayega
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [strength, setStrength] = useState(0);

  // Helper: Toast Error dikha kr 2 sec mein gayab krna
  const triggerError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 2000);
  };

  // Strength Calculator
  const checkStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setStrength(score);
  };

  const handleChange = (e) => {
    setNewPassword(e.target.value);
    checkStrength(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return triggerError("Invalid Link");
    if (strength < 2) return triggerError("Password is too weak");

    try {
      // API URL check kr lena apny backend port k hisab sy
      await axios.post('http://localhost:8000/api/auth/reset-password-via-link', {
        token: token,
        new_password: newPassword
      });

      setSuccess("Password Updated Successfully!");
      setTimeout(() => navigate('/auth/login'), 2000); // 2 sec baad login pr bhej do

    } catch (err) {
      const msg = err.response?.data?.detail || "Something went wrong";
      triggerError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* --- Top Right Error Toast --- */}
      {error && (
        <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-bounce">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Set New Password</h2>
        <p className="text-gray-500 text-sm mb-6">Enter your new password below.</p>

        {success ? (
          <div className="bg-green-100 text-green-700 p-3 rounded flex items-center gap-2">
            <Check size={18} /> {success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Strength Bar */}
              {newPassword && (
                <div className="mt-2 h-1 w-full bg-gray-200 rounded overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      strength < 2 ? 'bg-red-500' : strength < 3 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(strength / 4) * 100}%` }}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminResetPassword;