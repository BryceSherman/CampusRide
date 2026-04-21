import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log('LoginRedirect - loading:', loading);
    console.log('LoginRedirect - isAuthenticated:', isAuthenticated);
    console.log('LoginRedirect - user:', user);
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    if (loading) {
      console.log('Still loading, waiting...');
      return;
    }

    console.log('Auth check complete. isAuthenticated:', isAuthenticated, 'user:', user);

    if (!isAuthenticated) {
      // Not authenticated, stay on login page
      console.log('User not authenticated, showing login page');
      return;
    }

    if (isAuthenticated && user) {
      // If first login and role is not set (or is default), go to role selector
      console.log('User authenticated. isFirstLogin:', user.isFirstLogin, 'role:', user.role);
      
      if (user.isFirstLogin || !user.id) {
        console.log('First login detected, navigating to role selector');
        navigate('/select-role', { replace: true });
      } else if (user.role === 'rider') {
        console.log('Redirecting to rider dashboard');
        navigate('/rider/dashboard', { replace: true });
      } else if (user.role === 'driver') {
        console.log('Redirecting to driver dashboard');
        navigate('/driver/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">CampusRide</h1>
          <p className="text-gray-200 text-lg">Your campus ride-sharing solution</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Logging in...</p>
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In to Continue</h2>
              <p className="text-gray-700 mb-8">
                Use Asgardeo to securely sign in to your CampusRide account
              </p>
              {/* The sign in button would be in the parent layout/navbar */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-semibold mb-2">📝 First time here?</p>
                <p>Click the "Sign In" button at the top to create your account or log in</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Setting up your account...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-300 text-sm">
          <p>CampusRide © 2024 | Full Stack Development</p>
        </div>
      </div>
    </div>
  );
}
