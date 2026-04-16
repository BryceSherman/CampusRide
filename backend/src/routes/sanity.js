const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Ride } = require('../models');
const seedSanityData = require('../seeders/sanitySeed');

const router = express.Router();

router.get('/users', async (req, res, next) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 25;
    const users = await User.findAll({
      limit,
      order: [['createdAt', 'DESC']],
    });
    res.json({ count: users.length, users });
  } catch (error) {
    next(error);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      passwordHash,
      role,
      phone,
      authId,
    } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        error: 'name, email, and role are required',
      });
    }

    const hash = password ? await bcrypt.hash(password, 10) : passwordHash;
    if (!hash) {
      return res.status(400).json({
        error: 'password or passwordHash is required',
      });
    }

    const user = await User.create({
      name,
      email,
      role,
      phone,
      authId,
      passwordHash: hash,
    });

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

router.get('/rides', async (req, res, next) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 25;
    const rides = await Ride.findAll({
      limit,
      order: [['createdAt', 'DESC']],
    });
    res.json({ count: rides.length, rides });
  } catch (error) {
    next(error);
  }
});

router.post('/rides', async (req, res, next) => {
  try {
    const {
      riderId,
      driverId,
      pickupLocation,
      dropoffLocation,
      status,
      fareAmount,
      distanceMiles,
      completedAt,
    } = req.body;

    if (!riderId || !pickupLocation || !dropoffLocation) {
      return res.status(400).json({
        error: 'riderId, pickupLocation, and dropoffLocation are required',
      });
    }

    const ride = await Ride.create({
      riderId,
      driverId,
      pickupLocation,
      dropoffLocation,
      status,
      fareAmount,
      distanceMiles,
      completedAt,
    });

    res.status(201).json({ ride });
  } catch (error) {
    next(error);
  }
});

router.post('/seed', async (req, res, next) => {
  try {
    const result = await seedSanityData();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
