
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Mail, Lock, User, AlertCircle, Loader2, Check, X, Eye, EyeOff } from 'lucide-react';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'fullName':
        return value.trim().length < 2 ? 'Full name must be at least 2 characters' : '';
      case 'username':
        return value.trim().length < 3 ? 'Username must be at least 3 characters' : '';
      case 'email':
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !regex.test(value) ? 'Invalid email address format' : '';
      case 'password':
        return value.length < 8 ? 'Password must be at least 8 characters' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
    // Cross-validate confirm password if password changes
    if (name === 'password' && touched.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: formData.confirmPassword !== value ? 'Passwords do not match' : '' }));
    }
  };

  // Password strength logic
  const passwordMetrics = useMemo(() => {
    const pwd = formData.password;
    const checks = {
      length: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
    };

    let score = 0;
    if (checks.length) score++;
    if (checks.hasUpper && checks.hasLower) score++;
    if (checks.hasNumber) score++;
    if (checks.hasSpecial) score++;

    return { score, checks };
  }, [formData.password]);

  const getStrengthUI = () => {
    const { score } = passwordMetrics;
    if (!formData.password) return { label: 'Security Level', color: 'bg-slate-200', width: '0%', textColor: 'text-slate-400', message: 'Enter a strong password' };
    
    switch (score) {
      case 0:
      case 1:
        return { label: 'Weak', color: 'bg-rose-500', width: '25%', textColor: 'text-rose-500', message: 'Too easy to guess' };
      case 2:
        return { label: 'Fair', color: 'bg-amber-500', width: '50%', textColor: 'text-amber-500', message: 'Could be stronger' };
      case 3:
        return { label: 'Good', color: 'bg-blue-500', width: '75%', textColor: 'text-blue-500', message: 'A solid password' };
      case 4:
        return { label: 'Strong', color: 'bg-emerald-500', width: '100%', textColor: 'text-emerald-500', message: 'Excellent security' };
      default:
        return { label: 'Security Level', color: 'bg-slate-200', width: '0%', textColor: 'text-slate-400', message: '' };
    }
  };

  const strength = getStrengthUI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Trigger validation for all fields
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, (formData as any)[key]);
      if (err) errors[key] = err;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    if (passwordMetrics.score < 2) {
      setError('Your password is not secure enough. Please meet more requirements.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldClass = (name: string) => {
    const base = "block w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all text-slate-900 placeholder-slate-400";
    if (touched[name] && fieldErrors[name]) {
      return `${base} border-red-300 focus:ring-red-500/20 focus:border-red-500`;
    }
    return `${base} border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Join SecureAuth to access your protected dashboard
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 text-sm text-red-800 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className={`h-5 w-5 transition-colors ${touched.fullName && fieldErrors.fullName ? 'text-red-400' : 'text-slate-400'}`} />
              </div>
              <input
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClass('fullName')}
                placeholder="John Doe"
              />
            </div>
            {touched.fullName && fieldErrors.fullName && (
              <p className="mt-1.5 ml-1 text-[11px] text-red-500 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.fullName}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className={`text-sm font-bold transition-colors ${touched.username && fieldErrors.username ? 'text-red-400' : 'text-slate-400'}`}>@</span>
              </div>
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClass('username')}
                placeholder="johndoe"
              />
            </div>
            {touched.username && fieldErrors.username && (
              <p className="mt-1.5 ml-1 text-[11px] text-red-500 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 transition-colors ${touched.email && fieldErrors.email ? 'text-red-400' : 'text-slate-400'}`} />
              </div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClass('email')}
                placeholder="john@example.com"
              />
            </div>
            {touched.email && fieldErrors.email && (
              <p className="mt-1.5 ml-1 text-[11px] text-red-500 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${touched.password && fieldErrors.password ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClass('password')}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p className="mt-1.5 ml-1 text-[11px] text-red-500 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                </p>
              )}

              {/* Enhanced Strength Indicator */}
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm shadow-slate-100">
                <div className="flex justify-between items-end mb-2.5">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${strength.textColor}`}>
                      {strength.label}
                    </span>
                    <p className="text-[11px] text-slate-500 font-medium">{strength.message}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {passwordMetrics.score}/4
                  </span>
                </div>
                
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
                  <Requirement icon={passwordMetrics.checks.length} label="8+ characters" />
                  <Requirement icon={passwordMetrics.checks.hasUpper && passwordMetrics.checks.hasLower} label="Mixed case" />
                  <Requirement icon={passwordMetrics.checks.hasNumber} label="Number (0-9)" />
                  <Requirement icon={passwordMetrics.checks.hasSpecial} label="Special char" />
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${touched.confirmPassword && fieldErrors.confirmPassword ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClass('confirmPassword')}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                   {formData.confirmPassword && (
                     formData.password === formData.confirmPassword ? 
                     <Check className="h-5 w-5 text-emerald-500 animate-in zoom-in" /> : 
                     <X className="h-5 w-5 text-rose-500 animate-in zoom-in" />
                   )}
                </div>
              </div>
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <p className="mt-1.5 ml-1 text-[11px] text-red-500 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start pt-2">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500/20 border-slate-300 rounded cursor-pointer"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-slate-500 cursor-pointer select-none">
                I agree to the <a href="#" className="font-bold text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-indigo-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Free Account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

const Requirement = ({ icon, label }: { icon: boolean; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`p-0.5 rounded-full transition-all duration-300 ${icon ? 'bg-emerald-100 scale-110' : 'bg-slate-100'}`}>
      {icon ? 
        <Check className="w-3 h-3 text-emerald-600" /> : 
        <X className="w-3 h-3 text-slate-400" />
      }
    </div>
    <span className={`text-[11px] font-medium transition-colors ${icon ? 'text-slate-900' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

export default Signup;
