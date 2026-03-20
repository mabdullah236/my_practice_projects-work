import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowRight, Loader2, Lock, Smartphone, ShieldCheck, ArrowLeft, AlertTriangle, AlertCircle, X as XIcon, CheckCircle } from 'lucide-react';
import api from '../../api/client';
import { getPasswordStrength } from '../../utils/passwordStrength';

// --- SCHEMAS ---
const emailSchema = z.object({ email: z.string().email("Invalid email address") });
const otpSchema = z.object({ otp: z.string().min(6, "Enter 6-digit code") });

const passwordSchema = z.object({
    password: z.string().min(7, "Password must be at least 7 characters"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match", 
    path: ["confirmPassword"] 
});

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // UI States
    const [serverError, setServerError] = useState('');
    const [linkSentSuccess, setLinkSentSuccess] = useState(''); // NEW: For Link Sent Message
    const [isValidationAlertOpen, setIsValidationAlertOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const [passwordStats, setPasswordStats] = useState({ score: 0, label: 'Weak', color: 'bg-gray-200' });
    const [showPasswordStrength, setShowPasswordStrength] = useState(false);
    
    // Data Storage
    const [email, setEmail] = useState('');
    const [maskedPhone, setMaskedPhone] = useState('');
    const [hasPhone, setHasPhone] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [attemptsLeft, setAttemptsLeft] = useState(4); // Default 4

    // Forms
    const emailForm = useForm({ resolver: zodResolver(emailSchema) });
    const otpForm = useForm({ resolver: zodResolver(otpSchema) });
    const passForm = useForm({ resolver: zodResolver(passwordSchema) });

    // --- UTILS ---
    const onError = () => {
        setIsValidationAlertOpen(true);
        setTimeout(() => setIsValidationAlertOpen(false), 5000);
    };

    // --- HANDLERS ---
    
    // STEP 1: Find Account
    const handleFindAccount = async (data) => {
        setLoading(true); setServerError(''); setIsValidationAlertOpen(false);
        try {
            const res = await api.post('/auth/forgot-password/find', data);
            setEmail(data.email);
            setMaskedPhone(res.data.masked_phone);
            setHasPhone(res.data.has_phone);
            setStep(2);
        } catch (err) {
            setServerError("Something went wrong. Please try again.");
            setIsValidationAlertOpen(true);
            setTimeout(() => setIsValidationAlertOpen(false), 3000);
        } finally { setLoading(false); }
    };

    // STEP 2a: Send OTP
    const handleSendOTP = async (method) => {
        setLoading(true); setServerError(''); setIsValidationAlertOpen(false); setLinkSentSuccess('');
        try {
            const res = await api.post('/auth/forgot-password/send-otp', { email, method });
            
            // Limit Update
            if (res.data.remaining !== undefined) setAttemptsLeft(res.data.remaining);
            
            setStep(3);
        } catch (err) {
            // Check Rate Limit (429)
            if (err.response?.status === 429) {
                setServerError(err.response.data.detail);
                setAttemptsLeft(0);
            } else {
                setServerError("Failed to send code. Try again.");
            }
            setIsValidationAlertOpen(true);
            setTimeout(() => setIsValidationAlertOpen(false), 3000);
        } finally { setLoading(false); }
    };

    // STEP 2b: Send Reset Link (NEW FUNCTION)
    const handleSendLink = async () => {
        setLoading(true); setServerError(''); setIsValidationAlertOpen(false); setLinkSentSuccess('');
        try {
            await api.post('/auth/forgot-password/send-link', { email });
            setLinkSentSuccess(`Reset link sent to ${email}. Check your inbox (and spam).`);
            // Success message show kro aur 5 sec baad hata do
            setTimeout(() => setLinkSentSuccess(''), 5000);
        } catch (err) {
            setServerError("Failed to send reset link. Please try again.");
            setIsValidationAlertOpen(true);
            setTimeout(() => setIsValidationAlertOpen(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    // STEP 3: Verify OTP
    const handleVerifyOTP = async (data) => {
        setLoading(true); setServerError(''); setIsValidationAlertOpen(false);
        try {
            const res = await api.post('/auth/forgot-password/verify', { email, otp: data.otp });
            setResetToken(res.data.reset_token);
            setStep(4);
        } catch (err) {
            // SPECIFIC OTP ERROR
            if (err.response?.data?.detail) {
                setServerError(err.response.data.detail);
            } else {
                setServerError("The code could not be verified. Please check the code or request a new one.");
            }
            setIsValidationAlertOpen(true);
            setTimeout(() => setIsValidationAlertOpen(false), 3000);
        } finally { setLoading(false); }
    };

    // STEP 4: Reset Password
    const handleResetPassword = async (data) => {
        setLoading(true); setServerError(''); setIsValidationAlertOpen(false);
        try {
            await api.post('/auth/forgot-password/reset', {
                email,
                reset_token: resetToken,
                new_password: data.password
            });
            setShowSuccessModal(true);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.detail) {
                setServerError(err.response.data.detail);
            } else {
                setServerError("Session expired or invalid. Please start over.");
            }
            setIsValidationAlertOpen(true);
            setTimeout(() => setIsValidationAlertOpen(false), 3000);
        } finally { setLoading(false); }
    };

    // Watch Password for Strength
    const passwordValue = passForm.watch("password");
    React.useEffect(() => { 
        if(passwordValue) setPasswordStats(getPasswordStrength(passwordValue)); 
    }, [passwordValue]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 relative">
            
            {/* SUCCESS MODAL */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Your password has been successfully updated. You can now log in.
                    </p>
                    <button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30"
                    >
                    Back to Login
                    </button>
                </div>
                </div>
            )}

            {/* FLOATING ERROR ALERT */}
            {isValidationAlertOpen && (
                <div className="fixed top-4 right-4 z-[100] max-w-md w-full bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-xl animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-start">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Action Failed</h3>
                                {serverError && <p className="text-sm text-red-700 dark:text-red-400 mt-1">{serverError}</p>}
                                <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-400 space-y-1">
                                    {step === 1 && Object.values(emailForm.formState.errors).map((e, i) => <li key={i}>{e.message}</li>)}
                                    {step === 3 && Object.values(otpForm.formState.errors).map((e, i) => <li key={i}>{e.message}</li>)}
                                    {step === 4 && Object.values(passForm.formState.errors).map((e, i) => <li key={i}>{e.message}</li>)}
                                </ul>
                            </div>
                        </div>
                        <button onClick={() => setIsValidationAlertOpen(false)} className="text-red-500 hover:text-red-700"><XIcon size={20} /></button>
                    </div>
                </div>
            )}

            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                
                {/* Header (For Steps 1, 2, 4) */}
                {step !== 3 && (
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {step === 4 ? "Set New Password" : "Reset Password"}
                        </h2>
                        
                        {step === 2 && (
                            <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    Is this email correct? <br/>
                                    <span className="font-bold text-lg block mt-1">{email}</span>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- STEP 1: FIND ACCOUNT --- */}
                {step === 1 && (
                    <form onSubmit={emailForm.handleSubmit(handleFindAccount, onError)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <div className="relative">
                                <input {...emailForm.register('email')} className={`block w-full pl-10 pr-3 py-3 border rounded-xl dark:bg-gray-700 dark:text-white ${emailForm.formState.errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`} placeholder="you@example.com" />
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center">
                            {loading ? <Loader2 className="animate-spin" /> : "Find Account"}
                        </button>
                    </form>
                )}

                {/* --- STEP 2: SELECT METHOD --- */}
                {step === 2 && (
                    <div className="space-y-4">
                        {/* LINK SENT SUCCESS MESSAGE */}
                        {linkSentSuccess && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500 shrink-0" />
                                <p className="text-sm text-green-800 dark:text-green-300">{linkSentSuccess}</p>
                            </div>
                        )}

                        <div className="flex items-start gap-3 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            <p>If the email is incorrect, you won't receive a code.</p>
                        </div>

                        <button onClick={() => handleSendOTP('email')} className="w-full flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition group">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4"><Mail size={20} /></div>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-900 dark:text-white">Send code via Email</h3>
                                <p className="text-xs text-gray-500">{email}</p>
                            </div>
                            <ArrowRight className="ml-auto text-gray-400 group-hover:text-blue-500" size={18} />
                        </button>

                        {hasPhone && (
                            <button onClick={() => handleSendOTP('phone')} className="w-full flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition group">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4"><Smartphone size={20} /></div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Send code via SMS</h3>
                                    <p className="text-xs text-gray-500">{maskedPhone}</p>
                                </div>
                                <ArrowRight className="ml-auto text-gray-400 group-hover:text-blue-500" size={18} />
                            </button>
                        )}

                        {/* --- NEW SECTION: SEND LINK VIA EMAIL --- */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                            <p className="text-sm text-gray-500 mb-2">Having trouble receiving the code?</p>
                            <button 
                                type="button"
                                onClick={handleSendLink}
                                disabled={loading}
                                className="text-blue-600 font-semibold hover:underline text-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                            >
                                {loading ? <Loader2 size={14} className="animate-spin" /> : "Send Reset Link via Email instead"}
                            </button>
                        </div>

                        <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:underline w-full text-center mt-2">Edit Email Address</button>
                    </div>
                )}

                {/* --- STEP 3: VERIFY OTP --- */}
                {step === 3 && (
                    <form onSubmit={otpForm.handleSubmit(handleVerifyOTP, onError)} className="space-y-6">
                        {/* Header with Attempts */}
                        <div className="text-center mb-6">
                             <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <ShieldCheck className="w-8 h-8 text-blue-600" />
                             </div>
                             <h2 className="text-2xl font-bold dark:text-white">Verify Email</h2>
                             <p className="text-gray-500 mt-2">Enter code sent to <b>{email}</b></p>
                             <div className="mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full border ${attemptsLeft > 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    Attempts remaining: <b>{attemptsLeft}</b>
                                </span>
                             </div>
                        </div>

                        <input {...otpForm.register('otp')} type="text" placeholder="000000" className="w-full text-center text-3xl tracking-[10px] py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none dark:bg-gray-700 dark:text-white" maxLength={6} />
                        
                        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center">
                            {loading ? <Loader2 className="animate-spin" /> : "Verify Code"}
                        </button>
                        
                        {/* RESEND LOGIC */}
                        <div className="flex justify-between items-center text-sm px-2">
                             <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:underline">Fix Email</button>
                             
                             <button 
                                type="button" 
                                onClick={() => handleSendOTP(hasPhone ? 'phone' : 'email')} 
                                disabled={loading || attemptsLeft === 0}
                                className="text-blue-600 font-semibold hover:underline disabled:text-gray-400 disabled:no-underline"
                            >
                                Resend Code
                            </button>
                        </div>
                    </form>
                )}

                {/* --- STEP 4: RESET PASSWORD --- */}
                {step === 4 && (
                    <form onSubmit={passForm.handleSubmit(handleResetPassword, onError)} className="space-y-4">
                        
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                            <div className="relative">
                                <input 
                                    {...passForm.register('password')} 
                                    type="password" 
                                    onFocus={() => setShowPasswordStrength(true)}
                                    onBlur={() => setShowPasswordStrength(false)}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl dark:bg-gray-700 dark:text-white ${passForm.formState.errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} 
                                    placeholder="••••••••" 
                                />
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>

                            {/* Strength Meter */}
                            {showPasswordStrength && (
                                <div className="mt-2 w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Strength</span>
                                        <span className={`text-xs font-bold ${passwordStats.color.replace('bg-', 'text-')}`}>{passwordStats.label}</span>
                                    </div>
                                    <div className="flex gap-1 h-1.5 mb-3">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div key={level} className={`flex-1 rounded-full transition-all duration-300 ${passwordStats.score >= level ? passwordStats.color : 'bg-gray-200 dark:bg-gray-600'}`}></div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Use 7+ chars with mixed letters, numbers & symbols.</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    {...passForm.register('confirmPassword')} 
                                    type="password" 
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl dark:bg-gray-700 dark:text-white ${passForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} 
                                    placeholder="••••••••" 
                                />
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center">
                            {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                        </button>
                    </form>
                )}

                {step === 1 && (
                    <div className="mt-6 text-center">
                        <Link to="/login" className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400">
                            <ArrowLeft size={16} className="mr-2" /> Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;