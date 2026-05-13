import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy loading pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MoodTracker = lazy(() => import('./pages/MoodTracker'));
const Journal = lazy(() => import('./pages/Journal'));
const AICompanion = lazy(() => import('./pages/AICompanion'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <AuthProvider>
      <Router>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f2a4a',
              color: '#f0f6ff',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              backdropFilter: 'blur(12px)',
              padding: '14px 16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
              fontSize: '14px',
            },

            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },

            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>

            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mood"
              element={
                <ProtectedRoute>
                  <MoodTracker />
                </ProtectedRoute>
              }
            />

            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ai"
              element={
                <ProtectedRoute>
                  <AICompanion />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </Suspense>

      </Router>
    </AuthProvider>
  );
}

export default App;