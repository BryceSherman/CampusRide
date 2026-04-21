import React, { createContext, useContext, useState, useCallback } from 'react';
import { rideService } from '../utils/api';

const RideContextInternal = createContext();

export const RideProvider = ({ children }) => {
  const [rides, setRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all rides for the current user
  const fetchRides = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await rideService.getRides(filters);
      setRides(data.rides || []);
      return data.rides || [];
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch rides';
      setError(errorMsg);
      console.error('Error fetching rides:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new ride request (rider action)
  const createRide = useCallback(async (rideData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideService.createRide(rideData);
      const newRide = response.ride;
      setRides((prev) => [newRide, ...prev]);
      setActiveRide(newRide);
      return newRide;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create ride';
      setError(errorMsg);
      console.error('Error creating ride:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a specific ride by ID
  const getRideById = useCallback(async (rideId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await rideService.getRideById(rideId);
      return data.ride;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch ride';
      setError(errorMsg);
      console.error('Error fetching ride:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel a ride (rider action)
  const cancelRide = useCallback(async (rideId, email) => {
    try {
      setLoading(true);
      setError(null);
      await rideService.cancelRide(rideId, email);

      setRides((prev) =>
        prev.map((ride) =>
          ride.id === rideId ? { ...ride, status: 'cancelled' } : ride
        )
      );

      if (activeRide?.id === rideId) {
        setActiveRide({ ...activeRide, status: 'cancelled' });
      }

      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to cancel ride';
      setError(errorMsg);
      console.error('Error cancelling ride:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [activeRide]);

  // Update ride status (driver action or system-triggered)
  const updateRideStatus = useCallback(async (rideId, status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await rideService.updateRideStatus(rideId, status);
      const updatedRide = response.ride;
      
      // Update local state
      setRides((prev) =>
        prev.map((ride) =>
          ride.id === rideId ? updatedRide : ride
        )
      );
      
      if (activeRide?.id === rideId) {
        setActiveRide(updatedRide);
      }
      
      return updatedRide;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update ride';
      setError(errorMsg);
      console.error('Error updating ride status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [activeRide]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    rides,
    activeRide,
    setActiveRide,
    loading,
    error,
    clearError,
    fetchRides,
    createRide,
    getRideById,
    cancelRide,
    updateRideStatus,
  };

  return (
    <RideContextInternal.Provider value={value}>
      {children}
    </RideContextInternal.Provider>
  );
};

export const useRides = () => {
  const context = useContext(RideContextInternal);
  if (!context) {
    throw new Error('useRides must be used within RideProvider');
  }
  return context;
};
