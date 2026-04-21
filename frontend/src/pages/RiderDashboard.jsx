import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRides } from '../context/RideContext';
import RideForm from '../components/RideForm';
import RideCard from '../components/RideCard';
import RideDetails from '../components/RideDetails';

export default function RiderDashboard() {
  const { user } = useAuth();
  const { rides, activeRide, setActiveRide, fetchRides, loading } = useRides();
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

  useEffect(() => {
    // Load rides on component mount
    fetchRides({ limit: 50 });
  }, []);

  // Separate active and completed rides
  const activeRides = rides.filter(
    (ride) => !['completed', 'cancelled'].includes(ride.status)
  );
  const rideHistory = rides.filter(
    (ride) => ['completed', 'cancelled'].includes(ride.status)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">🎯 Rider Dashboard</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Request Form and Rides */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ride Request Form */}
            <RideForm />

            {/* Rides Tabs and List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === 'active'
                      ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Active Rides ({activeRides.length})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === 'history'
                      ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  History ({rideHistory.length})
                </button>
              </div>

              <div className="p-6">
                {loading && <p className="text-gray-500 text-center py-8">Loading rides...</p>}

                {!loading && activeTab === 'active' && activeRides.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No active rides. Create one above!</p>
                )}

                {!loading && activeTab === 'history' && rideHistory.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No ride history yet</p>
                )}

                <div className="space-y-3">
                  {!loading && activeTab === 'active' && activeRides.map((ride) => (
                    <RideCard
                      key={ride.id}
                      ride={ride}
                      isActive={activeRide?.id === ride.id}
                      onSelect={() => setActiveRide(ride)}
                    />
                  ))}

                  {!loading && activeTab === 'history' && rideHistory.map((ride) => (
                    <RideCard
                      key={ride.id}
                      ride={ride}
                      isActive={activeRide?.id === ride.id}
                      onSelect={() => setActiveRide(ride)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Ride Details */}
          <div className="lg:col-span-1">
            <RideDetails ride={activeRide} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">TOTAL RIDES</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{rides.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">ACTIVE RIDES</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{activeRides.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">COMPLETED RIDES</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {rideHistory.filter((r) => r.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
