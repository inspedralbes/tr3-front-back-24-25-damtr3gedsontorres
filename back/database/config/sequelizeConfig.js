const { Sequelize } = require("sequelize");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', 'environment', '.env') });

console.log(process.env.MYSQL_HOST);  // Debería mostrar 'tr3_mysql'
console.log(process.env.MYSQL_USER);  // Debería mostrar 'a23edstorcev'
console.log(process.env.MYSQL_PASSWORD);  // Debería mostrar la contraseña correcta

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,  // Nombre de la base de datos
  process.env.MYSQL_USER,      // Usuario de la base de datos
  process.env.MYSQL_PASSWORD,  // Contraseña de la base de datos
  {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,  // Host de la base de datos
    dialect: process.env.MYSQL_DIALECT,  // Dialecto de la base de datos (mysql)
    logging: false,
  }
);

module.exports = sequelize;