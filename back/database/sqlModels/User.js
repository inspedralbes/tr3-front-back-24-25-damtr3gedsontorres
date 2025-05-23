const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeConfig");

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
  coins: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = User;
