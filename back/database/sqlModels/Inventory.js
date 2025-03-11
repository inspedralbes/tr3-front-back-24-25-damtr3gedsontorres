const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Shop = require("./Shop");

const Inventory = sequelize.define("Inventory", {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
});

Inventory.belongsTo(User);
Inventory.belongsTo(Shop);

module.exports = Inventory;
