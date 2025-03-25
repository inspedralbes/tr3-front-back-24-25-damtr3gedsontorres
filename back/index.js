const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar la configuración de Sequelize y la función de sincronización
const sequelize = require('./database/config/sequelizeConfig');
const syncDB = require('./database/config/sync');

// Importar rutas
const EnemyRoutes = require('./routes/tableRoutes/EneRoutes');
const InventoryRoutes = require('./routes/tableRoutes/InventoryRoutes');
const PurchaseRoutes = require('./routes/tableRoutes/PurchaseRoutes');
const ShopRoutes = require('./routes/tableRoutes/ShopRoutes');
const UserRoutes = require('./routes/tableRoutes/UserRoutes');
const WaveRoutes = require('./routes/tableRoutes/WaveRoutes');
const WeaponRoutes = require('./routes/tableRoutes/WeaponRoutes');
const PlayerRoutes = require('./routes/tableRoutes/PlayerRoutes');
const AuthRoutes = require('./routes/authRoutes');
const PlayerAuthRoutes = require('./routes/playerAuthRoutes');

// Crear la aplicación Express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar rutas
app.use('/api/enemies', EnemyRoutes);
app.use('/api/inventory', InventoryRoutes);
app.use('/api/purchases', PurchaseRoutes);
app.use('/api/shop', ShopRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/waves', WaveRoutes);
app.use('/api/weapons', WeaponRoutes);
app.use('/api/players', PlayerRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/player-auth', PlayerAuthRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;

// Iniciar servidor y sincronizar la base de datos
(async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar la base de datos
    await syncDB(false);
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
})();

// Manejar errores no controlados
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;