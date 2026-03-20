import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// --- PUBLIC PAGES (FIXED IMPORTS) ---
// Pehle yeh ghalat folder se aa rahe thay, ab 'Public' folder se link kiye hain
import Landing from './pages/Landing'; 
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import OurModels from './pages/OurModels'; // Check kar lein agar yeh Public me hai ya alag folder me
import Features from './pages/Public/Features';
import Pricing from './pages/Public/Pricing';
import About from './pages/Public/About';
import Contact from './pages/Public/Contact';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ForgotPassword from './pages/Auth/ForgotPassword';
import AdminResetPassword from './pages/Auth/AdminResetPassword';
import ResetPasswordViaLink from './pages/Auth/ResetPasswordViaLink';

// Dashboard Pages
import DashboardHome from './pages/Dashboard/DashboardHome';
import BillingPage from './pages/Dashboard/BillingPage';
import SettingsPage from './pages/Dashboard/SettingsPage';
import TranslationBox from './components/features/TranslationBox'; 
import HistoryPage from './pages/Dashboard/HistoryPage';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
            <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactUs /></MainLayout>} />
            
            {/* Agar OurModels Public folder me nahi hai to import path adjust karna parega */}
            <Route path="/models" element={<MainLayout><OurModels /></MainLayout>} />
            
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            {/* Note: /contact route do bar tha, ek ContactUs (Layout wala) aur ek Contact (Public wala). Ek rakhna behtar hai. */}
            
            {/* --- AUTH ROUTES --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/reset-password-verify" element={<AdminResetPassword />} />
            <Route path="/reset-password-verify" element={<ResetPasswordViaLink />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/signup" element={<Signup />} />
            
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* --- TRANSLATE ROUTE --- */}
            <Route element={<DashboardLayout />}>
                <Route path="/translate" element={
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">New Translation</h1>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <TranslationBox />
                        </div>
                    </div>
                } />
            </Route>

            {/* --- Dashboard Routes --- */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="history" element={<HistoryPage />} />
            </Route>
            
            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;