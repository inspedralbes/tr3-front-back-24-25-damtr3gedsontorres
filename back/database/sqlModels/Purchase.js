const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Shop = require("./Shop");

const Purchase = sequelize.define("Purchase", {
  amount: { type: DataTypes.INTEGER, allowNull: false }
});

Purchase.belongsTo(User);
Purchase.belongsTo(Shop);

module.exports = Purchase;
