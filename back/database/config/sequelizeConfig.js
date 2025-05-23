const { Sequelize } = require("sequelize");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', 'environment', '.env') });

// console.log(process.env.MYSQL_HOST);  // Debería mostrar 'tr3_mysql'
// console.log(process.env.MYSQL_USER);  // Debería mostrar 'a23edstorcev'
// console.log(process.env.MYSQL_PASSWORD);  // Debería mostrar la contraseña correcta

// const sequelize = new Sequelize(
//   process.env.MYSQL_DATABASE,  // Nombre de la base de datos
//   process.env.MYSQL_USER,      // Usuario de la base de datos
//   process.env.MYSQL_PASSWORD,  // Contraseña de la base de datos
//   {
//     username: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     host: process.env.MYSQL_HOST,  // Host de la base de datos
//     dialect: process.env.MYSQL_DIALECT,  // Dialecto de la base de datos (mysql)
//     logging: false,
//   }
// );

// Configuración de conexión a la base de datos
const sequelize = new Sequelize("a23edstorcev_knightOfTheSilverEclipseDB", "a23edstorcev_a23edstorcev", "(RZy+-C+/7]mJL?T", {
  host: 'dam.inspedralbes.cat', // Cambia esto si usas Docker, ej: "db" si el servicio en Docker se llama "db"
  dialect: 'mysql', // Cambia a "postgres", "sqlite" o "mariadb" según tu base de datos
  logging: false, // Desactiva logs de SQL en la consola
});

module.exports = sequelize;