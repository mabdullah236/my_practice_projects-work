import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, X as XIcon, User, Briefcase, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../../api/client';
import { getPasswordStrength } from '../../utils/passwordStrength';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

// --- SCHEMA ---
const signupSchema = z.object({
  firstName: z.string().min(2, "First Name is required").regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),
  lastName: z.string().min(2, "Last Name is required").regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine((val) => isValidPhoneNumber(val), { message: "Invalid phone number" }),
  role: z.enum(["student", "translator", "business"], { errorMap: () => ({ message: "Please select an account type" }) }),
  password: z.string().min(7, "Min 7 chars"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, { message: "You must accept Terms" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // UI States
  const [serverError, setServerError] = useState('');
  const [isValidationAlertOpen, setIsValidationAlertOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Step & Data
  const [step, setStep] = useState('signup'); // 'signup' | 'verify'
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(4); // Default 4

  // Password Strength
  const [passwordStats, setPasswordStats] = useState({ score: 0, label: 'Weak', color: 'bg-gray-200' });
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { phone: "", terms: false }
  });

  const passwordValue = watch("password");
  const formData = watch(); // Watch all data for Resend Logic

  React.useEffect(() => { setPasswordStats(getPasswordStrength(passwordValue)); }, [passwordValue]);

  // --- HANDLER: SIGNUP ---
  const onSignupSubmit = async (data) => {
    setLoading(true); setServerError(''); setIsValidationAlertOpen(false);
    try {
      const res = await api.post('/auth/signup', {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password
      });
      
      if (res.data.remaining !== undefined) setAttemptsLeft(res.data.remaining);

      setRegisteredEmail(data.email);
      setStep('verify');
    } catch (error) {
      if (error.response?.data?.detail) setServerError(error.response.data.detail);
      else setServerError("Signup failed. Try again.");
      
      setIsValidationAlertOpen(true);
      setTimeout(() => setIsValidationAlertOpen(false), 3000);
    } finally { setLoading(false); }
  };

  // --- HANDLER: RESEND CODE ---
  const handleResend = async () => {
    // Re-submit the form data to generate a new OTP
    await onSignupSubmit(formData);
  };

  // --- HANDLER: VERIFY ---
  const onVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setServerError(''); setIsValidationAlertOpen(false);
    
    try {
      await api.post('/auth/verify', {
        email: registeredEmail,
        otp: otp
      });
      setShowSuccessModal(true);
    } catch (error) {
      // Specific Error Message
      if (error.response?.data?.detail) {
        setServerError(error.response.data.detail);
      } else {
        setServerError("The code could not be verified. Please check the code or request a new one.");
      }
      
      setIsValidationAlertOpen(true);
      setTimeout(() => setIsValidationAlertOpen(false), 3000);

    } finally { setLoading(false); }
  };

  const onError = () => {
    setIsValidationAlertOpen(true);
    setTimeout(() => setIsValidationAlertOpen(false), 5000);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 relative">
      
      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Account Verified!</h2>
            <p className="text-gray-500 mb-6">You can now login to your account.</p>
            <button onClick={() => navigate('/login')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Go to Login</button>
          </div>
        </div>
      )}

      {/* FLOATING ALERT (Top Right) */}
      {isValidationAlertOpen && (
        <div className="fixed top-4 right-4 z-[100] max-w-md w-full bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex justify-between items-start">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Action Failed</h3>
                {serverError && <p className="text-sm text-red-700 dark:text-red-400 mt-1">{serverError}</p>}
                <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-400 space-y-1">
                  {Object.keys(errors).map((key) => <li key={key}>{errors[key]?.message}</li>)}
                </ul>
              </div>
            </div>
            <button onClick={() => setIsValidationAlertOpen(false)} className="text-red-500 hover:text-red-700"><XIcon size={20} /></button>
          </div>
        </div>
      )}

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-6">Join TransLingo</h1>
          <p className="text-xl text-blue-100">Global communication starts here.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-md w-full py-8">
          
          {/* STEP 1: SIGNUP FORM */}
          {step === 'signup' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Get started with your free account</p>
              </div>

              <form onSubmit={handleSubmit(onSignupSubmit, onError)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input {...register('firstName')} placeholder="First Name" className={`block w-full pl-3 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
                  </div>
                  <div className="relative">
                    <input {...register('lastName')} placeholder="Last Name" className={`block w-full pl-3 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
                  </div>
                </div>

                <div className="relative">
                  <input {...register('email')} placeholder="Email Address" className={`block w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                  <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                <Controller name="phone" control={control} render={({ field }) => (
                  <PhoneInput international defaultCountry="PK" value={field.value} onChange={field.onChange} className={`phone-input-container block w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                )}/>

                <div className="relative">
                    <select {...register('role')} className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white ${errors.role ? 'border-red-500' : 'border-gray-300'}`}>
                      <option value="">Select Account Type</option>
                      <option value="student">Student</option>
                      <option value="translator">Translator</option>
                      <option value="business">Business</option>
                    </select>
                    <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                <div className="relative group"> 
                  <div className="relative">
                      <input {...register('password')} type="password" onFocus={() => setShowPasswordStrength(true)} onBlur={() => setShowPasswordStrength(false)} className={`block w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Password" />
                      <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                  {showPasswordStrength && (
                    <div className="mt-2 w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase">Strength</span>
                          <span className={`text-xs font-bold ${passwordStats.color.replace('bg-', 'text-')}`}>{passwordStats.label}</span>
                        </div>
                        <div className="flex gap-1 h-1.5 mb-3">
                          {[1, 2, 3, 4].map((level) => (<div key={level} className={`flex-1 rounded-full transition-all duration-300 ${passwordStats.score >= level ? passwordStats.color : 'bg-gray-200'}`}></div>))}
                        </div>
                        <p className="text-xs text-gray-500">Use 7+ chars with mixed letters & numbers.</p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input {...register('confirmPassword')} type="password" className={`block w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} placeholder="Confirm Password" />
                  <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                <div className="flex items-center gap-2">
                   <input type="checkbox" {...register('terms')} className="w-4 h-4" /> 
                   <span className="text-sm dark:text-gray-300">Agree to Terms & Conditions</span>
                </div>

                <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Sign Up & Verify"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">Sign in</Link>
              </p>
            </>
          )}

          {/* STEP 2: VERIFY OTP FORM (Updated UI) */}
          {step === 'verify' && (
            <div className="animate-in fade-in slide-in-from-right-8">
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold dark:text-white">Verify Email</h2>
                <p className="text-gray-500 mt-2">Enter the code sent to <b>{registeredEmail}</b></p>
                
                {/* ATTEMPTS REMAINING BADGE */}
                <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${attemptsLeft > 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        Attempts remaining : <b>{attemptsLeft}</b>
                    </span>
                </div>
              </div>

              <form onSubmit={onVerifySubmit} className="space-y-6">
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit Code" 
                  className="w-full text-center text-2xl tracking-widest p-4 border-2 border-blue-100 focus:border-blue-600 rounded-xl dark:bg-gray-800 dark:text-white outline-none transition"
                  maxLength={6}
                />
                
                <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify Code"}
                </button>
                
                {/* RESEND BUTTON */}
                <div className="flex justify-between items-center text-sm">
                    <button type="button" onClick={() => setStep('signup')} className="text-gray-500 hover:underline">
                        Change Email
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleResend} 
                        disabled={loading || attemptsLeft === 0}
                        className="text-blue-600 font-semibold hover:underline disabled:text-gray-400 disabled:no-underline"
                    >
                        {loading ? "Sending..." : "Resend Code"}
                    </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Signup;