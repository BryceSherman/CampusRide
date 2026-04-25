import React, { useState, useMemo } from 'react';
import { useRides } from '../context/RideContext';
import { useAuth } from '../context/AuthContext';

export default function RideForm() {
  const { user } = useAuth();
  const { createRide, loading, error, clearError } = useRides();

  const BASE_RATE = 2.5;
  const RATE_PER_MILE = 1.5;

  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    distanceMiles: '3',
  });

  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  const estimatedFare = useMemo(() => {
    const distance = parseFloat(formData.distanceMiles);
    if (isNaN(distance) || distance <= 0) return null;
    return (BASE_RATE + distance * RATE_PER_MILE).toFixed(2);
  }, [formData.distanceMiles]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(false);

    if (!formData.pickupLocation.trim() || !formData.dropoffLocation.trim()) {
      setSubmitError('Both pickup and dropoff locations are required');
      return;
    }

    if (formData.pickupLocation === formData.dropoffLocation) {
      setSubmitError('Pickup and dropoff locations cannot be the same');
      return;
    }

    const riderId = user?.id || user?.authId || user?.email;

    if (!riderId) {
      setSubmitError('User information not available. Please sign in again.');
      return;
    }

    try {
      await createRide({
        email: user.email,
        name: user.name,
        role: user.role,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        distanceMiles: formData.distanceMiles,
      });

      setFormData({
        pickupLocation: '',
        dropoffLocation: '',
        distanceMiles: '3',
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setSubmitError(
        err.response?.data?.error ||
        err.message ||
        'Failed to create ride request'
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Request a Ride
      </h2>

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-semibold">
            ✓ Ride request created successfully!
          </p>
          <p className="text-sm">
            A driver will accept your request shortly.
          </p>
        </div>
      )}

      {(submitError || error) && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-start">
          <p>{submitError || error}</p>
          <button
            onClick={() => {
              setSubmitError(null);
              clearError();
            }}
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            placeholder="Enter pickup location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dropoff Location <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleChange}
            placeholder="Enter dropoff location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Distance (miles)
            <span className="text-red-500">*</span>
          </label>

          <input
            type="number"
            name="distanceMiles"
            value={formData.distanceMiles}
            onChange={handleChange}
            min="0.1"
            step="0.1"
            placeholder="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />

          <p className="text-xs text-gray-500 mt-1">
            Fare will be calculated based on this distance
          </p>
        </div>

        {estimatedFare && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-800 font-semibold text-center">
            Estimated Fare: ${estimatedFare}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {loading ? 'Creating Ride...' : 'Request Ride'}
        </button>
      </form>
    </div>
  );
}