const express = require('express');
const { User } = require('../models');

const router = express.Router();

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PUT /api/users/me
 * Update or create current user profile
 */
router.put('/me', async (req, res, next) => {
  try {
    const { email, name, phone, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        email,
        name: name || email,
        role: role && ['rider', 'driver'].includes(role) ? role : 'rider',
        phone: phone || null,
        passwordHash: 'ASGARDEO_SSO_USER',
      });
    } else {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (role && ['rider', 'driver'].includes(role)) {
        user.role = role;
      }

      await user.save();
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/availability
 * Toggle driver availability
 */
router.put('/availability', async (req, res, next) => {
  try {
    const { email, isAvailable } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ error: 'isAvailable must be a boolean' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can update availability' });
    }

    user.isAvailable = isAvailable;
    await user.save();

    res.json({
      message: 'Availability updated',
      isAvailable: user.isAvailable,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;