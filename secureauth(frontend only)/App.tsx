
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all - Redirect to Login or Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="py-6 border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} SecureAuth Inc. Built with React & JWT Simulation.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
