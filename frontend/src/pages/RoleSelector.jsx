import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleSelector() {
  const { user, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role) => {
    setLoading(true);
    setSelectedRole(role);

    try {
      // update role in context + localStorage
      setUserRole(role);

      // update role in database
      await fetch('http://localhost:5001/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          role
        })
      });

      if (role === 'rider') {
        navigate('/rider/dashboard', { replace: true });
      } else {
        navigate('/driver/dashboard', { replace: true });
      }

    } catch (err) {
      console.error('Error setting role:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">Welcome to CampusRide!</h1>
          <p className="text-blue-200 text-xl font-medium">Hi {user?.name}, let's get you set up</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Choose Your Role</h2>
          <p className="text-gray-600 text-center mb-10">
            Select how you'd like to use CampusRide
          </p>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Rider Card */}
            <button
              onClick={() => handleRoleSelect('rider')}
              disabled={loading}
              className={`p-8 rounded-lg border-2 transition-all ${
                selectedRole === 'rider'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Rider</h3>
              <p className="text-gray-600 mb-4">
                Request rides to get where you need to go quickly and affordably.
              </p>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li>✓ Request rides anytime</li>
                <li>✓ Track your driver in real-time</li>
                <li>✓ See your ride history</li>
              </ul>
              {selectedRole === 'rider' && !loading ? (
                <div className="text-blue-600 font-semibold">Selected ✓</div>
              ) : selectedRole === 'rider' && loading ? (
                <div className="text-blue-600 font-semibold">Setting up...</div>
              ) : (
                <div className="text-blue-600 font-semibold">Choose</div>
              )}
            </button>

            {/* Driver Card */}
            <button
              onClick={() => handleRoleSelect('driver')}
              disabled={loading}
              className={`p-8 rounded-lg border-2 transition-all ${
                selectedRole === 'driver'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Driver</h3>
              <p className="text-gray-600 mb-4">
                Earn money by offering rides to fellow campus members.
              </p>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li>✓ Accept ride requests</li>
                <li>✓ Manage your availability</li>
                <li>✓ Earn money per ride</li>
              </ul>
              {selectedRole === 'driver' && !loading ? (
                <div className="text-blue-600 font-semibold">Selected ✓</div>
              ) : selectedRole === 'driver' && loading ? (
                <div className="text-blue-600 font-semibold">Setting up...</div>
              ) : (
                <div className="text-blue-600 font-semibold">Choose</div>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-blue-900">💡 Tip:</span> You can change your role later in your profile settings at any time.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">CampusRide © 2024 | Full Stack Development</p>
        </div>
      </div>
    </div>
  );
}
