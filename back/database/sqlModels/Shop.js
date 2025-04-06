const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeConfig");

const Shop = sequelize.define("Shop", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.INTEGER, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Shop;
