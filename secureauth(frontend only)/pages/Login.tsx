
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validateEmail = (val: string) => {
    if (!val) return 'Email is required';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) return 'Invalid email format';
    return '';
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const err = validateEmail(email);
      setFieldErrors(prev => ({ ...prev, email: err }));
    } else if (field === 'password') {
      setFieldErrors(prev => ({ ...prev, password: password ? '' : 'Password is required' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailErr = validateEmail(email);
    const passErr = password ? '' : 'Password is required';
    
    if (emailErr || passErr) {
      setFieldErrors({ email: emailErr, password: passErr });
      setTouched({ email: true, password: true });
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">
            Securely sign in to your dashboard
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 text-sm text-red-800 bg-red-50 rounded-xl border border-red-100 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${touched.email && fieldErrors.email ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onBlur={() => handleBlur('email')}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) setFieldErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }));
                  }}
                  className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all text-slate-900 placeholder-slate-400 ${
                    touched.email && fieldErrors.email 
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {touched.email && fieldErrors.email && (
                <p className="mt-1.5 ml-1 text-[11px] text-red-500 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${touched.password && fieldErrors.password ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onBlur={() => handleBlur('password')}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) setFieldErrors(prev => ({ ...prev, password: e.target.value ? '' : 'Password is required' }));
                  }}
                  className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all text-slate-900 placeholder-slate-400 ${
                    touched.password && fieldErrors.password 
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {touched.password && fieldErrors.password && (
                <p className="mt-1.5 ml-1 text-[11px] text-red-500 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500/20 border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
