const express = require('express');
const { Op } = require('sequelize');
const { Ride, User } = require('../models');

const router = express.Router();

// Helper: Calculate fare based on distance and duration
const calculateFare = (distanceMiles = 3, durationMinutes = 15) => {
  const BASE_RATE = 2.50;
  const RATE_PER_MILE = 1.50;
  const RATE_PER_MINUTE = 0.35;

  const fare = BASE_RATE + (distanceMiles * RATE_PER_MILE) + (durationMinutes * RATE_PER_MINUTE);
  return Math.round(fare * 100) / 100;
};

/**
 * POST /api/rides
 * Create a new ride request (Rider action)
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      email,
      name,
      role,
      pickupLocation,
      dropoffLocation,
      distanceMiles,
    } = req.body;

    if (!email || !pickupLocation || !dropoffLocation) {
      return res.status(400).json({
        error: 'email, pickupLocation, and dropoffLocation are required',
      });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        email,
        name: name || email,
        role: role || 'rider',
        passwordHash: 'ASGARDEO_SSO_USER',
      });
    } else if (role && user.role !== role) {
      user.role = role;
      await user.save();
    }

    if (user.role !== 'rider') {
      return res.status(403).json({ error: 'Only riders can create ride requests' });
    }

    const miles = parseFloat(distanceMiles) || 3.0;
    const estimatedFare = calculateFare(miles, 0);

    const ride = await Ride.create({
      riderId: user.id,
      pickupLocation,
      dropoffLocation,
      distanceMiles: miles,
      fareAmount: estimatedFare,
      status: 'requested',
    });

    const fullRide = await Ride.findByPk(ride.id, {
      include: [
        { model: User, as: 'rider', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'driver', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(201).json({
      message: 'Ride request created',
      ride: fullRide,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/rides
 * Get rides for the current user
 */
router.get('/', async (req, res, next) => {
  try {
    const { email, limit } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let whereClause = {};

    if (user.role === 'rider') {
      whereClause = { riderId: user.id };
    } else if (user.role === 'driver') {
      whereClause = {
        [Op.or]: [
          { driverId: user.id },
          { status: 'requested', driverId: null },
        ],
      };
    }

    const rides = await Ride.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'rider', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'driver', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: Number.parseInt(limit, 10) || 50,
    });

    res.json({
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/rides/available
 * Get available rides (Driver action)
 */
router.get('/available', async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can view available rides' });
    }

    const rides = await Ride.findAll({
      where: {
        status: 'requested',
        driverId: null,
      },
      include: [
        { model: User, as: 'rider', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/rides/:id
 * Get a specific ride by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const ride = await Ride.findByPk(req.params.id, {
      include: [
        { model: User, as: 'rider', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'driver', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const isRider = ride.riderId === user.id;
    const isDriver = ride.driverId === user.id;
    const isAvailableToDriver =
      user.role === 'driver' &&
      ride.status === 'requested' &&
      ride.driverId === null;

    if (!isRider && !isDriver && !isAvailableToDriver) {
      return res.status(403).json({ error: 'Not authorized to view this ride' });
    }

    res.json({ ride });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/rides/:id/accept
 * Driver accepts a ride
 */
router.patch('/:id/accept', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can accept rides' });
    }

    const ride = await Ride.findByPk(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.status !== 'requested') {
      return res.status(400).json({
        error: `Cannot accept ride with status: ${ride.status}`,
      });
    }

    if (ride.driverId && ride.driverId !== user.id) {
      return res.status(400).json({
        error: 'This ride has already been accepted by another driver',
      });
    }

    ride.driverId = user.id;
    ride.status = 'accepted';
    await ride.save();

    const fullRide = await Ride.findByPk(ride.id, {
      include: [
        { model: User, as: 'rider', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'driver', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({
      message: 'Ride accepted',
      ride: fullRide,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/rides/:id/complete
 * Driver completes a ride
 */
router.patch('/:id/complete', async (req, res, next) => {
  try {
    const { email, durationMinutes } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can complete rides' });
    }

    const ride = await Ride.findByPk(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.driverId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to complete this ride' });
    }

    if (!['accepted', 'in_progress'].includes(ride.status)) {
      return res.status(400).json({
        error: `Cannot complete ride with status: ${ride.status}`,
      });
    }

    const fareAmount = calculateFare(ride.distanceMiles, durationMinutes || 15);

    ride.status = 'completed';
    ride.fareAmount = fareAmount;
    ride.completedAt = new Date();
    await ride.save();

    const fullRide = await Ride.findByPk(ride.id, {
      include: [
        { model: User, as: 'rider', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'driver', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({
      message: 'Ride completed',
      ride: fullRide,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/rides/:id/cancel
 * Rider or Driver cancels a ride
 */
router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const ride = await Ride.findByPk(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isRider = ride.riderId === user.id;
    const isDriver = ride.driverId === user.id;

    if (!isRider && !isDriver) {
      return res.status(403).json({ error: 'Not authorized to cancel this ride' });
    }

    if (isRider && !['requested', 'accepted'].includes(ride.status)) {
      return res.status(400).json({
        error: `Cannot cancel ride with status: ${ride.status}`,
      });
    }

    if (isDriver && !['accepted', 'in_progress'].includes(ride.status)) {
      return res.status(400).json({
        error: `Cannot cancel ride with status: ${ride.status}`,
      });
    }

    ride.status = 'cancelled';
    await ride.save();

    const fullRide = await Ride.findByPk(ride.id, {
      include: [
        { model: User, as: 'rider', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'driver', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({
      message: 'Ride cancelled',
      ride: fullRide,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/rides/:id/in-progress
 * Driver marks ride as in progress
 */
router.patch('/:id/in-progress', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can update ride status' });
    }

    const ride = await Ride.findByPk(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.driverId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to update this ride' });
    }

    if (ride.status !== 'accepted') {
      return res.status(400).json({
        error: `Cannot mark ride as in progress with status: ${ride.status}`,
      });
    }

    ride.status = 'in_progress';
    await ride.save();

    const fullRide = await Ride.findByPk(ride.id, {
      include: [
        { model: User, as: 'rider', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'driver', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({
      message: 'Ride status updated to in progress',
      ride: fullRide,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;