import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, X as XIcon, LogIn } from 'lucide-react';
import api from '../../api/client'; // Import API Client

// --- VALIDATION SCHEMA ---
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isValidationAlertOpen, setIsValidationAlertOpen] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    setIsValidationAlertOpen(false);

    try {
      // --- ROOT FIX: Simple JSON Request ---
      // Ab Backend "LoginRequest" model use kar raha hai (email, password)
      const response = await api.post('/auth/login', {
        email: data.email,       // Backend expects 'email'
        password: data.password  // Backend expects 'password'
      });

      // Login Success
      console.log("Login Success:", response.data);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); 

      navigate('/dashboard');

    } catch (error) {
      console.error("Login Error:", error);
      setIsValidationAlertOpen(true); 
      
      // Detailed Error Handling
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.detail) {
             // Agar Backend se simple string error aye
             if (typeof errorData.detail === 'string') {
                 setServerError(errorData.detail);
             } 
             // Agar validation array aye
             else if (Array.isArray(errorData.detail)) {
                 setServerError(errorData.detail[0].msg);
             }
        } else {
           setServerError("Login failed. Please check your credentials.");
        }
      } else {
        setServerError("Server not responding. Please check your connection.");
      }
      
      setTimeout(() => setIsValidationAlertOpen(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  const onError = () => {
    setIsValidationAlertOpen(true);
    setTimeout(() => setIsValidationAlertOpen(false), 5000);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 relative">
      
      {/* --- ERROR ALERT --- */}
      {isValidationAlertOpen && (Object.keys(errors).length > 0 || serverError) && (
        <div className="fixed top-4 right-4 z-[100] max-w-md w-full bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex justify-between items-start">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Login Failed</h3>
                {serverError && <p className="mt-1 text-sm text-red-700 dark:text-red-400 font-medium">{serverError}</p>}
                {Object.keys(errors).length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-400 space-y-1">
                    {Object.keys(errors).map((key) => <li key={key}>{errors[key]?.message}</li>)}
                  </ul>
                )}
              </div>
            </div>
            <button onClick={() => setIsValidationAlertOpen(false)} className="text-red-500 hover:text-red-700"><XIcon size={20} /></button>
          </div>
        </div>
      )}

      {/* --- LEFT SIDE --- */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"></div>
        <div className="relative z-10 p-12 text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>
          <p className="text-xl text-blue-100">Log in to access your translations.</p>
        </div>
      </div>

      {/* --- RIGHT SIDE FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <input {...register('email')} type="email" className={`block w-full pl-10 pr-3 py-3 border rounded-xl dark:bg-gray-800 dark:text-white ${errors.email || serverError ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`} placeholder="you@example.com" />
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              </div>
              <div className="relative">
                <input {...register('password')} type="password" className={`block w-full pl-10 pr-3 py-3 border rounded-xl dark:bg-gray-800 dark:text-white ${errors.password || serverError ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`} placeholder="••••••••" />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                 <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</Link>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center bg-blue-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-70">
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Sign In"}
              {!loading && <ArrowRight size={18} className="ml-2" />}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500 hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;