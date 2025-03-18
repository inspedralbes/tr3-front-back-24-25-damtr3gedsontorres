// sync.js
const sequelize = require("./sequelizeConfig");

// Importar todos los modelos desde el archivo index.js
require("../sqlModels");

const syncDB = async (exitAfterSync = false) => {
  try {
    await sequelize.sync({ alter: true }); // O { force: true } solo en desarrollo
    console.log("✅ Base de datos sincronizada correctamente.");
    
    if (exitAfterSync) {
      process.exit(0); // Solo finaliza el proceso si se solicita explícitamente
    }
    
    return true; // Indica que la sincronización fue exitosa
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
    
    if (exitAfterSync) {
      process.exit(1); // Solo finaliza el proceso con error si se solicita explícitamente
    }
    
    return false; // Indica que la sincronización falló
  }
};

// Si este archivo se ejecuta directamente (no como un módulo importado)
if (require.main === module) {
  syncDB(true); // Ejecutar con salida automática si se ejecuta como script independiente
}

module.exports = syncDB; // Exportar la función para que pueda ser utilizada en otros archivos
