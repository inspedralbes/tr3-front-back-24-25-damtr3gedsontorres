const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeConfig");
const Enemy = require("./Enemy");

const Wave = sequelize.define("Wave", {
  waveNumber: { type: DataTypes.INTEGER, allowNull: false },
  enemyCount: { type: DataTypes.INTEGER, allowNull: false },
  difficultyLevel: { type: DataTypes.ENUM("easy", "medium", "hard", "insane"), allowNull: false }
});

Wave.belongsTo(Enemy);

module.exports = Wave;
