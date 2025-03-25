const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeConfig");

const Player = sequelize.define("Player", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  level: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 
  },
  experience: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  health: { 
    type: DataTypes.INTEGER, 
    defaultValue: 100 
  },
  maxHealth: { 
    type: DataTypes.INTEGER, 
    defaultValue: 100 
  },
  attack: { 
    type: DataTypes.INTEGER, 
    defaultValue: 10 
  },
  defense: { 
    type: DataTypes.INTEGER, 
    defaultValue: 5 
  },
  speed: { 
    type: DataTypes.INTEGER, 
    defaultValue: 5 
  },
  currentWave: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 
  },
  highestWave: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 
  }
});

module.exports = Player;
