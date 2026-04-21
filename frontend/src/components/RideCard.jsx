import React, { useState } from 'react';
import { useRides } from '../context/RideContext';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  requested: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Waiting for Driver' },
  accepted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Driver Accepted' },
  in_progress: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'In Progress' },
  completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' },
};

export default function RideCard({ ride, isActive = false, onSelect = () => {} }) {
  const { cancelRide, loading } = useRides();
  const { user } = useAuth(); // ✅ FIX ADDED HERE

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const statusConfig = STATUS_COLORS[ride.status] || STATUS_COLORS.requested;

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await cancelRide(ride.id, user.email);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Error cancelling ride:', error);
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = ['requested', 'accepted'].includes(ride.status);

  return (
    <div
      onClick={onSelect}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isActive
          ? 'border-blue-600 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-800">Ride Request</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
          {statusConfig.label}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start">
          <span className="text-green-600 font-bold mr-3">📍</span>
          <div>
            <p className="text-xs text-gray-500 font-semibold">FROM</p>
            <p className="text-gray-700">{ride.pickupLocation}</p>
          </div>
        </div>

        <div className="flex items-start">
          <span className="text-red-600 font-bold mr-3">📍</span>
          <div>
            <p className="text-xs text-gray-500 font-semibold">TO</p>
            <p className="text-gray-700">{ride.dropoffLocation}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4 pb-4 border-t border-gray-200 pt-4">
        {ride.distanceMiles && (
          <div>
            <p className="text-xs text-gray-500 font-semibold">DISTANCE</p>
            <p className="text-gray-800 font-medium">{ride.distanceMiles} miles</p>
          </div>
        )}

        {ride.fareAmount && (
          <div>
            <p className="text-xs text-gray-500 font-semibold">FARE</p>
            <p className="text-gray-800 font-medium text-green-600 text-lg">
              ${parseFloat(ride.fareAmount).toFixed(2)}
            </p>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500 font-semibold">REQUESTED</p>
          <p className="text-gray-800 font-medium">
            {new Date(ride.createdAt).toLocaleDateString()} {new Date(ride.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {canCancel && (
        <div>
          {showCancelConfirm ? (
            <div className="bg-red-50 p-3 rounded border border-red-200 space-y-2">
              <p className="text-sm text-red-700 font-semibold">Cancel this ride?</p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel();
                  }}
                  disabled={cancelling || loading}
                  className="flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm'}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCancelConfirm(false);
                  }}
                  className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                >
                  Keep It
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCancelConfirm(true);
              }}
              disabled={loading}
              className="w-full px-3 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-500"
            >
              Cancel Ride
            </button>
          )}
        </div>
      )}

      {ride.status === 'completed' && (
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <p className="text-sm text-green-700 font-semibold">✓ Ride completed!</p>
          <p className="text-xs text-green-600 mt-1">
            Final fare: ${parseFloat(ride.fareAmount).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}