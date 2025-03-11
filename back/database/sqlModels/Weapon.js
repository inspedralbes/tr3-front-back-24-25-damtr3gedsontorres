const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Weapon = sequelize.define("Weapon", {
  name: { type: DataTypes.STRING, allowNull: false },
  damage: { type: DataTypes.INTEGER, allowNull: false },
  attackSpeed: { type: DataTypes.FLOAT, allowNull: false },
  rarity: { type: DataTypes.ENUM("common", "rare", "epic", "legendary"), allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Weapon;
