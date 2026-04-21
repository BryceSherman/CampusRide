import React, { useState } from 'react';
import { useAsgardeo } from '@asgardeo/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { signIn } = useAsgardeo();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = () => {
    logout(); // handles both local state and Asgardeo sign out
    navigate('/');
    setShowMenu(false);
  };

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div onClick={() => navigate('/')} className="flex items-center cursor-pointer">
          <h1 className="text-2xl font-bold text-white">🚗 CampusRide</h1>
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <button
              onClick={handleSignIn}
              className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign In
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <span>👤</span>
                <span className="font-medium">{user?.name || 'User'}</span>
                <span className="text-sm">▼</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                    <p className="text-xs text-gray-600 capitalize mt-1">
                      Role: <span className="font-semibold">{user?.role}</span>
                    </p>
                  </div>

                  <div className="py-2">
                    {user?.role === 'rider' && (
                      <button
                        onClick={() => { navigate('/rider/dashboard'); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📍 Rider Dashboard
                      </button>
                    )}
                    {user?.role === 'driver' && (
                      <button
                        onClick={() => { navigate('/driver/dashboard'); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🚗 Driver Dashboard
                      </button>
                    )}
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}