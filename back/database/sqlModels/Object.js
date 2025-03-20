const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeConfig");
const User = require("./User");
const Shop = require("./Shop");

const Object = sequelize.define("Object", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  rarity: { type: DataTypes.STRING, allowNull: false },
});

const Inventory = sequelize.define("Inventory", {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
});

Inventory.belongsTo(User);
Inventory.belongsTo(Shop);
Inventory.belongsTo(Object); // Relación con Object

module.exports = { Inventory, Object };
