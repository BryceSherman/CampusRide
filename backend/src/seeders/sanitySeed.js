const bcrypt = require('bcryptjs');
const { User, Ride } = require('../models');

const seedSanityData = async () => {
  const existingUsers = await User.count();
  const existingRides = await Ride.count();

  if (existingUsers > 0 || existingRides > 0) {
    return {
      message: 'Seed skipped: data already exists',
      usersCreated: 0,
      ridesCreated: 0,
    };
  }

  const passwordHash = await bcrypt.hash('password123', 10);

  const rider = await User.create({
    name: 'Riley Rider',
    email: 'riley.rider@example.com',
    role: 'rider',
    phone: '512-555-0101',
    passwordHash,
  });

  const riderTwo = await User.create({
    name: 'Sam Student',
    email: 'sam.student@example.com',
    role: 'rider',
    phone: '512-555-0102',
    passwordHash,
  });

  const driver = await User.create({
    name: 'Drew Driver',
    email: 'drew.driver@example.com',
    role: 'driver',
    phone: '512-555-0201',
    passwordHash,
  });

  const rideOne = await Ride.create({
    riderId: rider.id,
    driverId: driver.id,
    pickupLocation: 'Student Union',
    dropoffLocation: 'North Campus Garage',
    status: 'completed',
    fareAmount: 12.5,
    distanceMiles: 3.2,
    completedAt: new Date(),
  });

  const rideTwo = await Ride.create({
    riderId: riderTwo.id,
    pickupLocation: 'Library',
    dropoffLocation: 'Engineering Building',
    status: 'requested',
  });

  return {
    message: 'Seed data created',
    usersCreated: 3,
    ridesCreated: 2,
    userIds: [rider.id, riderTwo.id, driver.id],
    rideIds: [rideOne.id, rideTwo.id],
  };
};

module.exports = seedSanityData;
