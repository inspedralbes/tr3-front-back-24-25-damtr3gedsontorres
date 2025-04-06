const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeConfig");

const Object = sequelize.define("Object", {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  effect: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  duration: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  value: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  type: { 
    type: DataTypes.ENUM('object', 'PowerUp'), 
    allowNull: false 
  }
});

module.exports = Object;
