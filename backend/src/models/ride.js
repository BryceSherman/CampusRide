const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ride = sequelize.define('Ride', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    riderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'rider_id',
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'driver_id',
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'pickup_location',
    },
    dropoffLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'dropoff_location',
    },
    status: {
      type: DataTypes.ENUM('requested', 'accepted', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'requested',
    },
    fareAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'fare_amount',
    },
    distanceMiles: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'distance_miles',
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at',
    },
  }, {
    tableName: 'rides',
    timestamps: true,
    underscored: true,
  });

  return Ride;
};
