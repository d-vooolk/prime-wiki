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
  frames_specs: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  frames_issues: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emulators_specs: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emulators_issues: {
    type: DataTypes.TEXT,
    allowNull: true
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