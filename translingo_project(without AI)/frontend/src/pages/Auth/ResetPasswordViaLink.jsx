import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, ArrowLeft, X } from 'lucide-react';
import api from '../../api/client';
import { getPasswordStrength } from '../../utils/passwordStrength'; //

const ResetPasswordViaLink = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  // Form States
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  
  // Logic States
  const [checkingToken, setCheckingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // UI States
  const [strength, setStrength] = useState({ score: 0, label: 'Weak', color: 'bg-gray-200' });
  const [showStrength, setShowStrength] = useState(false);
  const [errorToast, setErrorToast] = useState(null);

  // --- 1. CHECK EXPIRY ON LOAD ---
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setCheckingToken(false);
        return;
      }
      try {
        // Calling SIMPLE route (matches backend)
        await api.post('/auth/verify-reset-token', { token });
        setIsTokenValid(true);
      } catch (err) {
        setIsTokenValid(false); 
      } finally {
        setCheckingToken(false);
      }
    };
    verifyToken();
  }, [token]);

  // --- Helpers ---
  const triggerError = (title, messages) => {
    const msgList = Array.isArray(messages) ? messages : [messages];
    setErrorToast({ title, messages: msgList });
    setTimeout(() => setErrorToast(null), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      const stats = getPasswordStrength(value);
      setStrength(stats);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorToast(null);

    const errors = [];
    if (!formData.password) errors.push("Password is required");
    if (formData.password.length < 7) errors.push("Min 7 chars required");
    if (strength.score < 2) errors.push("Password is too weak");
    if (formData.password !== formData.confirmPassword) errors.push("Passwords do not match");

    if (errors.length > 0) {
      triggerError("Action Failed", errors);
      return;
    }

    setLoading(true);
    try {
      // Calling SIMPLE route (matches backend)
      await api.post('/auth/reset-password-via-link', {
        token: token,
        new_password: formData.password
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      const msg = err.response?.data?.detail || "Link expired or invalid.";
      triggerError("Action Failed", [msg]);
    } finally {
      setLoading(false);
    }
  };

  // --- VIEW 1: LOADING ---
  if (checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // --- VIEW 2: EXPIRED ---
  if (!token || !isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-red-100">
          <AlertCircle className="mx-auto text-red-500 w-12 h-12 mb-4"/>
          <h2 className="text-xl font-bold text-gray-800">Link Expired</h2>
          <p className="text-gray-500 mt-2 mb-6">
            This link is invalid or has expired (valid for 5 mins).
          </p>
          <Link to="/auth/forgot-password" className="text-blue-600 font-semibold hover:underline bg-blue-50 px-4 py-2 rounded-lg">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  // --- VIEW 3: SUCCESS ---
  if (success) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-green-100 animate-in zoom-in-95">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
                <button onClick={() => navigate('/login')} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 mt-4 transition">
                    Login Now
                </button>
            </div>
        </div>
    );
  }

  // --- VIEW 4: MAIN FORM ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative overflow-hidden">
      
      {/* --- ERROR TOAST (Matches Screenshot 2025-12-25 072324.png) --- */}
      {errorToast && (
        <div className="fixed top-6 right-6 z-[100] max-w-md w-full bg-red-50 border border-red-100 rounded-lg shadow-xl p-4 animate-in slide-in-from-right-10 duration-300">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3 w-full">
              <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-red-900">{errorToast.title}</h3>
                  <button onClick={() => setErrorToast(null)} className="text-red-400 hover:text-red-600">
                    <X size={18} />
                  </button>
              </div>
              <div className="mt-2 text-sm text-red-800">
                <ul className="list-disc pl-5 space-y-1">
                  {errorToast.messages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <div className="relative">
                    <input 
                        type={showPass ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setShowStrength(true)}
                        className={`block w-full pl-4 pr-10 py-3 border rounded-xl dark:bg-gray-700 dark:text-white outline-none transition placeholder-gray-400 ${showStrength ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
                        placeholder="New Password"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                
                {/* --- STRENGTH METER (Matches Screenshot 2025-12-23 230812.png) --- */}
                {showStrength && (
                    <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">STRENGTH</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{strength.label}</span>
                        </div>
                        
                        {/* 4 Bars Logic */}
                        <div className="flex gap-2 h-1.5 mb-3">
                            {[1, 2, 3, 4].map((level) => (
                                <div 
                                  key={level} 
                                  className={`flex-1 rounded-full transition-all duration-300 ${
                                    strength.score >= level ? strength.color : 'bg-gray-200 dark:bg-gray-600'
                                  }`}
                                ></div>
                            ))}
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Use 7+ chars with mixed letters & numbers.
                        </p>
                    </div>
                )}
            </div>

            <div>
                <input 
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-4 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                    placeholder="Confirm Password"
                />
            </div>

            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30">
                {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
            </button>
        </form>
        
        <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordViaLink;