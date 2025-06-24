const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Car = sequelize.define('Car', {
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  generation: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  frames: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emulators: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  photos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  videos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['brand', 'model', 'generation']
    }
  ]
});

module.exports = Car; 