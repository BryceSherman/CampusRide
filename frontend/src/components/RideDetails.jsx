import React from 'react';

const STATUS_STEPS = {
  requested: 1,
  accepted: 2,
  in_progress: 3,
  completed: 4,
  cancelled: 0,
};

export default function RideDetails({ ride }) {
  if (!ride) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <p>Select a ride to view details</p>
      </div>
    );
  }

  const currentStep = STATUS_STEPS[ride.status] || 0;

  const steps = [
    { number: 1, label: 'Requested', icon: '📋' },
    { number: 2, label: 'Driver Accepted', icon: '✓' },
    { number: 3, label: 'In Progress', icon: '🚗' },
    { number: 4, label: 'Completed', icon: '✓✓' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Ride Details
      </h2>

      {/* STATUS TIMELINE */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-600 mb-4">
          RIDE STATUS
        </p>

        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 ${
                    currentStep >= step.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step.icon}
                </div>

                <p className="text-xs font-medium text-gray-700 text-center">
                  {step.label}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-1 mb-6 ${
                    currentStep > step.number
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ROUTE */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Route</h3>

        <div className="space-y-4">
          <div className="flex items-start">
            <span className="text-2xl mr-3">📍</span>
            <div>
              <p className="text-xs text-gray-500 font-semibold">PICKUP</p>
              <p className="text-gray-800 font-medium">
                {ride.pickupLocation}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-2xl mr-3">🏁</span>
            <div>
              <p className="text-xs text-gray-500 font-semibold">DROPOFF</p>
              <p className="text-gray-800 font-medium">
                {ride.dropoffLocation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TRIP INFO */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">
          Trip Information
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {ride.distanceMiles && (
            <div>
              <p className="text-xs text-gray-500 font-semibold">
                DISTANCE
              </p>
              <p className="text-lg font-bold text-gray-800">
                {ride.distanceMiles} mi
              </p>
            </div>
          )}

          {ride.fareAmount && (
            <div>
              <p className="text-xs text-gray-500 font-semibold">
                FARE
              </p>
              <p className="text-lg font-bold text-green-600">
                ${parseFloat(ride.fareAmount).toFixed(2)}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 font-semibold">
              REQUESTED AT
            </p>
            <p className="text-gray-800">
              {new Date(ride.createdAt).toLocaleTimeString()}
            </p>
          </div>

          {ride.completedAt && (
            <div>
              <p className="text-xs text-gray-500 font-semibold">
                COMPLETED AT
              </p>
              <p className="text-gray-800">
                {new Date(ride.completedAt).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DRIVER INFO */}
      {ride.status !== 'requested' && ride.status !== 'cancelled' && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Driver</h3>

          <div className="bg-gray-50 p-4 rounded-lg">
            {ride.driver ? (
              <>
                <p className="text-gray-800 font-medium">
                  {ride.driver.name}
                </p>
                <p className="text-sm text-gray-600">
                  📧 {ride.driver.email}
                </p>
              </>
            ) : (
              <p className="text-gray-500">
                Driver information not available yet
              </p>
            )}
          </div>
        </div>
      )}

      {/* COMPLETION BANNER */}
      {ride.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-center">
          <p className="text-green-800 font-bold text-lg">
            🎉 Thank you for riding with CampusRide!
          </p>

          <p className="text-green-700 mt-2">
            You were charged{' '}
            <span className="font-bold">
              ${parseFloat(ride.fareAmount).toFixed(2)}
            </span>
          </p>
        </div>
      )}

      {/* OTHER STATUS MESSAGES */}
      {ride.status === 'requested' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          ⏳ Waiting for a driver to accept your ride...
        </div>
      )}

      {ride.status === 'accepted' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          ✓ A driver has accepted your ride! They'll be on the way soon.
        </div>
      )}

      {ride.status === 'in_progress' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          🚗 Your driver is currently taking you to your destination.
        </div>
      )}

      {ride.status === 'cancelled' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          Ride was cancelled
        </div>
      )}
    </div>
  );
}