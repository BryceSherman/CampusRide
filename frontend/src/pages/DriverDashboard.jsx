import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRides } from '../context/RideContext';
import { rideService } from '../utils/api';

export default function DriverDashboard() {
  const { user } = useAuth();

  const {
    rides,
    fetchRides,
    fetchAvailableRides,
  } = useRides();

  const [availableRides, setAvailableRides] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [processingRideId, setProcessingRideId] = useState(null);

  const formatFare = (fareAmount) => {
    return fareAmount ? `$${Number(fareAmount).toFixed(2)}` : 'N/A';
  };

  const loadDriverData = useCallback(async () => {
    if (!user?.email) return;

    try {
      await fetchRides({ email: user.email, limit: 50 });

      const available = await fetchAvailableRides({ email: user.email });

      setAvailableRides(
        available.filter((ride) => ride.status === 'requested')
      );
    } catch (error) {
      console.error('Error loading driver dashboard:', error);
    }
  }, [user?.email, fetchRides, fetchAvailableRides]);

  useEffect(() => {
    loadDriverData();
  }, [loadDriverData]);

  const handleAcceptRide = async (rideId) => {
    try {
      setProcessingRideId(rideId);

      await rideService.acceptRide(rideId, user.email);
      await loadDriverData();

      setActiveTab('assigned');
    } catch (error) {
      console.error('Error accepting ride:', error.response?.data || error);
    } finally {
      setProcessingRideId(null);
    }
  };

  const handleStartRide = async (rideId) => {
    try {
      setProcessingRideId(rideId);

      await rideService.markInProgress(rideId, user.email);
      await loadDriverData();
    } catch (error) {
      console.error('Error starting ride:', error.response?.data || error);
    } finally {
      setProcessingRideId(null);
    }
  };

  const handleCompleteRide = async (rideId) => {
    try {
      setProcessingRideId(rideId);

      await rideService.completeRide(rideId, user.email);
      await loadDriverData();

      setActiveTab('history');
    } catch (error) {
      console.error('Error completing ride:', error.response?.data || error);
    } finally {
      setProcessingRideId(null);
    }
  };

  const assignedRides = rides.filter(
    (ride) =>
      ride.driver?.email === user?.email &&
      ['accepted', 'in_progress'].includes(ride.status)
  );

  const completedRides = rides.filter(
    (ride) =>
      ride.driver?.email === user?.email &&
      ride.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">🚗 Driver Dashboard</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'available'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600'
              }`}
            >
              Available Rides ({availableRides.length})
            </button>

            <button
              onClick={() => setActiveTab('assigned')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'assigned'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600'
              }`}
            >
              Assigned Rides ({assignedRides.length})
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600'
              }`}
            >
              History ({completedRides.length})
            </button>
          </div>

          <div className="p-6 space-y-4">
            {activeTab === 'available' && availableRides.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No available rides right now.
              </p>
            )}

            {activeTab === 'available' &&
              availableRides.map((ride) => (
                <div
                  key={ride.id}
                  className="p-5 border rounded-lg bg-white shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Ride Request
                      </h3>
                      <p className="text-sm text-gray-500">
                        Requested {new Date(ride.createdAt).toLocaleDateString()}{' '}
                        {new Date(ride.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Waiting for Driver
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p>
                      <strong>FROM:</strong> {ride.pickupLocation}
                    </p>
                    <p>
                      <strong>TO:</strong> {ride.dropoffLocation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-gray-500 font-semibold">DISTANCE</p>
                      <p className="text-gray-900">
                        {ride.distanceMiles || 'N/A'} miles
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-gray-500 font-semibold">FARE</p>
                      <p className="text-green-600 font-bold">
                        {formatFare(ride.fareAmount)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-gray-500 font-semibold">RIDER EMAIL</p>
                      <p className="text-gray-900 break-all">
                        {ride.rider?.email || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-gray-500 font-semibold">RIDER ID</p>
                      <p className="text-gray-900 break-all">
                        {ride.rider?.id || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAcceptRide(ride.id)}
                    disabled={processingRideId === ride.id}
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {processingRideId === ride.id ? 'Accepting...' : 'Accept Ride'}
                  </button>
                </div>
              ))}

            {activeTab === 'assigned' && assignedRides.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No assigned rides yet.
              </p>
            )}

            {activeTab === 'assigned' &&
              assignedRides.map((ride) => (
                <div
                  key={ride.id}
                  className="p-5 border rounded-lg bg-white shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Assigned Ride
                      </h3>
                      <p className="text-sm text-gray-500">
                        Accepted{' '}
                        {new Date(ride.updatedAt || ride.createdAt).toLocaleDateString()}{' '}
                        {new Date(ride.updatedAt || ride.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ride.status === 'accepted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {ride.status === 'accepted' ? 'Accepted' : 'In Progress'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p>
                      <strong>FROM:</strong> {ride.pickupLocation}
                    </p>
                    <p>
                      <strong>TO:</strong> {ride.dropoffLocation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-gray-500 font-semibold">DISTANCE</p>
                      <p className="text-gray-900">
                        {ride.distanceMiles || 'N/A'} miles
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-gray-500 font-semibold">FARE</p>
                      <p className="text-green-600 font-bold">
                        {formatFare(ride.fareAmount)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-gray-500 font-semibold">RIDER EMAIL</p>
                      <p className="text-gray-900 break-all">
                        {ride.rider?.email || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-gray-500 font-semibold">RIDER ID</p>
                      <p className="text-gray-900 break-all">
                        {ride.rider?.id || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {ride.status === 'accepted' && (
                    <button
                      onClick={() => handleStartRide(ride.id)}
                      disabled={processingRideId === ride.id}
                      className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 disabled:bg-gray-400"
                    >
                      {processingRideId === ride.id ? 'Starting...' : 'Start Ride'}
                    </button>
                  )}

                  {ride.status === 'in_progress' && (
                    <button
                      onClick={() => handleCompleteRide(ride.id)}
                      disabled={processingRideId === ride.id}
                      className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {processingRideId === ride.id ? 'Ending...' : 'End Ride'}
                    </button>
                  )}
                </div>
              ))}

            {activeTab === 'history' && completedRides.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No completed rides yet.
              </p>
            )}

            {activeTab === 'history' &&
              completedRides.map((ride) => (
                <div
                  key={ride.id}
                  className="p-5 border rounded-lg bg-green-50 border-green-200 space-y-2"
                >
                  <h3 className="font-semibold text-green-800">
                    Ride Completed
                  </h3>
                  <p>
                    {ride.pickupLocation} → {ride.dropoffLocation}
                  </p>
                  <p className="text-green-700 font-semibold">
                    You received {formatFare(ride.fareAmount)} from the rider.
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}