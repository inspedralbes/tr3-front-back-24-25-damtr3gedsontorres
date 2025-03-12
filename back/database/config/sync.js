// sync.js
const sequelize = require("./sequelizeConfig");

require("../sqlModels/Enemy.js");
require("../sqlModels/Inventory.js");
require("../sqlModels/Purchase.js");
require("../sqlModels/Shop.js");
require("../sqlModels/User.js");
require("../sqlModels/Wave.js");
require("../sqlModels/Weapon.js");

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
