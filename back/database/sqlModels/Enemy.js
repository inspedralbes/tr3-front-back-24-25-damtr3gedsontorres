const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeConfig");

const Enemy = sequelize.define("Enemy", {
  name: { type: DataTypes.STRING, allowNull: false },
  health: { type: DataTypes.INTEGER, allowNull: false },
  attack: { type: DataTypes.INTEGER, allowNull: false },
  speed: { type: DataTypes.FLOAT, allowNull: false },
  reward: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Enemy;
