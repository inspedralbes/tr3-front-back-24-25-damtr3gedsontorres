// sync.js
const sequelize = require("./sequelizeConfig");

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true }); // O { force: true } solo en desarrollo
    console.log("✅ Base de datos sincronizada correctamente.");
    process.exit(); // Finaliza el proceso para que el contenedor no quede colgado
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
    process.exit(1);
  }
};

syncDB();
