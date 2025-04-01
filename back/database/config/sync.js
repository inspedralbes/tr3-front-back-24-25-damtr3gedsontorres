// sync.js
const sequelize = require("./sequelizeConfig");
const mongoose = require("mongoose");
const connectDB = require("./mongoConfig");

// Importar todos los modelos SQL desde el archivo index.js
require("../sqlModels");

// Importar todos los modelos MongoDB
const mongoModels = require("../mongoModels");

const syncDB = async (exitAfterSync = false) => {
  try {
    // Sincronizar base de datos SQL con Sequelize
    await sequelize.sync({ alter: true }); // O { force: true } solo en desarrollo
    console.log("✅ Base de datos SQL sincronizada correctamente.");
    
    // Conectar y sincronizar MongoDB
    await connectDB();
    
    // Verificar que los modelos de MongoDB estén correctamente registrados
    console.log("Modelos MongoDB registrados:");
    Object.keys(mongoModels).forEach(modelName => {
      const model = mongoModels[modelName];
      console.log(`- ${modelName}: ${model.modelName}`);
      
      // Crear o actualizar colecciones en MongoDB (equivalente a sync en Sequelize)
      // MongoDB crea colecciones automáticamente cuando se insertan documentos,
      // pero podemos verificar que los modelos estén correctamente configurados
      const schema = model.schema;
      console.log(`  Schema validado: ${schema.obj ? 'Sí' : 'No'}`);
    });
    
    console.log("✅ Conexión a MongoDB establecida y modelos verificados.");
    
    if (exitAfterSync) {
      process.exit(0); // Solo finaliza el proceso si se solicita explícitamente
    }
    
    return true; // Indica que la sincronización fue exitosa
  } catch (error) {
    console.error("❌ Error al sincronizar las bases de datos:", error);
    
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
