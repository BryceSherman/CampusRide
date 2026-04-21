import React, { useState } from 'react';
import { useRides } from '../context/RideContext';
import { useAuth } from '../context/AuthContext';

export default function RideForm() {
  const { user } = useAuth();
  const { createRide, loading, error, clearError } = useRides();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    distanceMiles: '3',
  });
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

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

    // Validation
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

      setFormData({ pickupLocation: '', dropoffLocation: '', distanceMiles: '3' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err.response?.data?.error || err.message || 'Failed to create ride request');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Request a Ride</h2>

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-semibold">✓ Ride request created successfully!</p>
          <p className="text-sm">A driver will accept your request shortly.</p>
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
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pickupLocation"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            placeholder="Enter pickup location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Dropoff Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="dropoffLocation"
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleChange}
            placeholder="Enter dropoff location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="distanceMiles" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Distance (miles) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="distanceMiles"
            name="distanceMiles"
            value={formData.distanceMiles}
            onChange={handleChange}
            placeholder="3"
            min="0.1"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Fare will be calculated based on this distance</p>
        </div>

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
