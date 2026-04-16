const sequelize = require('../config/database');
const createUser = require('./user');
const createRide = require('./ride');

const User = createUser(sequelize);
const Ride = createRide(sequelize);

User.hasMany(Ride, {
  foreignKey: 'riderId',
  as: 'requestedRides',
});

User.hasMany(Ride, {
  foreignKey: 'driverId',
  as: 'drivenRides',
});

Ride.belongsTo(User, {
  foreignKey: 'riderId',
  as: 'rider',
});

Ride.belongsTo(User, {
  foreignKey: 'driverId',
  as: 'driver',
});

module.exports = {
  sequelize,
  User,
  Ride,
};
